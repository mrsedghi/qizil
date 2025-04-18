// app/providers/SplashProvider.jsx
"use client";

import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";

export default function SplashProvider({ children }) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // This ensures the splash screen shows before hydrating the content
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500); // Small delay to ensure splash screen renders first

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen />
      {showContent && children}
    </>
  );
}
