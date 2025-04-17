"use client";

import { useState, useEffect } from "react";

export const FontSizeControls = () => {
  const [fontSize, setFontSize] = useState(1.4); // rem units

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--poem-font-size",
      `${fontSize}rem`
    );
  }, [fontSize]);

  return (
    <div className="join">
      <button
        onClick={() => setFontSize((prev) => Math.max(1.2, prev - 0.2))}
        className="btn btn-sm join-item"
        aria-label="Decrease font size"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={() => setFontSize(1.4)}
        className="btn btn-sm join-item"
        aria-label="Reset font size"
      >
        اندازه متن
      </button>
      <button
        onClick={() => setFontSize((prev) => Math.min(2.0, prev + 0.2))}
        className="btn btn-sm join-item"
        aria-label="Increase font size"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
