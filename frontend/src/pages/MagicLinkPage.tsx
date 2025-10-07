import React from "react";
import { useSearchParams } from "react-router-dom";
import MagicLinkHandler from "../components/MagicLinkHandler";
import "./MagicLinkPage.scss";

const MagicLinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasEmailAndToken = searchParams.get('email') && searchParams.get('token');
  
  // The API base URL should match your backend API
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  
  return (
    <div className="magic-link-page">
      <header>
        <h1>Feedback App</h1>
      </header>
      
      <main>
        {hasEmailAndToken ? (
          // If we have email and token in the URL, use MagicLinkHandler
          // with redirectToMain=true to redirect to the main feedback page
          <div className="magic-link-container">
            <MagicLinkHandler apiUrl={apiUrl} redirectToMain={true} />
          </div>
        ) : (
          // Otherwise show a form to request a magic link
          <div className="request-magic-link-container">
            <h2>Request Magic Link</h2>
            <p>Enter your email to receive a secure link for submitting your valuable feedback.</p>
            <MagicLinkHandler apiUrl={apiUrl} />
          </div>
        )}
      </main>
      
      <footer className="magic-link-footer">
        <p>© 2025 Feedback App | Secure and Private</p>
        <div className="docs-links">
          <a href="https://github.com/rocraj/feedback_app/blob/main/README.md" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">📘</span> Documentation
          </a>
          <a href="https://github.com/rocraj/feedback_app/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">📝</span> Changelog
          </a>
          <a href="https://github.com/rocraj/feedback_app" target="_blank" rel="noopener noreferrer">
            <span className="link-icon">💻</span> GitHub Repository
          </a>
        </div>
      </footer>
    </div>
  );
};

export default MagicLinkPage;