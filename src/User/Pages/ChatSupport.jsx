import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FiSend, FiMessageCircle } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;
const SOCKET_URL = BACKEND_URL;

const ChatSupport = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const pendingMessagesRef = useRef(new Map()); // Track pending messages by content

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("join", user.id);
    });

    newSocket.on("receive_message", (data) => {
      if (data.success && data.data) {
        const message = data.data;
        // Only process messages from admin (not own messages)
        const senderId = message.senderId?._id || message.senderId || message.sender?._id || message.sender;
        if (String(senderId) === String(user.id)) {
          // This is our own message, ignore it (handled by message_sent)
          return;
        }
        
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some((m) => {
            // Check by ID first
            if (m._id && message._id) {
              return String(m._id) === String(message._id);
            }
            // Check by content, sender, and timestamp (within 5 seconds)
            const mSenderId = m.senderId?._id || m.senderId || m.sender?._id || m.sender;
            return m.message === message.message && 
                   String(mSenderId) === String(senderId) &&
                   Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000;
          });
          if (exists) return prev;
          return [...prev, message];
        });
        setTimeout(scrollToBottom, 100);
      }
    });

    newSocket.on("message_sent", (data) => {
      if (data.success && data.data) {
        const message = data.data;
        // Only process messages sent by current user
        const senderId = message.senderId?._id || message.senderId || message.sender?._id || message.sender;
        if (String(senderId) !== String(user.id)) {
          // This is not our message, ignore it (handled by receive_message)
          return;
        }
        
        setMessages((prev) => {
          // Remove any temporary messages with the same content
          const filtered = prev.filter((m) => {
            // Remove temp messages that match this message
            if (m._id?.startsWith("temp_") && m.message === message.message) {
              return false;
            }
            // Check if this real message is a duplicate
            if (m._id && message._id && String(m._id) === String(message._id)) {
              return false; // Remove duplicate
            }
            // Keep all other messages
            return true;
          });
          
          // Check if message already exists (by ID)
          const exists = filtered.some((m) => {
            if (m._id && message._id) {
              return String(m._id) === String(message._id);
            }
            return false;
          });
          
          if (exists) {
            // Message already exists, just remove from pending
            pendingMessagesRef.current.delete(message.message);
            return filtered;
          }
          
          // Remove from pending messages
          pendingMessagesRef.current.delete(message.message);
          
          // Add the real message
          return [...filtered, message];
        });
        setTimeout(scrollToBottom, 100);
      }
    });

    setSocket(newSocket);

    // Fetch admin info and create/get conversation
    fetchAdminAndConversation();

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const fetchAdminAndConversation = async () => {
    try {
      setLoading(true);
      
      // Get admin user
      const usersResponse = await fetch(`${API_BASE_URL}/user/all`, {
        headers: {
          "user-id": user.id,
        },
      });
      const usersResult = await usersResponse.json();
      
      if (usersResult.success) {
        const admin = usersResult.data.find((u) => u.role === "admin");
        if (admin) {
          setAdminInfo(admin);
          const convId = [user.id, admin.id].sort().join("_");
          setConversationId(convId);
          
          // Fetch existing messages
          await fetchMessages(convId);
        }
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages/${convId}`, {
        headers: {
          "user-id": user.id,
        },
      });
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !conversationId || !adminInfo) return;

    const messageText = newMessage.trim();
    
    // Check if this message is already pending
    if (pendingMessagesRef.current.has(messageText)) {
      return; // Don't send duplicate
    }
    
    const messageData = {
      senderId: user.id,
      receiverId: adminInfo.id,
      message: messageText,
      conversationId: conversationId,
    };

    // Track this as pending
    pendingMessagesRef.current.set(messageText, Date.now());

    // Optimistically add message to UI immediately
    const tempMessage = {
      _id: `temp_${Date.now()}_${Math.random()}`,
      sender: { _id: user.id, name: user.name, email: user.email },
      receiver: adminInfo,
      message: messageText,
      conversationId: conversationId,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages((prev) => {
      // Check if message already exists (prevent double sending)
      const exists = prev.some((m) => 
        m.message === messageText && 
        (m.sender?._id === user.id || m.sender === user.id) &&
        Math.abs(new Date(m.createdAt).getTime() - Date.now()) < 2000
      );
      if (exists) return prev;
      return [...prev, tempMessage];
    });
    
    setNewMessage("");
    setTimeout(scrollToBottom, 100);

    // Send via socket
    socket.emit("send_message", messageData);
    
    // Clean up pending message after 10 seconds if not confirmed
    setTimeout(() => {
      pendingMessagesRef.current.delete(messageText);
    }, 10000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <FiMessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chat Support</h2>
            <p className="text-sm text-gray-500">
              {adminInfo ? `Chatting with ${adminInfo.name || "Admin"}` : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            // Check if message is from current user
            const senderId = msg.senderId?._id || msg.senderId || msg.sender?._id || msg.sender;
            const isOwnMessage = String(senderId) === String(user.id);
            // Use unique key: _id if available, otherwise use index + message + timestamp
            const messageKey = msg._id || `msg_${index}_${msg.message}_${msg.createdAt}`;
            return (
              <div
                key={messageKey}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-indigo-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !socket}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <FiSend className="w-5 h-5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSupport;

