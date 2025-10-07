import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackPage from "./pages/FeedbackPage";
import AdminPage from "./pages/AdminPage";
import MagicLinkPage from "./pages/MagicLinkPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/magic-link" element={<MagicLinkPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
};

export default App;
