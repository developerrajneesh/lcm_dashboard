import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiImage } from "react-icons/fi";
import "./CreativeWorkshopPage.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

// Helper function to get image URL through proxy if it's an external URL
const getImageUrl = (url) => {
  if (!url) return null;
  
  // If it's base64, return as is
  if (url.startsWith("data:")) {
    return url;
  }
  
  // If it's an external URL (S3, etc.), use proxy to avoid CORS
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `${API_BASE_URL}/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  return url;
};

const CreativeWorkshopPage = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [groupedWorkshops, setGroupedWorkshops] = useState({});

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    // Group workshops by category
    const grouped = {};
    workshops.forEach((workshop) => {
      const categoryName = workshop.category?.name || "Uncategorized";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(workshop);
    });
    setGroupedWorkshops(grouped);
  }, [workshops]);

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/image-texts`);
      const result = await response.json();

      console.log("Fetched workshops response:", result);

      if (result.success && result.data) {
        // Log each workshop's thumbnail
        result.data.forEach((workshop, index) => {
          console.log(`Workshop ${index}:`, {
            id: workshop.id,
            thumbnail: workshop.thumbnail,
            imageCount: workshop.imageCount,
            category: workshop.category,
          });
        });
        setWorkshops(result.data);
      } else {
        setError("Failed to load workshops");
      }
    } catch (err) {
      console.error("Error fetching workshops:", err);
      setError(err.message || "Failed to fetch workshops");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="creative-workshop-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creative-workshop-page">
        <div className="error-container">
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="creative-workshop-page">
      <div className="workshop-header">
        <h1>📱 Creative Workshop Gallery</h1>
        <p className="subtitle">
          {workshops.length} {workshops.length === 1 ? "workshop" : "workshops"} available
        </p>
      </div>

      {workshops.length === 0 ? (
        <div className="empty-state">
          <FiImage className="empty-icon" />
          <p className="empty-text">No workshops yet</p>
          <p className="empty-hint">Admin needs to create workshops first</p>
        </div>
      ) : (
        <div className="workshop-categories">
          {Object.keys(groupedWorkshops).map((categoryName) => {
            const categoryWorkshops = groupedWorkshops[categoryName];
            return (
              <div key={categoryName} className="category-section">
                <div className="category-header">
                  <h2 className="category-name">{categoryName}</h2>
                  <span className="category-count">
                    {categoryWorkshops.length} {categoryWorkshops.length === 1 ? "workshop" : "workshops"}
                  </span>
                </div>
                <div className="workshop-grid">
                  {categoryWorkshops.map((workshop) => {
                    // Backend returns thumbnail directly in the list endpoint
                    const thumbnail = workshop.thumbnail;
                    const imageCount = workshop.imageCount || 0;
                    const workshopId = workshop.id || workshop._id;

                    // Check if thumbnail is valid (not null, not empty, not undefined)
                    const hasValidThumbnail = thumbnail && thumbnail.trim() !== "" && thumbnail !== "null";

                    return (
                      <div
                        key={workshopId}
                        className="workshop-card"
                        onClick={() => {
                          navigate(`/user/creative-workshop/${workshopId}`);
                        }}
                      >
                        {hasValidThumbnail && !imageErrors[workshopId] ? (
                          <img
                            src={getImageUrl(thumbnail)}
                            alt="Workshop thumbnail"
                            className="workshop-thumbnail"
                            onError={(e) => {
                              console.error("Failed to load thumbnail for workshop", workshopId, ":", thumbnail, e);
                              setImageErrors((prev) => ({
                                ...prev,
                                [workshopId]: true,
                              }));
                            }}
                            onLoad={() => {
                              console.log("Image loaded successfully for workshop", workshopId, ":", thumbnail);
                            }}
                          />
                        ) : (
                          <div className="workshop-thumbnail-placeholder">
                            <FiImage className="placeholder-icon" />
                            <span>No Image</span>
                            {!hasValidThumbnail && (
                              <span style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
                                (No thumbnail URL)
                              </span>
                            )}
                          </div>
                        )}
                        <div className="workshop-card-content">
                          <h3 className="workshop-card-title">Workshop</h3>
                          <p className="workshop-card-subtitle">
                            {imageCount} {imageCount === 1 ? "image" : "images"}
                          </p>
                          <p className="workshop-card-date">
                            {formatDate(workshop.createdAt || new Date())}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CreativeWorkshopPage;
