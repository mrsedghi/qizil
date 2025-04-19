"use client";

import { useSnackbar } from "@/app/hooks/useSnackbar";
import { FaRegClipboard } from "react-icons/fa";

export const CopyToClipboard = ({ text }) => {
  const { showSnackbar } = useSnackbar();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    showSnackbar("متن در حافظه کپی شد", { variant: "success" });
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-outline btn-sm gap-2 tooltip"
      aria-label="Copy poem to clipboard"
      data-tip="کپی"
    >
      <FaRegClipboard className="w-5 h-5" />
    </button>
  );
};
