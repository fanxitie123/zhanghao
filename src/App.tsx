import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimpleTools from "@/pages/SimpleTools";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<SimpleTools />} />
      </Routes>
    </Router>
  );
}
