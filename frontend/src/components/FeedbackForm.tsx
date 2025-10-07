import React, { useState } from "react";
import { Link } from "react-router-dom";
import { submitFeedbackWithCaptcha, submitFeedbackWithMagicLink } from "../api/feedbackApi";
import type { FeedbackData } from "../api/feedbackApi";
import "./FeedbackForm.scss";

interface FeedbackFormProps {
  initialEmail?: string;
  magicLinkToken?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  initialEmail = "", 
  magicLinkToken = "" 
}) => {
  const [formData, setFormData] = useState<FeedbackData>({
    first_name: "",
    last_name: "",
    email: initialEmail,
    mobile: "",
    rating: 5,
    feedback: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let result;
      
      // If we have a magic link token, use it for submission
      if (magicLinkToken) {
        result = await submitFeedbackWithMagicLink(formData, magicLinkToken);
      } 
      // Otherwise use the simple submission without captcha
      else {
        result = await submitFeedbackWithCaptcha(formData);
      }
      
      setMessage(result?.message || "✅ Feedback submitted successfully!");
      
      // Clear form on success
      if (!magicLinkToken) {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          mobile: "",
          rating: 5,
          feedback: "",
        });
      }
    } catch (error) {
      setMessage("⚠️ Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="feedback-form-container">
      <div className="feedback-card">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Share Your Feedback
        </h2>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="name-fields">
            <div className="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>
            <input
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="rating-field">
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Rating
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} {Array(num).fill('★').join('')}{Array(5-num).fill('☆').join('')}
                </option>
              ))}
            </select>
          </div>

          <div className="input-with-icon textarea-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <textarea
              name="feedback"
              placeholder="Your feedback..."
              value={formData.feedback}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>

          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Submit Feedback
          </button>
        </form>

        {message && (
          <div className="feedback-response">
            <p className={`feedback-message ${message.includes("⚠️") ? "warning" : "success"}`}>
              {message.includes("⚠️") ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {message.replace("✅", "").replace("⚠️", "")}
            </p>
            
            {/* Show the link after any successful submission, not just magic link submissions */}
            {!message.includes("⚠️") && (
              <Link to="/#latest" className="view-feedbacks-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Latest Feedbacks
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
