import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import "./FeedbackPage.scss";

const FeedbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  
  // Parse the hash from URL when component mounts or URL changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    
    if (hash === 'latest') {
      setActiveTab('list');
    } else {
      setActiveTab('form');
    }
  }, [location.hash]); // Only depend on location.hash
  
  // Programmatically update tab (for cases where we need to switch tabs from code)
  const switchTab = (tab: 'form' | 'list') => {
    if (tab === activeTab) return;
    
    const hash = tab === 'list' ? '#latest' : '';
    navigate(hash, { replace: true }); // Use replace to avoid adding to history stack
  };
  
  // We don't need this second useEffect as it's causing a loop
  // The navigation is now handled within the switchTab function
  
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
          onClick={() => switchTab('form')} 
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
        >
          Submit Feedback
        </button>
        <button 
          onClick={() => switchTab('list')} 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
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
