import React from "react";
import "./FeedbackListComments.scss";

interface Feedback {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  rating: number;
  feedback: string;
  created_at: string;
}

interface FeedbackListCommentsProps {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
}

const FeedbackListComments: React.FC<FeedbackListCommentsProps> = ({
  feedbacks,
  loading,
  error,
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="star-rating">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="feedback-comments-loading">
        <div className="loading-spinner"></div>
        <div>Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-comments-error">
        <div className="error-icon">⚠️</div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="feedback-comments-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <div className="empty-message">No feedback submitted yet</div>
        <div className="empty-submessage">Be the first to share your thoughts!</div>
      </div>
    );
  }

  return (
    <div className="feedback-comments-container">
      {feedbacks.map((feedback, index) => (
        <div 
          key={feedback.id} 
          className="feedback-comment-box"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="comment-header">
            <div className="rating-date">
              <div className="rating">{renderStars(feedback.rating)}</div>
              <div className="date">{formatDate(feedback.created_at)}</div>
            </div>
          </div>
          
          <div className="comment-body">
            <div className="comment-content">{feedback.feedback}</div>
          </div>
          
          <div className="comment-footer">
            <div className="user-info">
              <div className="user-name">{feedback.first_name} {feedback.last_name}</div>
              <div className="contact-info">
                <div className="email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {feedback.email}
                </div>
                {feedback.mobile && (
                  <div className="mobile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12" y2="18"></line>
                    </svg>
                    {feedback.mobile}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackListComments;