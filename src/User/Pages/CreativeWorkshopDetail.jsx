import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import html2canvas from "html2canvas";
import "./CreativeWorkshopDetail.css";

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

const CreativeWorkshopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});
  const imageRefs = useRef({});
  const [userData, setUserData] = useState({ username: "User", usernumber: "", userLogo: null });

  useEffect(() => {
    // Load user data for placeholders
    const loadUserData = () => {
      try {
        const userDataStr = localStorage.getItem("user");
        if (userDataStr) {
          const user = JSON.parse(userDataStr);
          setUserData({
            username: user.name || "User",
            usernumber: user.phoneNumber || "",
            userLogo: user.profileImage || null,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchWorkshop(id);
    } else {
      setError("No workshop ID provided");
      setLoading(false);
    }
  }, [id]);

  const fetchWorkshop = async (workshopId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/image-texts/${workshopId}`);
      const result = await response.json();

      console.log("Fetched workshop data:", result);

      if (result.success && result.data) {
        // Ensure image URLs are properly formatted
        if (result.data.images && Array.isArray(result.data.images)) {
          result.data.images = result.data.images.map((img) => {
            // Ensure base64 has data: prefix if it's base64
            if (img.imageBase64 && !img.imageBase64.startsWith("data:")) {
              img.imageBase64 = `data:image/png;base64,${img.imageBase64}`;
            }
            return img;
          });
        }
        setData(result.data);
        console.log("Workshop images:", result.data.images);
      } else {
        throw new Error("Failed to load workshop data");
      }
    } catch (err) {
      console.error("Error fetching workshop:", err);
      setError(err.message || "Failed to fetch workshop");
    } finally {
      setLoading(false);
    }
  };

  // Handle image load to get dimensions
  const handleImageLoad = (imageIndex) => {
    const img = imageRefs.current[imageIndex];
    if (img && data?.images?.[imageIndex]) {
      const imgRect = img.getBoundingClientRect();
      setImageDimensions((prev) => ({
        ...prev,
        [imageIndex]: {
          width: imgRect.width,
          height: imgRect.height,
        },
      }));
      setImagesLoaded((prev) => ({
        ...prev,
        [imageIndex]: true,
      }));
    }
  };

  // Handle image error
  const handleImageError = (imageIndex) => {
    console.error(`Failed to load image ${imageIndex}`);
    setImagesLoaded((prev) => ({
      ...prev,
      [imageIndex]: false,
    }));
  };


  // Calculate scaled font size
  const getScaledFontSize = (originalFontSize, imageIndex) => {
    const imageData = data?.images?.[imageIndex];
    if (!imageData || !imageDimensions[imageIndex]) {
      return originalFontSize;
    }

    const { originalWidth } = imageData;
    const { width: renderedWidth } = imageDimensions[imageIndex];

    if (originalWidth === 0 || renderedWidth === 0) return originalFontSize;

    const scaleFactor = renderedWidth / originalWidth;
    return originalFontSize * scaleFactor;
  };

  // Load image and convert to base64 if needed
  const loadImageAsBase64 = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        
        try {
          const base64 = canvas.toDataURL("image/png");
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = reject;
      img.src = src;
    });
  };

  // Download image with text overlays using canvas
  const handleDownload = async (imageIndex) => {
    if (!data || !data.images || !data.images[imageIndex]) {
      alert("No image to download");
      return;
    }

    setDownloading(true);

    try {
      const imageData = data.images[imageIndex];
      const imageSrc = getImageUrl(imageData.imageUrl || imageData.imageBase64);
      
      if (!imageSrc) {
        throw new Error("No image source available");
      }

      console.log("Loading image for download:", imageSrc);

      // Load the image and convert to base64
      let imageBase64 = imageSrc;
      if (!imageSrc.startsWith("data:")) {
        // If it's not base64, load it and convert
        imageBase64 = await loadImageAsBase64(imageSrc);
      }

      // Create a new image element to get dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageBase64;
      });

      // Use original dimensions if available, otherwise use loaded image dimensions
      const canvasWidth = imageData.originalWidth > 0 
        ? imageData.originalWidth 
        : (img.naturalWidth || img.width);
      const canvasHeight = imageData.originalHeight > 0 
        ? imageData.originalHeight 
        : (img.naturalHeight || img.height);

      console.log("Canvas dimensions:", canvasWidth, "x", canvasHeight);

      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      // Draw the image
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      console.log("Image drawn on canvas");

      // Draw text overlays
      if (imageData.texts && imageData.texts.length > 0) {
        // Load user logo image if needed
        let userLogoImg = null;
        const hasUserLogo = imageData.texts.some(t => t.text && t.text.includes("{{userLogo}}"));
        if (hasUserLogo && userData.userLogo) {
          userLogoImg = new Image();
          userLogoImg.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            userLogoImg.onload = resolve;
            userLogoImg.onerror = reject;
            userLogoImg.src = userData.userLogo;
          });
        }

        imageData.texts.forEach((text) => {
          // Replace placeholders in text
          let displayText = text.text || "";
          displayText = displayText.replace(/\{\{username\}\}/g, userData.username);
          displayText = displayText.replace(/\{\{usernumber\}\}/g, userData.usernumber);
          
          // Handle {{userLogo}} - draw image instead of text
          if (displayText.trim() === "{{userLogo}}" && userLogoImg) {
            const logoSize = (text.fontSize || 24) * 2;
            const x = text.x * canvasWidth;
            const y = text.y * canvasHeight;
            
            // Draw user logo as circular image
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(userLogoImg, x, y, logoSize, logoSize);
            ctx.restore();
            return; // Skip text rendering for logo
          }
          
          // Remove {{userLogo}} from text if mixed
          displayText = displayText.replace(/\{\{userLogo\}\}/g, "");
          
          if (!displayText) return; // Skip if no text to display

          const x = text.x * canvasWidth;
          const y = text.y * canvasHeight;
          const fontSize = text.fontSize || 24;

          // Set font properties
          const fontStyle = text.italic ? "italic" : "normal";
          const fontWeight = text.bold ? "bold" : "normal";
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${text.fontFamily || "sans-serif"}`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          // Measure text with replaced content
          const metrics = ctx.measureText(displayText);
          const textWidth = metrics.width;
          const textHeight = fontSize;
          const padding = 4;

          // Draw background if needed
          if (text.bgColor && text.bgColor !== "transparent") {
            ctx.fillStyle = text.bgColor;
            const borderRadius = text.borderRadius || 0;
            
            if (borderRadius > 0) {
              ctx.beginPath();
              ctx.roundRect(
                x - padding,
                y - padding,
                textWidth + padding * 2,
                textHeight + padding * 2,
                borderRadius
              );
              ctx.fill();
            } else {
              ctx.fillRect(
                x - padding,
                y - padding,
                textWidth + padding * 2,
                textHeight + padding * 2
              );
            }
          }

          // BORDER FEATURE COMPLETELY REMOVED - No borders will be drawn on canvas

          // Draw text with replaced placeholders
          ctx.fillStyle = text.color || "#000000";
          ctx.fillText(displayText, x, y);
        });
        console.log("Text overlays drawn");
      }

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to create image blob");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `workshop-${data._id || data.id}-image-${imageIndex + 1}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Download completed");
      }, "image/png");
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download image: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Download all images
  const handleDownloadAll = async () => {
    if (!data || !data.images || data.images.length === 0) {
      alert("No images to download");
      return;
    }

    setDownloading(true);

    try {
      // Wait for all images to be loaded
      const waitForAllImages = async () => {
        const maxWait = 10000; // 10 seconds max
        const startTime = Date.now();
        while (Object.keys(imagesLoaded).length < data.images.length && Date.now() - startTime < maxWait) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      };
      await waitForAllImages();

      for (let i = 0; i < data.images.length; i++) {
        try {
          await handleDownload(i);
          // Small delay between downloads
          if (i < data.images.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        } catch (err) {
          console.error(`Failed to download image ${i + 1}:`, err);
          // Continue with next image
        }
      }
      alert(`Download process completed for ${data.images.length} image(s)!`);
    } catch (err) {
      alert("Failed to download images: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="workshop-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading workshop...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="workshop-detail-page">
        <div className="error-container">
          <p>❌ {error || "Failed to load data"}</p>
          <button className="back-button" onClick={() => navigate("/user/creative-workshop")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="workshop-detail-page">
      <div className="detail-header">
        <button className="back-button-header" onClick={() => navigate("/user/creative-workshop")}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="detail-title">Workshop</h1>
        <button
          className="download-all-button"
          onClick={handleDownloadAll}
          disabled={downloading}
        >
          {downloading ? "Downloading..." : <><FiDownload /> Download</>}
        </button>
      </div>

      <div className="detail-content">
        {!data.images || data.images.length === 0 ? (
          <div className="empty-state">
            <p>No images in this workshop</p>
          </div>
        ) : (
          <div className="images-container">
            {data.images.map((imageData, imageIndex) => {
              console.log(`Rendering image ${imageIndex}:`, {
                imageUrl: imageData.imageUrl,
                imageBase64: imageData.imageBase64 ? "present" : "missing",
                texts: imageData.texts?.length || 0,
              });
              // Calculate aspect ratio - use defaults if dimensions are missing
              const originalWidth = imageData.originalWidth || 800;
              const originalHeight = imageData.originalHeight || 600;
              const imageAspectRatio = originalWidth / originalHeight;
              const displayWidth = Math.min(800, window.innerWidth - 80);
              const displayHeight = displayWidth / imageAspectRatio;

              const renderedDimensions = imageDimensions[imageIndex];
              const containerWidth = renderedDimensions?.width || displayWidth;
              const containerHeight = renderedDimensions?.height || displayHeight;

              return (
                <div key={imageIndex} className="image-wrapper">
                  <div
                    id={`image-container-${imageIndex}`}
                    className="image-container"
                    style={{
                      width: displayWidth,
                      height: displayHeight,
                      position: "relative",
                    }}
                  >
                    {(imageData.imageUrl || imageData.imageBase64) ? (
                      <img
                        ref={(el) => {
                          if (el) imageRefs.current[imageIndex] = el;
                        }}
                        src={getImageUrl(imageData.imageUrl || imageData.imageBase64)}
                        alt={`Workshop image ${imageIndex + 1}`}
                        className="workshop-image"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        onLoad={() => {
                          console.log(`Image ${imageIndex} loaded:`, imageData.imageUrl || imageData.imageBase64);
                          handleImageLoad(imageIndex);
                        }}
                        onError={(e) => {
                          console.error(`Image ${imageIndex} failed to load:`, imageData.imageUrl || imageData.imageBase64, e);
                          handleImageError(imageIndex);
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" }}>
                        <p>No image available</p>
                      </div>
                    )}

                    {/* Render text overlays */}
                    {renderedDimensions &&
                      imageData.texts?.map((text, textIndex) => {
                        const scaledFontSize = getScaledFontSize(text.fontSize, imageIndex);
                        const absoluteX = text.x * containerWidth;
                        const absoluteY = text.y * containerHeight;

                        // BORDER FEATURE COMPLETELY REMOVED - No border properties will be added

                        // Replace placeholders in text
                        let displayText = text.text || "";
                        displayText = displayText.replace(/\{\{username\}\}/g, userData.username);
                        displayText = displayText.replace(/\{\{usernumber\}\}/g, userData.usernumber);
                        
                        // Handle {{userLogo}} - render image instead of text
                        if (displayText.trim() === "{{userLogo}}" || (displayText.trim() === "" && text.text?.trim() === "{{userLogo}}")) {
                          if (userData.userLogo) {
                            return (
                              <img
                                key={textIndex}
                                src={userData.userLogo}
                                alt="User Logo"
                                style={{
                                  position: "absolute",
                                  left: `${absoluteX}px`,
                                  top: `${absoluteY}px`,
                                  width: `${scaledFontSize * 2}px`,
                                  height: `${scaledFontSize * 2}px`,
                                  borderRadius: `${text.borderRadius || scaledFontSize}px`,
                                  objectFit: "cover",
                                }}
                              />
                            );
                          } else {
                            return null;
                          }
                        }
                        
                        // Remove {{userLogo}} from text if mixed
                        displayText = displayText.replace(/\{\{userLogo\}\}/g, "");

                        // Build style object - NO border properties
                        const textStyle = {
                          position: "absolute",
                          left: `${absoluteX}px`,
                          top: `${absoluteY}px`,
                          fontSize: `${scaledFontSize}px`,
                          fontFamily: text.fontFamily || "sans-serif",
                          color: text.color || "#000000",
                          backgroundColor: text.bgColor || "transparent",
                          fontWeight: text.bold ? "bold" : "normal",
                          fontStyle: text.italic ? "italic" : "normal",
                          padding: "4px 8px",
                          borderRadius: `${text.borderRadius || 0}px`,
                          // NO border properties - borders are completely disabled
                        };

                        return (
                          <div
                            key={textIndex}
                            className="text-overlay-web"
                            style={textStyle}
                          >
                            {displayText}
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
    </div>
  );
};

export default CreativeWorkshopDetail;

