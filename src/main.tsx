import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ColorVisionProvider } from "@/context/ColorVisionContext";

// Force English language for date inputs
document.documentElement.lang = "en-US";

createRoot(document.getElementById("root")!).render(
  <ColorVisionProvider>
    <App />
  </ColorVisionProvider>
);
