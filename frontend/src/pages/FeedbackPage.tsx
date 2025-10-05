import React from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

const FeedbackPage: React.FC = () => (
  <div className="feedback-page">
    <FeedbackForm />
    <FeedbackList />
  </div>
);

export default FeedbackPage;
