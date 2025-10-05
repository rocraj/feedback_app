import React, { useEffect, useState } from "react";
import { fetchFeedbacks } from "../api/feedbackApi";

interface Feedback {
  id: number;
  first_name: string;
  last_name: string;
  rating: number;
  feedback: string;
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      const data = await fetchFeedbacks();
      setFeedbacks(data || []);
    };
    loadFeedbacks();
  }, []);

  return (
    <div className="feedback-list">
      <h2>All Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <ul>
          {feedbacks.map((fb) => (
            <li key={fb.id}>
              <strong>
                {fb.first_name} {fb.last_name}
              </strong>{" "}
              ({fb.rating}⭐)
              <p>{fb.feedback}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;
