import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiCheck,
  FiX,
  FiLock,
  FiUnlock,
  FiRefreshCw,
} from "react-icons/fi";
import "./UsersList.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/all`);
      const result = await response.json();

      if (result.success) {
        setUsers(result.data || []);
      } else {
        showNotification("Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/user/${userToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        showNotification("User deleted successfully!", "success");
        fetchUsers(); // Refresh the list
        closeDeleteModal();
      } else {
        showNotification(result.message || "Failed to delete user", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("Network error. Please try again.", "error");
    }
  };

  const handleSuspendToggle = async () => {
    if (!userToSuspend) return;

    const shouldSuspend = !userToSuspend.isSuspended;

    try {
      const response = await fetch(`${API_BASE_URL}/user/${userToSuspend.id}/suspend`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ suspend: shouldSuspend }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification(
          shouldSuspend ? "User suspended successfully!" : "User unsuspended successfully!",
          "success"
        );
        fetchUsers(); // Refresh the list
        closeSuspendModal();
      } else {
        showNotification(result.message || "Failed to update user status", "error");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      showNotification("Network error. Please try again.", "error");
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const openSuspendModal = (user) => {
    setUserToSuspend(user);
    setIsSuspendModalOpen(true);
  };

  const closeSuspendModal = () => {
    setIsSuspendModalOpen(false);
    setUserToSuspend(null);
  };

  // Notification handler
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  // Role icon component
  const RoleIcon = ({ role }) => {
    const icons = {
      admin: <FiShield className="text-blue-500" />,
      user: <FiUser className="text-gray-500" />,
    };
    return icons[role] || icons.user;
  };

  const getStatusBadge = (user) => {
    if (user.isSuspended) {
      return (
        <span className="status-badge status-suspended">
          <FiLock className="inline mr-1" size={12} />
          Suspended
        </span>
      );
    }
    return (
      <span className="status-badge status-active">
        <FiCheck className="inline mr-1" size={12} />
        Active
      </span>
    );
  };

  if (loading) {
    return (
      <div className="users-list-page">
        <div className="loading-container">
          <FiRefreshCw className="animate-spin" size={32} />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-page">
      <div className="users-container">
        {/* Header */}
        <div className="users-header">
          <div>
            <h1 className="users-title">User Management</h1>
            <p className="users-subtitle">Manage all users and their accounts</p>
          </div>
          <button onClick={fetchUsers} className="refresh-btn">
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`notification ${
              notification.type === "success" ? "notification-success" : "notification-error"
            }`}
          >
            {notification.type === "success" ? (
              <FiCheck className="mr-2" />
            ) : (
              <FiX className="mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="users-table-container">
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="user-avatar"
                            />
                          ) : (
                            <div className="user-avatar-placeholder">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">
                              <FiMail className="inline mr-1" size={14} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="role-cell">
                          <RoleIcon role={user.role} />
                          <span className="role-text">{user.role}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(user)}</td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar className="inline mr-1" size={14} />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => openSuspendModal(user)}
                            className={`action-btn ${
                              user.isSuspended ? "action-btn-unsuspend" : "action-btn-suspend"
                            }`}
                            title={user.isSuspended ? "Unsuspend User" : "Suspend User"}
                          >
                            {user.isSuspended ? <FiUnlock /> : <FiLock />}
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="action-btn action-btn-delete"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state-cell">
                      <div className="empty-state">
                        <FiUser className="empty-state-icon" />
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="modal-overlay" onClick={closeDeleteModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Confirm Deletion</h2>
                <button onClick={closeDeleteModal} className="modal-close-btn">
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p className="modal-message">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{userToDelete?.name}</span>?
                  <br />
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={closeDeleteModal} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn-danger">
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suspend/Unsuspend Confirmation Modal */}
        {isSuspendModalOpen && (
          <div className="modal-overlay" onClick={closeSuspendModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {userToSuspend?.isSuspended ? "Unsuspend User" : "Suspend User"}
                </h2>
                <button onClick={closeSuspendModal} className="modal-close-btn">
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal-body">
                <p className="modal-message">
                  Are you sure you want to{" "}
                  {userToSuspend?.isSuspended ? "unsuspend" : "suspend"}{" "}
                  <span className="font-semibold">{userToSuspend?.name}</span>?
                  <br />
                  {userToSuspend?.isSuspended
                    ? "The user will be able to access their account again."
                    : "The user will not be able to access their account."}
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={closeSuspendModal} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSuspendToggle} className="btn-warning">
                  {userToSuspend?.isSuspended ? "Unsuspend" : "Suspend"} User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
