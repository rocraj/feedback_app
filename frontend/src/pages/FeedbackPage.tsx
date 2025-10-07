import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import "./FeedbackPage.scss";

const FeedbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  // Extract email and token from URL query parameters (from magic link redirect)
  const emailParam = searchParams.get('email');
  const tokenParam = searchParams.get('token');
  
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
    
    // Preserve query parameters if they exist when changing tabs
    let navigateTo = '';
    const preserveParams = new URLSearchParams(searchParams);
    
    if (tab === 'list') {
      navigateTo = '#latest';
    }
    
    // If we have search params, add them to the navigation
    const hasParams = preserveParams.toString().length > 0;
    if (hasParams) {
      navigateTo = `${navigateTo}${navigateTo.includes('?') ? '&' : '?'}${preserveParams.toString()}`;
    }
    
    navigate(navigateTo, { replace: true }); // Use replace to avoid adding to history stack
  };
  
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
          <span className="tab-icon">📝</span> Submit Feedback
        </button>
        <button 
          onClick={() => switchTab('list')} 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
        >
          <span className="tab-icon">📋</span> View All Feedback
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'form' ? (
          <FeedbackForm 
            initialEmail={emailParam || ''} 
            magicLinkToken={tokenParam || ''}
          />
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
