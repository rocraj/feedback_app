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
          <div className="magic-link-container">
            <MagicLinkHandler apiUrl={apiUrl} />
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
      
      <footer>
        <p>© 2025 Feedback App | Secure and Private</p>
      </footer>
    </div>
  );
};

export default MagicLinkPage;