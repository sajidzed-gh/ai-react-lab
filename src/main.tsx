import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Naver from "./Nav.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <Naver />
  </StrictMode>,
);
