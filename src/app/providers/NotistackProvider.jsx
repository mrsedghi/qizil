"use client";

import { SnackbarProvider } from "notistack";

export function NotistackProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
