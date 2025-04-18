"use client";

import { FaShareAlt } from "react-icons/fa";

export const ShareButton = ({ title, text, url }) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn btn-outline btn-sm gap-2 tooltip"
      aria-label="Share poem"
      data-tip="اشتراک گذاری"
    >
      <FaShareAlt className="w-5 h-5" />
    </button>
  );
};
