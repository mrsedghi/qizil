"use client";

import { enqueueSnackbar } from "notistack";

export function useSnackbar() {
  const showSnackbar = (message, options = {}) => {
    enqueueSnackbar(message, {
      variant: options.variant || "default",
      autoHideDuration: options.duration || 3000,
      ...options,
    });
  };

  return { showSnackbar };
}
