// src/components/SvgViewer.js
import React, { useEffect, useRef, useState } from "react";

const SvgViewer = ({ svgContent, altText, darkMode }) => {
  const svgContainerRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (svgContainerRef.current && svgContent) {
      const container = svgContainerRef.current;
      // Process the SVG to make it responsive and match theme
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
      const svgElement = svgDoc.querySelector("svg");

      if (svgElement) {
        // Add responsive attributes
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "auto");
        svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

        // Apply style based on dark mode
        if (darkMode) {
          // For dark mode, ensure lighter elements are visible
          const elements = svgElement.querySelectorAll(
            "path, rect, circle, ellipse, polygon, polyline"
          );
          elements.forEach((el) => {
            const fill = el.getAttribute("fill");
            if (fill && fill.toLowerCase() === "#ffffff") {
              el.setAttribute("fill", "#f0f0f0");
            }
          });
        }

        // Replace the content
        container.innerHTML = "";
        container.appendChild(svgElement);
      }
    }
  }, [svgContent, darkMode]);

  const handleCopySvgCode = () => {
    if (svgContent) {
      navigator.clipboard
        .writeText(svgContent)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy SVG code: ", err);
        });
    }
  };

  if (!svgContent) {
    return null;
  }

  return (
    <div className="svg-viewer mt-2 mb-4">
      <div
        ref={svgContainerRef}
        className={`rounded-lg overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-white"
        }`}
        style={{
          minHeight: "200px",
          maxHeight: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          position: "relative",
        }}
      >
        {/* Copy button */}
        <button
          onClick={handleCopySvgCode}
          className={`absolute top-2 right-2 p-2 rounded-md text-sm font-medium ${
            darkMode
              ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          } transition-colors duration-200`}
        >
          {isCopied ? "Copied!" : "Copy SVG"}
        </button>
      </div>
      {altText && (
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {altText}
        </p>
      )}
    </div>
  );
};

export default SvgViewer;