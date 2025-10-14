import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { api } from "./lib/api";

// Warm up the backend as soon as the app starts
// This prevents the backend from going to sleep on serverless platforms
api.healthCheck()
    .then(() => {
        console.log("🔥 Backend warmed up successfully!");
    })
    .catch((error) => {
        console.warn("⚠️ Backend warm-up failed:", error.message);
    });

createRoot(document.getElementById("root")!).render(<App />);
