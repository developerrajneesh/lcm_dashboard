import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const CreativeUpload = () => {
  const [image, setImage] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("rgba(255,255,255,0.7)");
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderRadius, setBorderRadius] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [elementType, setElementType] = useState("text");
  const [imageElement, setImageElement] = useState(null);
  const [imageBorderRadius, setImageBorderRadius] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageContainerRef = useRef(null);
  const selectedElement = elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    if (imageContainerRef.current) {
      const updateSize = () => {
        const width = imageContainerRef.current?.clientWidth || 800;
        const height = imageContainerRef.current?.clientHeight || 600;
        setContainerSize({ width, height });
      };

      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, [image]);

  useEffect(() => {
    if (selectedElement) {
      if (!isDragging) {
        setPosition(selectedElement.position);
      }

      if (selectedElement.type === "text") {
        setText(selectedElement.content);
        setFontSize(selectedElement.fontSize);
        setFontFamily(selectedElement.fontFamily);
        setColor(selectedElement.color);
      } else if (selectedElement.type === "image") {
        setImageSize(selectedElement.size || { width: 100, height: 100 });
      }
      setBgColor(selectedElement.bgColor);
      setBorderWidth(selectedElement.borderWidth);
      setBorderColor(selectedElement.borderColor);
      setBorderRadius(selectedElement.borderRadius);
    }
  }, [selectedElementId, elements]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    // if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src); // memory clean-up
    };
  };

  const handleElementImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageElement(event.target.result);
        if (selectedElement?.type === "image") {
          updateElement(selectedElement.id, {
            content: event.target.result,
            size: imageSize,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const addElement = () => {
    if (elementType === "text" && !text.trim()) return;
    if (elementType === "image" && !imageElement) return;

    const newElement = {
      id: Date.now().toString(),
      type: elementType,
      content: elementType === "text" ? text : imageElement,
      fontSize,
      fontFamily,
      color,
      bgColor,
      borderWidth,
      borderColor,
      borderRadius: elementType === "image" ? imageBorderRadius : borderRadius,
      position: { ...position },
      zIndex: elements.length,
      ...(elementType === "image" && { size: imageSize }),
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedElementId(newElement.id);

    if (elementType === "text") {
      setText("");
    } else {
      setImageElement(null);
    }
  };

  const handleMouseDown = (id, e) => {
    setSelectedElementId(id);
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElementId || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const xPercentage =
      Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1)) * 100;
    const yPercentage =
      Math.max(0, Math.min((e.clientY - rect.top) / rect.height, 1)) * 100;

    const newPosition = {
      x: xPercentage,
      y: yPercentage,
    };

    setPosition(newPosition);
    updateElement(selectedElementId, { position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleControlChange = (property, value) => {
    if (selectedElementId) {
      updateElement(selectedElementId, { [property]: value });
    }

    switch (property) {
      case "content":
        setText(value);
        break;
      case "fontSize":
        setFontSize(value);
        break;
      case "fontFamily":
        setFontFamily(value);
        break;
      case "color":
        setColor(value);
        break;
      case "bgColor":
        setBgColor(value);
        break;
      case "borderWidth":
        setBorderWidth(value);
        break;
      case "borderColor":
        setBorderColor(value);
        break;
      case "borderRadius":
        elementType === "image"
          ? setImageBorderRadius(value)
          : setBorderRadius(value);
        break;
      case "size":
        setImageSize(value);
        if (selectedElement?.type === "image") {
          updateElement(selectedElementId, { size: value });
        }
        break;
      default:
        break;
    }
  };

  const handleImageSizeChange = (dimension, value) => {
    const newSize = { ...imageSize, [dimension]: parseInt(value) };
    handleControlChange("size", newSize);
  };

  const saveTemplate = () => {
    if (!image) return;

    const template = {
      id: Date.now().toString(),
      image,
      elements,
      category: "business",
      createdAt: new Date().toISOString(),
      dimensions,
    };

    console.log("Template saved:", template);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/v1/template`, template)
      .then((response) => {
        console.log("Template saved successfully:", response.data);
        alert("Template saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving template:", error);
        alert("Error saving template");
      });

    // setImage(null);
    // setElements([]);
    // setSelectedElementId(null);
  };
  console.log(dimensions);

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
    "rgba(255,255,255,0.7)",
    "rgba(0,0,0,0.7)",
    "rgba(255,0,0,0.5)",
    "rgba(0,255,0,0.5)",
    "rgba(0,0,255,0.5)",
    "rgba(255,255,0,0.5)",
  ];

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Creative Image Upload Dashboard
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor Section */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <label className="inline-block px-6 py-3 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition-colors">
                Choose Background Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {image && (
                <div
                  className="relative mt-6 mx-auto max-w-full bg-gray-200 border border-gray-200 rounded-md overflow-hidden"
                  ref={imageContainerRef}
                  onMouseMove={handleMouseMove}
                  // style={{ height: 600, width: 350 }}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div style={styles.container}>
                    <img
                      src={image}
                      alt="Preview"
                      style={styles.image}
                      className=" border border-red-400"
                    />
                    <div style={styles.fixedBox}></div>
                  </div>

                  {elements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move ${
                        selectedElementId === element.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      style={{
                        left: `${
                          (element.position.x / 100) * containerSize.width
                        }px`,
                        top: `${
                          (element.position.y / 100) * containerSize.height
                        }px`,
                        zIndex: element.zIndex,
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        backgroundColor: element.bgColor,
                        borderWidth: `${element.borderWidth}px`,
                        borderColor: element.borderColor,
                        borderStyle: "solid",
                        borderRadius: `${element.borderRadius}px`,
                        padding: element.type === "text" ? "8px" : "0",
                        minWidth: "50px",
                        minHeight: element.type === "text" ? "auto" : "30px",
                      }}
                      onMouseDown={(e) => handleMouseDown(element.id, e)}
                    >
                      {element.type === "text" ? (
                        element.content
                      ) : (
                        <img
                          src={element.content}
                          alt="Element"
                          style={{
                            width: `${element.size?.width || 100}px`,
                            height: `${element.size?.height || 100}px`,
                            objectFit: "contain",
                            borderRadius: `${element.borderRadius}px`,
                          }}
                        />
                      )}
                      <button
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(element.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Element Type Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Element Type
              </h2>
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    elementType === "text"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setElementType("text")}
                >
                  Text
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-md ${
                    elementType === "image"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setElementType("image")}
                >
                  Image
                </button>
              </div>
            </div>

            {/* Element Controls */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                {selectedElement ? "Edit" : "Add"}{" "}
                {elementType === "text" ? "Text" : "Image"} Element
              </h2>

              <div className="space-y-4">
                {elementType === "text" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Content
                      </label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) =>
                          handleControlChange("content", e.target.value)
                        }
                        placeholder="Enter text content"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size:{" "}
                        <span className="font-bold">{fontSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={fontSize}
                        onChange={(e) =>
                          handleControlChange(
                            "fontSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Family
                      </label>
                      <select
                        value={fontFamily}
                        onChange={(e) =>
                          handleControlChange("fontFamily", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {fontFamilies.map((font) => (
                          <option key={font.value} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Color
                      </label>
                      <div className="flex flex-wrap gap-2 items-center">
                        {colors.map((colorOption) => (
                          <div
                            key={colorOption}
                            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                              color === colorOption
                                ? "border-gray-800"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: colorOption }}
                            onClick={() =>
                              handleControlChange("color", colorOption)
                            }
                          />
                        ))}
                        <input
                          type="color"
                          value={color}
                          onChange={(e) =>
                            handleControlChange("color", e.target.value)
                          }
                          className="w-8 h-8 rounded-full opacity-0 absolute cursor-pointer"
                        />
                        <div
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image
                      </label>
                      <label className="inline-block w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        {imageElement ? "Change Image" : "Select Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleElementImageUpload}
                          className="hidden"
                        />
                      </label>
                      {imageElement && (
                        <div className="mt-2">
                          <img
                            src={imageElement}
                            alt="Preview"
                            className="max-h-20 mx-auto"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width:{" "}
                        <span className="font-bold">{imageSize.width}px</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={imageSize.width}
                        onChange={(e) =>
                          handleImageSizeChange("width", e.target.value)
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height:{" "}
                        <span className="font-bold">{imageSize.height}px</span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        value={imageSize.height}
                        onChange={(e) =>
                          handleImageSizeChange("height", e.target.value)
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Border Radius:{" "}
                        <span className="font-bold">{imageBorderRadius}px</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={imageBorderRadius}
                        onChange={(e) =>
                          handleControlChange(
                            "borderRadius",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </>
                )}

                {/* Common Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position X:{" "}
                      <span className="font-bold">
                        {position.x.toFixed(0)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={position.x}
                      onChange={(e) => {
                        const x = parseInt(e.target.value);
                        setPosition((prev) => ({ ...prev, x }));
                        if (selectedElementId) {
                          updateElement(selectedElementId, {
                            position: { ...position, x },
                          });
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Y:{" "}
                      <span className="font-bold">
                        {position.y.toFixed(0)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={position.y}
                      onChange={(e) => {
                        const y = parseInt(e.target.value);
                        setPosition((prev) => ({ ...prev, y }));
                        if (selectedElementId) {
                          updateElement(selectedElementId, {
                            position: { ...position, y },
                          });
                        }
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {bgColors.map((bgColorOption) => (
                      <div
                        key={bgColorOption}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          bgColor === bgColorOption
                            ? "border-gray-800"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: bgColorOption }}
                        onClick={() =>
                          handleControlChange("bgColor", bgColorOption)
                        }
                      />
                    ))}
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) =>
                        handleControlChange("bgColor", e.target.value)
                      }
                      className="w-8 h-8 rounded-full opacity-0 absolute cursor-pointer"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      style={{ backgroundColor: bgColor }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Width:{" "}
                    <span className="font-bold">{borderWidth}px</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={borderWidth}
                    onChange={(e) =>
                      handleControlChange(
                        "borderWidth",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Color
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {colors.map((colorOption) => (
                      <div
                        key={colorOption}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          borderColor === colorOption
                            ? "border-gray-800"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: colorOption }}
                        onClick={() =>
                          handleControlChange("borderColor", colorOption)
                        }
                      />
                    ))}
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) =>
                        handleControlChange("borderColor", e.target.value)
                      }
                      className="w-8 h-8 rounded-full opacity-0 absolute cursor-pointer"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      style={{ backgroundColor: borderColor }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Radius:{" "}
                    <span className="font-bold">{borderRadius}px</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={borderRadius}
                    onChange={(e) =>
                      handleControlChange(
                        "borderRadius",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {!selectedElement && (
                  <button
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={addElement}
                    disabled={
                      (elementType === "text" && !text.trim()) ||
                      (elementType === "image" && !imageElement)
                    }
                  >
                    Add {elementType === "text" ? "Text" : "Image"} Element
                  </button>
                )}
              </div>
            </div>

            {/* Template Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Template Options
              </h2>

              <button
                className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  !image || elements.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500"
                }`}
                onClick={saveTemplate}
                disabled={!image || elements.length === 0}
              >
                Save Template
              </button>

              {selectedElement && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">
                      Editing: {selectedElement.type}
                    </h3>
                    <button
                      className="text-sm text-red-500 hover:text-red-700"
                      onClick={() => setSelectedElementId(null)}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fixedBox: {
    width: "350px",
    height: "500px",
    backgroundColor: "#ddd",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain", // Match with resizeMode: "contain"
  },
};
export default CreativeUpload;
