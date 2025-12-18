import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiXCircle } from "react-icons/fi";
import "./CategoryManagement.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`);
      const result = await response.json();

      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setError("Failed to fetch categories");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const url = editingCategory
        ? `${API_BASE_URL}/categories/${editingCategory._id}`
        : `${API_BASE_URL}/categories`;
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        handleCloseModal();
        fetchCategories();
      } else {
        setError(result.error || "Failed to save category");
      }
    } catch (err) {
      setError(err.message || "Failed to save category");
    }
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/${categoryToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setCategories(categories.filter((c) => c._id !== categoryToDelete._id));
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      } else {
        setError(result.error || "Failed to delete category");
      }
    } catch (err) {
      setError(err.message || "Failed to delete category");
    }
  };

  const toggleActive = async (category) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/${category._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !category.isActive,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        fetchCategories();
      } else {
        setError(result.error || "Failed to update category");
      }
    } catch (err) {
      setError(err.message || "Failed to update category");
    }
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
      <div className="category-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-management">
      <div className="management-header">
        <div>
          <h1>Category Management</h1>
          <p className="subtitle">Create and manage categories for creative workshops</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => handleOpenModal()}
        >
          <FiPlus className="icon" />
          Create Category
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found</p>
          <button
            className="btn-primary"
            onClick={() => handleOpenModal()}
          >
            Create Your First Category
          </button>
        </div>
      ) : (
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="category-name">{category.name}</td>
                  <td className="category-description">
                    {category.description || <span className="text-muted">No description</span>}
                  </td>
                  <td>
                    <button
                      className={`status-badge ${category.isActive ? "active" : "inactive"}`}
                      onClick={() => toggleActive(category)}
                    >
                      {category.isActive ? (
                        <>
                          <FiCheck className="icon" />
                          Active
                        </>
                      ) : (
                        <>
                          <FiXCircle className="icon" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="category-date">{formatDate(category.createdAt)}</td>
                  <td className="category-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenModal(category)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(category)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? "Edit Category" : "Create Category"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter category name"
                  required
                  maxLength={50}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter category description (optional)"
                  rows={4}
                  maxLength={200}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
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
                  setCategoryToDelete(null);
                }}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete this category? This action cannot
                be undone.
              </p>
              {categoryToDelete && (
                <p className="delete-warning">
                  <strong>Category:</strong> {categoryToDelete.name}
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
                  setCategoryToDelete(null);
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

export default CategoryManagement;

