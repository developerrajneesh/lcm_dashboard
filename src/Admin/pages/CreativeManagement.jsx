import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreativeManagement.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const CreativeManagement = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/image-texts`);
      const result = await response.json();

      if (result.success && result.data) {
        setWorkshops(result.data);
      } else {
        setError("Failed to fetch workshops");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch workshops");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (workshop) => {
    setWorkshopToDelete(workshop);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!workshopToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/image-texts/${workshopToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setWorkshops(workshops.filter((w) => w.id !== workshopToDelete.id));
        setShowDeleteModal(false);
        setWorkshopToDelete(null);
        alert("Workshop deleted successfully!");
      } else {
        const errorData = await response.json();
        alert("Failed to delete: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error deleting workshop: " + err.message);
    }
  };

  const handleView = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handleEdit = (workshop) => {
    // Navigate to editor with workshop data
    navigate(`/admin/image-text-editor?edit=${workshop.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="creative-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="creative-management">
      <div className="management-header">
        <h1>Creative Management</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/image-text-editor")}
        >
          + Create New Workshop
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={fetchWorkshops}>Retry</button>
        </div>
      )}

      {workshops.length === 0 ? (
        <div className="empty-state">
          <p>No workshops found</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/admin/image-text-editor")}
          >
            Create Your First Workshop
          </button>
        </div>
      ) : (
        <>
          <div className="workshops-grid">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="workshop-card">
                <div className="workshop-thumbnail">
                  {workshop.thumbnail ? (
                    <img
                      src={workshop.thumbnail}
                      alt={`Workshop ${workshop.id}`}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="placeholder-image">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="workshop-info">
                  <h3>Workshop #{workshop.id.slice(-8)}</h3>
                  <p className="workshop-meta">
                    {workshop.imageCount} {workshop.imageCount === 1 ? "image" : "images"}
                  </p>
                  <p className="workshop-date">{formatDate(workshop.createdAt)}</p>
                </div>
                <div className="workshop-actions">
                  <button
                    className="btn-view"
                    onClick={() => handleView(workshop)}
                  >
                    👁️ View
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(workshop)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(workshop)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View Modal */}
      {selectedWorkshop && (
        <div className="modal-overlay" onClick={() => setSelectedWorkshop(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Workshop Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedWorkshop(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>ID:</strong> {selectedWorkshop.id}
              </p>
              <p>
                <strong>Images:</strong> {selectedWorkshop.imageCount}
              </p>
              <p>
                <strong>Created:</strong> {formatDate(selectedWorkshop.createdAt)}
              </p>
              {selectedWorkshop.thumbnail && (
                <div className="modal-thumbnail">
                  <img
                    src={selectedWorkshop.thumbnail}
                    alt="Workshop thumbnail"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedWorkshop(null);
                  handleEdit(selectedWorkshop);
                }}
              >
                Edit Workshop
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSelectedWorkshop(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowDeleteModal(false);
                  setWorkshopToDelete(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this workshop? This action cannot
                be undone.
              </p>
              {workshopToDelete && (
                <p className="delete-warning">
                  <strong>Workshop ID:</strong> {workshopToDelete.id}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setWorkshopToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeManagement;

