import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiUpload, FiSave, FiArrowLeft, FiX, FiType, FiImage, FiEdit2, FiTrash2, FiBold, FiItalic } from 'react-icons/fi';

// Custom Draggable component compatible with React 19
const Draggable = ({ children, defaultPosition, onStop, bounds = 'parent' }) => {
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const nodeRef = useRef(null);

  // Update position when defaultPosition changes (only when not dragging)
  const isDraggingRef = useRef(false);
  
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    if (defaultPosition && !isDraggingRef.current) {
      setPosition(defaultPosition);
    }
  }, [defaultPosition?.x, defaultPosition?.y]);

  const handleMouseDown = (e) => {
    // Don't start drag if clicking directly on input, button, or their children
    const target = e.target;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'BUTTON' || 
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    const node = nodeRef.current;
    if (!node) return;

    // Find the parent container (image-wrapper)
    const container = node.closest('.image-wrapper');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: position.x,
      y: position.y,
      startX: e.clientX - containerRect.left,
      startY: e.clientY - containerRect.top,
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const node = nodeRef.current;
    if (!node) return;

    const container = node.closest('.image-wrapper');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    
    // Calculate new position relative to container
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    let newX = dragStartRef.current.x + (mouseX - dragStartRef.current.startX);
    let newY = dragStartRef.current.y + (mouseY - dragStartRef.current.startY);

    // Apply bounds
    if (bounds === 'parent') {
      const maxX = containerRect.width - nodeRect.width;
      const maxY = containerRect.height - nodeRect.height;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    setPosition({ x: newX, y: newY });
  }, [isDragging, bounds]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      if (onStop) {
        onStop(null, { x: position.x, y: position.y });
      }
    }
    setIsDragging(false);
    isDraggingRef.current = false;
  }, [isDragging, onStop, position]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={nodeRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
};

const ImageTextEditor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const imageRefs = useRef({});

  // API Base URL - use the backend API
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const API_BASE_URL = `${BACKEND_URL}/api/v1`;

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load existing data if in edit mode
  useEffect(() => {
    if (editId) {
      loadWorkshopForEdit(editId);
    }
  }, [editId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/active`);
      const result = await response.json();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const loadWorkshopForEdit = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/image-texts/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setIsEditMode(true);
        if (result.data.category) {
          setSelectedCategory(result.data.category._id || result.data.category);
        }
        const loadedImages = result.data.images.map((img) => ({
          id: Date.now() + Math.random(),
          imageBase64: img.imageUrl || img.imageBase64,
          imageUrl: img.imageUrl,
          mimeType: img.mimeType || 'image/png',
          previewUrl: img.imageUrl || img.imageBase64,
          texts: img.texts.map((t) => ({
            id: Date.now() + Math.random(),
            text: t.text,
            x: t.x,
            y: t.y,
            fontSize: t.fontSize,
            fontFamily: t.fontFamily || 'sans-serif',
            color: t.color || '#000000',
            bgColor: t.bgColor || 'transparent',
            borderWidth: t.borderWidth || 0,
            borderColor: t.borderColor || '#000000',
            borderRadius: t.borderRadius || 0,
            bold: t.bold || false,
            italic: t.italic || false,
          })),
          originalWidth: img.originalWidth || 0,
          originalHeight: img.originalHeight || 0,
        }));
        setImages(loadedImages);
        if (loadedImages.length > 0) {
          setSelectedImageIndex(0);
        }
      } else {
        setError('Failed to load workshop data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load workshop');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload - convert to base64
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const uploadedImages = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setError('Please upload only image files');
          continue;
        }

        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const imageBase64 = await base64Promise;

        uploadedImages.push({
          id: Date.now() + Math.random(),
          imageBase64,
          mimeType: file.type,
          previewUrl: imageBase64, // Use base64 for preview
          texts: [],
          originalWidth: 0,
          originalHeight: 0,
        });
      }

      const newImages = [...images, ...uploadedImages];
      setImages(newImages);
      if (uploadedImages.length > 0) {
        // Auto-select the first uploaded image, or first image if none was selected
        setSelectedImageIndex(selectedImageIndex === null ? 0 : images.length);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  // Handle image load to get original dimensions
  const handleImageLoad = (imageId) => {
    const img = imageRefs.current[imageId];
    if (img) {
      const imageIndex = images.findIndex((img) => img.id === imageId);
      if (imageIndex !== -1) {
        const updatedImages = [...images];
        updatedImages[imageIndex] = {
          ...updatedImages[imageIndex],
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
        };
        setImages(updatedImages);
      }
    }
  };

  // Add new text box
  const addText = (imageIndex) => {
    const updatedImages = [...images];
    const newText = {
      id: Date.now() + Math.random(),
      text: 'New Text',
      x: 0.5, // 50% from left
      y: 0.5, // 50% from top
      fontSize: 16,
      fontFamily: 'sans-serif',
      color: '#000000',
      bgColor: 'transparent',
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 0,
      bold: false,
      italic: false,
    };

    updatedImages[imageIndex].texts.push(newText);
    setImages(updatedImages);
  };

  // Update text content
  const updateText = (imageIndex, textId, field, value) => {
    const updatedImages = [...images];
    const textIndex = updatedImages[imageIndex].texts.findIndex((t) => t.id === textId);
    if (textIndex !== -1) {
      updatedImages[imageIndex].texts[textIndex] = {
        ...updatedImages[imageIndex].texts[textIndex],
        [field]: value,
      };
      setImages(updatedImages);
    }
  };

  // Handle drag stop - convert to relative position
  const handleDragStop = (e, data, imageIndex, textId) => {
    const img = imageRefs.current[images[imageIndex].id];
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;

    // Convert absolute position to relative (percentage)
    const relativeX = data.x / imgWidth;
    const relativeY = data.y / imgHeight;

    updateText(imageIndex, textId, 'x', relativeX);
    updateText(imageIndex, textId, 'y', relativeY);
  };

  // Remove text
  const removeText = (imageIndex, textId) => {
    const updatedImages = [...images];
    updatedImages[imageIndex].texts = updatedImages[imageIndex].texts.filter(
      (t) => t.id !== textId
    );
    setImages(updatedImages);
  };

  // Remove image
  const removeImage = (imageIndex) => {
    const updatedImages = images.filter((_, index) => index !== imageIndex);
    setImages(updatedImages);
    if (selectedImageIndex === imageIndex) {
      setSelectedImageIndex(updatedImages.length > 0 ? 0 : null);
    } else if (selectedImageIndex > imageIndex) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Save to backend
  const handleSave = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dataToSave = {
        category: selectedCategory,
        images: images.map((img) => ({
          imageUrl: img.imageUrl, // Use existing S3 URL if available
          imageBase64: img.imageBase64, // Or send base64 if new/changed
          mimeType: img.mimeType || 'image/png',
          originalWidth: img.originalWidth,
          originalHeight: img.originalHeight,
          texts: img.texts.map((t) => ({
            text: t.text,
            x: t.x, // percentage (0-1)
            y: t.y, // percentage (0-1)
            fontSize: t.fontSize,
            fontFamily: t.fontFamily || 'sans-serif',
            color: t.color || '#000000',
            bgColor: t.bgColor || 'transparent',
            borderWidth: t.borderWidth || 0,
            borderColor: t.borderColor || '#000000',
            borderRadius: t.borderRadius || 0,
            bold: t.bold || false,
            italic: t.italic || false,
          })),
        })),
      };

      const url = isEditMode && editId
        ? `${API_BASE_URL}/image-texts/${editId}`
        : `${API_BASE_URL}/image-texts`;
      const method = isEditMode && editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save data');
      }

      const result = await response.json();
      setSavedData(result);
      const message = isEditMode
        ? 'Workshop updated successfully! ID: ' + result.id
        : 'Data saved successfully! ID: ' + result.id;
      alert(message);
      
      if (isEditMode) {
        // Redirect to management page after edit
        setTimeout(() => {
          navigate('/admin/creative-management');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to save data');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FiEdit2 className="w-6 h-6 text-white" />
                </div>
                {isEditMode ? 'Edit Creative Workshop' : 'Create Upload'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {isEditMode ? 'Modify your creative workshop' : 'Upload images and add text overlays'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {!isEditMode && (
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FiUpload className="w-5 h-5" />
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              {isEditMode && (
                <button
                  onClick={() => navigate('/admin/creative-management')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading || images.length === 0 || !selectedCategory}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              >
                <FiSave className="w-5 h-5" />
                {isLoading
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update Workshop'
                  : 'Save Workshop'}
              </button>
            </div>
          </div>
          {/* Category Selection */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              disabled={isEditMode}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No categories available. <a href="/admin/category-management" className="text-indigo-600 hover:underline">Create one here</a>
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex items-center gap-3">
            <FiX className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {savedData && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md">
            <p className="font-semibold">✅ Workshop saved successfully!</p>
            <p className="text-sm mt-1">ID: {savedData.id}</p>
          </div>
        )}

        {/* Main Editor Area */}
        {selectedImage ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <button
                  onClick={() => addText(selectedImageIndex)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FiType className="w-5 h-5" />
                  Add Text
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  {selectedImage.originalWidth} × {selectedImage.originalHeight}px
                </span>
              </div>

              {/* Editor Layout */}
              <div className="flex gap-6 items-start">
                {/* Text Properties Panel - Left side */}
                {selectedImage.texts.length > 0 && (
                  <div className="w-96 bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiEdit2 className="w-5 h-5" />
                      Text Properties
                    </h3>
                  {selectedImage.texts.map((text) => {
                    const fontFamilies = [
                      { name: "Sans-serif", value: "sans-serif" },
                      { name: "Serif", value: "serif" },
                      { name: "Monospace", value: "monospace" },
                      { name: "Arial", value: "Arial" },
                      { name: "Times New Roman", value: "Times New Roman" },
                      { name: "Courier New", value: "Courier New" },
                    ];

                    const colors = [
                      "#000000",
                      "#FF0000",
                      "#00FF00",
                      "#0000FF",
                      "#FFFF00",
                      "#FF00FF",
                      "#00FFFF",
                      "#FFFFFF",
                    ];

                    const bgColors = [
                      "transparent",
                      "rgba(255,255,255,0.7)",
                      "rgba(0,0,0,0.7)",
                      "rgba(255,0,0,0.5)",
                      "rgba(0,255,0,0.5)",
                      "rgba(0,0,255,0.5)",
                      "rgba(255,255,0,0.5)",
                    ];

                    return (
                      <div key={text.id} className="bg-white rounded-lg p-5 mb-4 border border-gray-200 shadow-sm">
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Text Content
                          </label>
                          <input
                            type="text"
                            value={text.text}
                            onChange={(e) => updateText(selectedImageIndex, text.id, 'text', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter text content"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Font Size: <span className="text-indigo-600 font-bold">{text.fontSize || 24}px</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={text.fontSize || 24}
                            onChange={(e) => updateText(selectedImageIndex, text.id, 'fontSize', parseInt(e.target.value) || 24)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Text Color
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {colors.map((colorOption) => (
                              <button
                                key={colorOption}
                                type="button"
                                className={`w-10 h-10 rounded-full border-2 transition-all ${
                                  (text.color || '#000000') === colorOption
                                    ? 'border-gray-900 scale-110 shadow-lg'
                                    : 'border-gray-300 hover:scale-105'
                                }`}
                                style={{ backgroundColor: colorOption }}
                                onClick={() => updateText(selectedImageIndex, text.id, 'color', colorOption)}
                                title={colorOption}
                              />
                            ))}
                            <label className="relative w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all overflow-hidden">
                              <input
                                type="color"
                                value={text.color || '#000000'}
                                onChange={(e) => updateText(selectedImageIndex, text.id, 'color', e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: text.color || '#000000' }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Position X: <span className="text-indigo-600 font-bold">{((text.x || 0.5) * 100).toFixed(0)}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(text.x || 0.5) * 100}
                            onChange={(e) => updateText(selectedImageIndex, text.id, 'x', parseInt(e.target.value) / 100)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Position Y: <span className="text-indigo-600 font-bold">{((text.y || 0.5) * 100).toFixed(0)}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(text.y || 0.5) * 100}
                            onChange={(e) => updateText(selectedImageIndex, text.id, 'y', parseInt(e.target.value) / 100)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Background Color
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            {bgColors.map((bgColorOption) => (
                              <button
                                key={bgColorOption}
                                type="button"
                                className={`w-10 h-10 rounded-full border-2 transition-all ${
                                  (text.bgColor || 'transparent') === bgColorOption
                                    ? 'border-gray-900 scale-110 shadow-lg'
                                    : 'border-gray-300 hover:scale-105'
                                }`}
                                style={{
                                  backgroundColor: bgColorOption === 'transparent' ? 'transparent' : bgColorOption,
                                  backgroundImage: bgColorOption === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                                  backgroundSize: bgColorOption === 'transparent' ? '8px 8px' : 'auto',
                                  backgroundPosition: bgColorOption === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto',
                                }}
                                onClick={() => updateText(selectedImageIndex, text.id, 'bgColor', bgColorOption)}
                                title={bgColorOption}
                              />
                            ))}
                            <label className="relative w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all overflow-hidden">
                              <input
                                type="color"
                                value={text.bgColor && text.bgColor !== 'transparent' ? text.bgColor.replace(/rgba?\([^)]+\)/, '#FFFFFF') : '#FFFFFF'}
                                onChange={(e) => {
                                  const rgb = e.target.value;
                                  updateText(selectedImageIndex, text.id, 'bgColor', `rgba(${parseInt(rgb.slice(1, 3), 16)}, ${parseInt(rgb.slice(3, 5), 16)}, ${parseInt(rgb.slice(5, 7), 16)}, 0.7)`);
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: text.bgColor === 'transparent' ? 'transparent' : (text.bgColor || 'transparent') }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Border Width: <span className="text-indigo-600 font-bold">{text.borderWidth || 0}px</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={text.borderWidth || 0}
                            onChange={(e) => {
                              const width = parseInt(e.target.value) || 0;
                              updateText(selectedImageIndex, text.id, 'borderWidth', width);
                              if (width === 0) {
                                updateText(selectedImageIndex, text.id, 'borderColor', 'transparent');
                              }
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>

                        {text.borderWidth > 0 && (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Border Color
                              </label>
                              <div className="flex flex-wrap items-center gap-2">
                                {colors.map((colorOption) => (
                                  <button
                                    key={colorOption}
                                    type="button"
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                      (text.borderColor || '#000000') === colorOption
                                        ? 'border-gray-900 scale-110 shadow-lg'
                                        : 'border-gray-300 hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: colorOption }}
                                    onClick={() => updateText(selectedImageIndex, text.id, 'borderColor', colorOption)}
                                    title={colorOption}
                                  />
                                ))}
                                <label className="relative w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all overflow-hidden">
                                  <input
                                    type="color"
                                    value={text.borderColor || '#000000'}
                                    onChange={(e) => updateText(selectedImageIndex, text.id, 'borderColor', e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ backgroundColor: text.borderColor || '#000000' }}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Border Radius: <span className="text-indigo-600 font-bold">{text.borderRadius || 0}px</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="50"
                                value={text.borderRadius || 0}
                                onChange={(e) => updateText(selectedImageIndex, text.id, 'borderRadius', parseInt(e.target.value) || 0)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                          </>
                        )}

                        <div className="mb-4 flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={text.bold || false}
                              onChange={(e) => updateText(selectedImageIndex, text.id, 'bold', e.target.checked)}
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FiBold className="w-4 h-4" />
                              Bold
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={text.italic || false}
                              onChange={(e) => updateText(selectedImageIndex, text.id, 'italic', e.target.checked)}
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              <FiItalic className="w-4 h-4" />
                              Italic
                            </span>
                          </label>
                        </div>

                        <button
                          onClick={() => removeText(selectedImageIndex, text.id)}
                          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Remove Text
                        </button>
                      </div>
                    );
                  })}
                  </div>
                )}

                {/* Image Editor Container */}
                <div className="flex-1 flex justify-center items-start overflow-auto bg-gray-50 rounded-xl p-6 min-h-[500px]">
                  <div className="image-wrapper relative inline-block" style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      ref={(el) => {
                        if (el) imageRefs.current[selectedImage.id] = el;
                      }}
                      src={selectedImage.previewUrl}
                      alt="Editable"
                      onLoad={() => handleImageLoad(selectedImage.id)}
                      className="max-w-full h-auto rounded-lg shadow-2xl"
                    />

                    {selectedImage.texts.map((text) => {
                      const img = imageRefs.current[selectedImage.id];
                      const imgRect = img?.getBoundingClientRect();
                      const imgWidth = imgRect?.width || 0;
                      const imgHeight = imgRect?.height || 0;

                      return (
                        <Draggable
                          key={text.id}
                          defaultPosition={{
                            x: text.x * imgWidth,
                            y: text.y * imgHeight,
                          }}
                          onStop={(e, data) => handleDragStop(e, data, selectedImageIndex, text.id)}
                          bounds="parent"
                        >
                          <div
                            className="relative z-10 cursor-grab active:cursor-grabbing"
                            style={{
                              fontSize: `${text.fontSize}px`,
                              fontFamily: text.fontFamily || 'sans-serif',
                              color: text.color || '#000000',
                              fontWeight: text.bold ? 'bold' : 'normal',
                              fontStyle: text.italic ? 'italic' : 'normal',
                              padding: '4px 8px',
                              background: text.bgColor || 'transparent',
                              borderWidth: text.borderWidth > 0 ? `${text.borderWidth}px` : '0px',
                              borderColor: text.borderWidth > 0 ? (text.borderColor || '#000000') : 'transparent',
                              borderStyle: text.borderWidth > 0 ? 'solid' : 'none',
                              borderRadius: `${text.borderRadius || 0}px`,
                              minWidth: '50px',
                            }}
                          >
                            <input
                              type="text"
                              value={text.text}
                              onChange={(e) => updateText(selectedImageIndex, text.id, 'text', e.target.value)}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                // Prevent drag when clicking on input
                              }}
                              onFocus={(e) => e.stopPropagation()}
                              className="bg-transparent border-none outline-none text-inherit font-inherit w-full min-w-[80px] pointer-events-auto"
                            />
                            <button
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700 transition-colors shadow-lg z-20"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeText(selectedImageIndex, text.id);
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        </Draggable>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <FiImage className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Images Uploaded</h3>
                <p className="text-gray-600 mb-6">Upload images to start creating your creative workshop</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FiUpload className="w-5 h-5" />
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ImageTextEditor;
