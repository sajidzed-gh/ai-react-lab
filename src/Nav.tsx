import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import MAAnalyzer from "./MA_Analyzer";
import CivicLens from "./civicLens";

export default function Naver() {
  return (
    <>
      <BrowserRouter>
        {/** navigation bar */}
        <nav style={{ padding: "10px", background: "#eee" }}>
          <Link to="/" style={{ marginRight: "10px" }}>
            App
          </Link>
          <Link to="MAA" style={{ marginRight: "10px" }}>
            M&A Anaylzer
          </Link>
          <Link to="CivicLens" style={{ marginRight: "10px" }}>
            Civic Lens
          </Link>
        </nav>
        {/**Content  area*/}
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<App />}></Route>
            <Route path="MAA" element={<MAAnalyzer />}></Route>
            <Route path="CivicLens" element={<CivicLens />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
