import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import "./FeedbackPage.scss";

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  
  return (
    <div className="feedback-page">
      <header className="feedback-header">
        <h1>Customer Feedback System</h1>
        <div className="auth-options">
          <p>
            Prefer to use a magic link? <Link to="/magic-link" className="magic-link-option">Click here</Link> to get a secure link via email.
          </p>
        </div>
      </header>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Submit Feedback
        </button>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          View All Feedback
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'form' ? (
          <FeedbackForm />
        ) : (
          <FeedbackList />
        )}
      </div>
      
      <footer className="feedback-footer">
        <p>© 2025 Feedback App - All rights reserved</p>
      </footer>
    </div>
  );
};

export default FeedbackPage;
