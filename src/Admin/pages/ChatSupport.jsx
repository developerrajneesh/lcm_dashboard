import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FiSend, FiMessageCircle, FiUsers, FiSearch, FiX } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:5000";

const ChatSupport = () => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const [user, setUser] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const hasAutoSelectedRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
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

  // Update ref when selectedConversation changes
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (!user) return;

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
        const currentConv = selectedConversationRef.current;
        
        // Add message to messages if it matches the selected conversation
        if (currentConv && String(message.conversationId) === String(currentConv.conversationId)) {
          setMessages((prev) => {
            // Check if message already exists to avoid duplicates
            const exists = prev.some((m) => {
              if (m._id && message._id) return String(m._id) === String(message._id);
              return m.message === message.message && m.createdAt === message.createdAt;
            });
            if (exists) return prev;
            return [...prev, message];
          });
          setTimeout(scrollToBottom, 100);
        }
        
        // Always refresh conversations to update unread count and last message
        fetchConversations();
      }
    });

    newSocket.on("message_sent", (data) => {
      if (data.success && data.data) {
        const message = data.data;
        const currentConv = selectedConversationRef.current;
        
        // Add message to messages if it matches the selected conversation
        if (currentConv && String(message.conversationId) === String(currentConv.conversationId)) {
          setMessages((prev) => {
            // Remove any temporary messages with the same content
            const filtered = prev.filter((m) => !(m._id?.startsWith("temp_") && m.message === message.message));
            // Check if message already exists to avoid duplicates
            const exists = filtered.some((m) => {
              if (m._id && message._id) return String(m._id) === String(message._id);
              return m.message === message.message && m.createdAt === message.createdAt;
            });
            if (exists) return filtered;
            return [...filtered, message];
          });
          setTimeout(scrollToBottom, 100);
        }
        
        // Update conversations list to show latest message
        fetchConversations();
      }
    });

    setSocket(newSocket);
    // Fetch conversations and auto-select first one on initial load
    fetchConversations(true);
    // Fetch all users for search
    fetchAllUsers();

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch all users for search
  const fetchAllUsers = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/user/all`, {
        headers: {
          "user-id": user.id,
        },
      });
      const result = await response.json();
      
      if (result.success) {
        // Filter out admin users and current user
        const regularUsers = result.data.filter(
          (u) => u.role !== "admin" && String(u.id || u._id) !== String(user.id)
        );
        setAllUsers(regularUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = allUsers.filter((u) =>
        (u.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Start conversation with selected user
  const startConversationWithUser = (selectedUser) => {
    const userId = selectedUser.id || selectedUser._id;
    const convId = [user.id, userId].sort().join("_");
    
    // Check if conversation already exists
    const existingConv = conversations.find((c) => c.conversationId === convId);
    
    if (existingConv) {
      // Conversation exists, just select it
      fetchMessages(existingConv);
    } else {
      // Create new conversation object
      const newConversation = {
        conversationId: convId,
        user: selectedUser,
        lastMessage: null,
        unreadCount: 0,
      };
      setSelectedConversation(newConversation);
      setMessages([]);
      // The conversation will be created when first message is sent
    }
    
    // Clear search
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const fetchConversations = async (autoSelectFirst = false) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat/admin/conversations`, {
        headers: {
          "user-id": user.id,
        },
      });
      const result = await response.json();
      
      if (result.success) {
        const conversationsList = result.data || [];
        setConversations(conversationsList);
        
        // Auto-select first conversation if available and autoSelectFirst is true and hasn't been selected yet
        if (autoSelectFirst && conversationsList.length > 0 && !hasAutoSelectedRef.current) {
          hasAutoSelectedRef.current = true;
          fetchMessages(conversationsList[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      const response = await fetch(`${API_BASE_URL}/chat/messages/${conversation.conversationId}`, {
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
    if (!newMessage.trim() || !socket || !selectedConversation) return;

    const userInfo = selectedConversation.user;
    const receiverId = userInfo._id || userInfo.id;
    const messageText = newMessage.trim();
    
    // Ensure conversationId exists (create if needed)
    let conversationId = selectedConversation.conversationId;
    if (!conversationId && receiverId) {
      conversationId = [user.id, receiverId].sort().join("_");
      // Update selected conversation with the conversationId
      setSelectedConversation({
        ...selectedConversation,
        conversationId: conversationId,
      });
    }
    
    const messageData = {
      senderId: user.id,
      receiverId: receiverId,
      message: messageText,
      conversationId: conversationId,
    };

    // Optimistically add message to UI immediately
    const tempMessage = {
      _id: `temp_${Date.now()}`,
      senderId: user.id, // Add senderId for proper alignment check
      sender: { _id: user.id, name: user.name, email: user.email },
      receiver: userInfo,
      message: messageText,
      conversationId: conversationId,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");
    setTimeout(scrollToBottom, 100);

    // Send via socket
    socket.emit("send_message", messageData);
    
    // Update conversation list after sending (to show new conversation if it's the first message)
    setTimeout(() => {
      fetchConversations();
    }, 500);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50 overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <FiUsers className="w-5 h-5" />
            Conversations
          </h2>
          {/* Search Bar */}
          <div className="relative">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users by name..."
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchResults.map((searchUser) => {
                  const userId = searchUser.id || searchUser._id;
                  return (
                    <button
                      key={userId}
                      onClick={() => startConversationWithUser(searchUser)}
                      className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                    >
                      {searchUser.profileImage ? (
                        <img
                          src={searchUser.profileImage}
                          alt={searchUser.name || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {(searchUser.name || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {searchUser.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {searchUser.email || ""}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                No users found
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => fetchMessages(conv)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedConversation?.conversationId === conv.conversationId
                    ? "bg-indigo-50 border-indigo-200"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {conv.user?.profileImage && !imageErrors.has(conv.conversationId) ? (
                    <img
                      src={conv.user.profileImage}
                      alt={conv.user?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={() => {
                        setImageErrors((prev) => new Set(prev).add(conv.conversationId));
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {(conv.user?.name || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 truncate">
                        {conv.user?.name || "User"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage?.message || "No messages"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                {selectedConversation.user?.profileImage && 
                 !imageErrors.has(`header_${selectedConversation.conversationId}`) ? (
                  <img
                    src={selectedConversation.user.profileImage}
                    alt={selectedConversation.user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => {
                      setImageErrors((prev) => new Set(prev).add(`header_${selectedConversation.conversationId}`));
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {(selectedConversation.user?.name || "U")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.user?.name || "User"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.user?.email || ""}
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
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  // Check if message is from current admin user
                  // Backend populates senderId as an object, so check both senderId._id and senderId directly
                  const senderId = msg.senderId?._id || msg.senderId || msg.sender?._id || msg.sender;
                  const isOwnMessage = String(senderId) === String(user.id);
                  return (
                    <div
                      key={index}
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
                          {formatTime(msg.createdAt)}
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSupport;

