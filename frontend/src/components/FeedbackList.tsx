import React, { useEffect, useState } from "react";
import { fetchFeedbacks } from "../api/feedbackApi";
import "./FeedbackList.scss";

interface Feedback {
  id: string; // Updated to string as IDs are UUIDs
  first_name: string;
  last_name: string;
  email: string;
  mobile: string | null;
  rating: number;
  feedback: string;
  created_at: string;
}

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Feedback>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFeedbacks();
        setFeedbacks(data || []);
      } catch (err) {
        console.error("Error loading feedbacks:", err);
        setError("Failed to load feedback data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadFeedbacks();
  }, []);

  // Sort feedbacks based on current sort field and direction
  const sortedFeedbacks = [...feedbacks].sort((a, b) => {
    if (sortField === "rating") {
      // For numeric fields
      return sortDirection === "asc" 
        ? a[sortField] - b[sortField] 
        : b[sortField] - a[sortField];
    } else {
      // For string fields
      const aValue = String(a[sortField] || "");
      const bValue = String(b[sortField] || "");
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });

  const handleSort = (field: keyof Feedback) => {
    if (field === sortField) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending for dates, ascending for others
      setSortField(field);
      setSortDirection(field === "created_at" ? "desc" : "asc");
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Render stars for ratings with improved display
  const renderStars = (rating: number) => {
    return (
      <div className="star-rating">
        {"★".repeat(rating)}
        {"☆".repeat(5 - rating)}
      </div>
    );
  };

  return (
    <div className="feedback-list-container">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Recent Feedback
      </h2>
      
      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <div>Loading feedback data...</div>
        </div>
      )}
      
      {error && (
        <div className="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div className="error-message">{error}</div>
        </div>
      )}
      
      {!loading && !error && feedbacks.length === 0 ? (
        <div className="empty-state">
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
      ) : (
        <div className="feedback-table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("created_at")} className={sortField === "created_at" ? `sorted ${sortDirection}` : ""}>
                  Date {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("first_name")} className={sortField === "first_name" ? `sorted ${sortDirection}` : ""}>
                  Name {sortField === "first_name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("rating")} className={sortField === "rating" ? `sorted ${sortDirection}` : ""}>
                  Rating {sortField === "rating" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {sortedFeedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td className="date-cell">{formatDate(fb.created_at)}</td>
                  <td className="name-cell">
                    <div>{fb.first_name} {fb.last_name}</div>
                    <div className="email">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      {fb.email}
                    </div>
                    {fb.mobile && (
                      <div className="mobile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                          <line x1="12" y1="18" x2="12" y2="18"></line>
                        </svg>
                        {fb.mobile}
                      </div>
                    )}
                  </td>
                  <td className="rating-cell">{renderStars(fb.rating)}</td>
                  <td className="feedback-cell">
                    <div className="feedback-content">{fb.feedback}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
