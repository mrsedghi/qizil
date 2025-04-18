"use client";

import { useState, useEffect } from "react";
import { MdOutlineTextIncrease } from "react-icons/md";
import { MdOutlineTextDecrease } from "react-icons/md";

export const FontSizeControls = () => {
  const [fontSize, setFontSize] = useState(1); // Default for non-mobile

  useEffect(() => {
    // This will only apply to screens larger than mobile
    const style = `
      @media (min-width: 640px) {
        :root {
          --poem-font-size: ${fontSize}rem;
        }
      }
    `;

    // Add mobile default
    const mobileStyle = `
      :root {
        --poem-font-size: ${fontSize - 0.2}rem;
      }
    `;

    // Create or update style element
    let styleElement = document.getElementById("font-size-styles");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "font-size-styles";
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = mobileStyle + style;
  }, [fontSize]);

  return (
    <div className="join">
      <button
        onClick={() => setFontSize((prev) => Math.max(0.8, prev - 0.2))}
        className="btn btn-sm join-item"
        aria-label="Decrease font size"
      >
        <MdOutlineTextDecrease className="w-5 h-5" />
      </button>
      <button
        onClick={() => setFontSize((prev) => Math.min(2.0, prev + 0.2))}
        className="btn btn-sm join-item"
        aria-label="Increase font size"
      >
        <MdOutlineTextIncrease className="w-5 h-5" />
      </button>
    </div>
  );
};
