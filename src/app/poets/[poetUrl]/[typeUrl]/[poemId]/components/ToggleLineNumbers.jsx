// app/poets/[poetId]/poems/[poemId]/components/ToggleLineNumbers.js
"use client";

import { useState, useEffect } from "react";
import { FaListOl, FaListUl } from "react-icons/fa";

export const ToggleLineNumbers = () => {
  const [showNumbers, setShowNumbers] = useState(true);

  useEffect(() => {
    // Load preference from localStorage if available
    const savedPreference = localStorage.getItem("showLineNumbers");
    if (savedPreference !== null) {
      setShowNumbers(savedPreference === "true");
    }
  }, []);

  const toggleNumbers = () => {
    const newValue = !showNumbers;
    setShowNumbers(newValue);
    localStorage.setItem("showLineNumbers", newValue.toString());

    // Toggle the numbers in the poem content
    const poemLines = document.querySelectorAll(".verse-number");
    poemLines.forEach((line) => {
      line.style.display = newValue ? "flex" : "none";
    });
  };

  return (
    <button
      className="btn btn-outline btn-sm gap-2 tooltip"
      onClick={toggleNumbers}
      aria-label={showNumbers ? "Hide line numbers" : "Show line numbers"}
      data-tip="شماره ابیات"
    >
      {showNumbers ? (
        <>
          <FaListOl className="h-5 w-5" />
        </>
      ) : (
        <>
          <FaListUl className="h-5 w-5" />
        </>
      )}
    </button>
  );
};
