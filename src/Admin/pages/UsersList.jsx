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
  FiEye,
  FiPhone,
  FiCreditCard,
  FiPlus,
} from "react-icons/fi";
import "./UsersList.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToSuspend, setUserToSuspend] = useState(null);
  const [userToView, setUserToView] = useState(null);
  const [userToAssignSubscription, setUserToAssignSubscription] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState({});
  const [subscriptionForm, setSubscriptionForm] = useState({
    planId: 1,
    planName: "BASIC PLAN",
    durationMonths: 1,
    amount: 0,
  });
  const [assigningSubscription, setAssigningSubscription] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?._id;
    
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    
    if (userId) {
      headers["user-id"] = userId;
    }
    
    return headers;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/user/all`, {
        headers,
      });
      const result = await response.json();

      if (result.success) {
        const usersData = result.data || [];
        setUsers(usersData);
        
        // Fetch subscriptions for all users
        await fetchUserSubscriptions(usersData);
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

  const fetchUserSubscriptions = async (usersData) => {
    const subscriptions = {};
    const headers = getAuthHeaders();
    
    // Fetch subscription for each user
    const subscriptionPromises = usersData.map(async (user) => {
      try {
        const userId = user.id || user._id;
        const response = await fetch(`${API_BASE_URL}/subscription/user/${userId}`, {
          headers,
        });
        const result = await response.json();
        
        if (result.success && result.data) {
          subscriptions[userId] = result.data;
        } else {
          subscriptions[userId] = null;
        }
      } catch (error) {
        console.error(`Error fetching subscription for user ${user.id}:`, error);
        subscriptions[user.id || user._id] = null;
      }
    });
    
    await Promise.all(subscriptionPromises);
    setUserSubscriptions(subscriptions);
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

  const openViewModal = (user) => {
    setUserToView(user);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setUserToView(null);
  };

  const openSubscriptionModal = (user) => {
    setUserToAssignSubscription(user);
    setSubscriptionForm({
      planId: 1,
      planName: "BASIC PLAN",
      durationMonths: 1,
      amount: 0,
    });
    setIsSubscriptionModalOpen(true);
  };

  const closeSubscriptionModal = () => {
    setIsSubscriptionModalOpen(false);
    setUserToAssignSubscription(null);
    setSubscriptionForm({
      planId: 1,
      planName: "BASIC PLAN",
      durationMonths: 1,
      amount: 0,
    });
  };

  const handleAssignSubscription = async () => {
    if (!userToAssignSubscription) return;

    setAssigningSubscription(true);
    try {
      const userId = userToAssignSubscription.id || userToAssignSubscription._id;
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/subscription/assign`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: userId,
          planId: subscriptionForm.planId,
          planName: subscriptionForm.planName,
          amount: subscriptionForm.amount,
          durationMonths: subscriptionForm.durationMonths,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification(`Subscription assigned successfully to ${userToAssignSubscription.name}`, "success");
        closeSubscriptionModal();
        fetchUsers(); // Refresh users and subscriptions
      } else {
        showNotification(result.message || "Failed to assign subscription", "error");
      }
    } catch (error) {
      console.error("Error assigning subscription:", error);
      showNotification("Network error. Please try again.", "error");
    } finally {
      setAssigningSubscription(false);
    }
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

  const getSubscriptionBadge = (userId) => {
    const subscription = userSubscriptions[userId];
    
    if (!subscription) {
      return (
        <span className="status-badge status-suspended">
          <FiX className="inline mr-1" size={12} />
          No Subscription
        </span>
      );
    }

    const isExpired = subscription.endDate && new Date(subscription.endDate) < new Date();
    
    if (isExpired) {
      return (
        <span className="status-badge status-suspended">
          <FiX className="inline mr-1" size={12} />
          Expired
        </span>
      );
    }

    return (
      <span className="status-badge status-active">
        <FiCheck className="inline mr-1" size={12} />
        {subscription.planName}
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
                  <th>Subscription</th>
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
                        <div className="subscription-cell">
                          {getSubscriptionBadge(user.id || user._id)}
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar className="inline mr-1" size={14} />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => openViewModal(user)}
                            className="action-btn action-btn-view"
                            title="View User Details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => openSubscriptionModal(user)}
                            className="action-btn action-btn-subscription"
                            title="Assign Subscription"
                          >
                            <FiCreditCard />
                          </button>
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
                    <td colSpan="6" className="empty-state-cell">
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

        {/* View User Details Modal */}
        {isViewModalOpen && userToView && (
          <div className="modal-overlay" onClick={closeViewModal}>
            <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">User Details</h2>
                <button onClick={closeViewModal} className="modal-close-btn">
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="user-details-container">
                  {/* Profile Image and Name */}
                  <div className="user-details-header">
                    {userToView.profileImage ? (
                      <img
                        src={userToView.profileImage}
                        alt={userToView.name}
                        className="user-details-avatar"
                      />
                    ) : (
                      <div className="user-details-avatar-placeholder">
                        {userToView.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="user-details-name">{userToView.name}</h3>
                      <p className="user-details-email">{userToView.email}</p>
                    </div>
                  </div>

                  {/* User Information Grid */}
                  <div className="user-details-grid">
                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiUser className="user-detail-icon" />
                        Name
                      </div>
                      <div className="user-detail-value">{userToView.name}</div>
                    </div>

                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiMail className="user-detail-icon" />
                        Email
                      </div>
                      <div className="user-detail-value">{userToView.email}</div>
                    </div>

                    {userToView.phoneNumber && (
                      <div className="user-detail-item">
                        <div className="user-detail-label">
                          <FiPhone className="user-detail-icon" />
                          Phone Number
                        </div>
                        <div className="user-detail-value">{userToView.phoneNumber}</div>
                      </div>
                    )}

                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiShield className="user-detail-icon" />
                        Role
                      </div>
                      <div className="user-detail-value">
                        <span className="role-badge">{userToView.role?.toUpperCase() || "USER"}</span>
                      </div>
                    </div>

                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiCheck className="user-detail-icon" />
                        Status
                      </div>
                      <div className="user-detail-value">
                        {getStatusBadge(userToView)}
                      </div>
                    </div>

                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiCalendar className="user-detail-icon" />
                        Created At
                      </div>
                      <div className="user-detail-value">
                        {new Date(userToView.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {userToView.isSuspended && userToView.suspendedAt && (
                      <div className="user-detail-item">
                        <div className="user-detail-label">
                          <FiLock className="user-detail-icon" />
                          Suspended At
                        </div>
                        <div className="user-detail-value">
                          {new Date(userToView.suspendedAt).toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiCheck className="user-detail-icon" />
                        Verified
                      </div>
                      <div className="user-detail-value">
                        {userToView.isVerified ? (
                          <span className="status-badge status-active">Verified</span>
                        ) : (
                          <span className="status-badge status-suspended">Not Verified</span>
                        )}
                      </div>
                    </div>

                    {userToView.referralCode && (
                      <div className="user-detail-item">
                        <div className="user-detail-label">
                          <FiUser className="user-detail-icon" />
                          Referral Code
                        </div>
                        <div className="user-detail-value">
                          <code className="referral-code">{userToView.referralCode}</code>
                        </div>
                      </div>
                    )}

                    <div className="user-detail-item">
                      <div className="user-detail-label">
                        <FiUser className="user-detail-icon" />
                        User ID
                      </div>
                      <div className="user-detail-value">
                        <code className="user-id">{userToView.id}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={closeViewModal} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Subscription Modal */}
        {isSubscriptionModalOpen && userToAssignSubscription && (
          <div className="modal-overlay" onClick={closeSubscriptionModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Assign Subscription</h2>
                <button onClick={closeSubscriptionModal} className="modal-close-btn">
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="subscription-form">
                  <p className="modal-message">
                    Assign subscription to{" "}
                    <span className="font-semibold">{userToAssignSubscription.name}</span>
                  </p>

                  <div className="form-group">
                    <label htmlFor="planName">Plan Name</label>
                    <select
                      id="planName"
                      value={subscriptionForm.planName}
                      onChange={(e) => {
                        const planName = e.target.value;
                        setSubscriptionForm({
                          ...subscriptionForm,
                          planName: planName,
                          planId: planName === "PREMIUM PLAN" ? 2 : 1,
                        });
                      }}
                      className="form-input"
                    >
                      <option value="BASIC PLAN">BASIC PLAN</option>
                      <option value="PREMIUM PLAN">PREMIUM PLAN</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="durationMonths">Duration (Months)</label>
                    <input
                      id="durationMonths"
                      type="number"
                      min="1"
                      max="12"
                      value={subscriptionForm.durationMonths}
                      onChange={(e) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
                          durationMonths: parseInt(e.target.value) || 1,
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="amount">Amount (₹)</label>
                    <input
                      id="amount"
                      type="number"
                      min="0"
                      value={subscriptionForm.amount}
                      onChange={(e) =>
                        setSubscriptionForm({
                          ...subscriptionForm,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="form-input"
                      placeholder="0 for free assignment"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={closeSubscriptionModal} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleAssignSubscription}
                  className="btn-primary"
                  disabled={assigningSubscription}
                >
                  {assigningSubscription ? "Assigning..." : "Assign Subscription"}
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
