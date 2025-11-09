import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ColorVisionProvider } from "@/context/ColorVisionContext";

createRoot(document.getElementById("root")!).render(
  <ColorVisionProvider>
    <App />
  </ColorVisionProvider>
);
