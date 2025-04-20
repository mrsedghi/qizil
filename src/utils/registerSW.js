export default function register() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log("SW registered: ", registration);
        },
        (error) => {
          console.log("SW registration failed: ", error);
        }
      );
    });
  }
}
