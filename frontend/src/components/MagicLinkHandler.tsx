import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FeedbackForm from './FeedbackForm';
import { requestMagicLink, validateMagicLink } from '../api/feedbackApi';

interface MagicLinkProps {
  apiUrl: string;
}

const MagicLinkHandler: React.FC<MagicLinkProps> = ({ apiUrl }) => {
  const [searchParams] = useSearchParams();
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Extract email and token from URL
  const emailParam = searchParams.get('email');
  const tokenParam = searchParams.get('token');

  // Validate token on component mount if present in URL
  useEffect(() => {
    const validateToken = async () => {
      if (emailParam && tokenParam) {
        try {
          setIsValidating(true);
          // Use the validateMagicLink function which uses the API_BASE_URL from feedbackApi.ts
          const response = await validateMagicLink(emailParam, tokenParam);

          if (response.status === 'success') {
            setIsValid(true);
            setEmail(emailParam);
          } else {
            setIsValid(false);
            setError('Invalid or expired magic link.');
          }
        } catch (error) {
          setIsValid(false);
          console.error("Magic link validation error:", error);
          setError('Invalid or expired magic link. Please request a new one.');
        } finally {
          setIsValidating(false);
        }
      } else {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [apiUrl, emailParam, tokenParam]);

  // Form for requesting a new magic link
  const MagicLinkRequestForm = () => {
    const [requestEmail, setRequestEmail] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSending(true);
      
      try {
        // Use the requestMagicLink function from feedbackApi.ts
        await requestMagicLink(requestEmail);
        setSuccessMessage(`Magic link sent to ${requestEmail}. Please check your inbox and click the link to continue.`);
        setRequestEmail('');
        // Clear any previous errors
        setError('');
      } catch (error) {
        console.error("Error requesting magic link:", error);
        setError('Failed to send magic link. Please verify your email and try again.');
      } finally {
        setIsSending(false);
      }
    };

    return (
      <div className="magic-link-request-form">
        {!successMessage && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  autoFocus
                />
              </div>
              <button type="submit" disabled={isSending}>
                {isSending ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Get Secure Link'
                )}
              </button>
            </form>
          </>
        )}
        
        {successMessage && (
          <div className="success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>{successMessage}</p>
          </div>
        )}
      </div>
    );
  };

  // Render content based on validation state
  if (isValidating) {
    return <div className="loading">Validating your secure link...</div>;
  }

  if (isValid && email) {
    // Magic link is valid, render feedback form
    return (
      <div className="valid-magic-link">
        <h2>Submit Your Feedback</h2>
        <p>Your secure link has been validated successfully. Please share your feedback below.</p>
        <div className="secure-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Secure Session
        </div>
        <FeedbackForm 
          initialEmail={email}
          magicLinkToken={tokenParam || ''}
        />
      </div>
    );
  }

  // Magic link is invalid or not provided
  return (
    <div className="invalid-magic-link">
      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
      <MagicLinkRequestForm />
    </div>
  );
};

export default MagicLinkHandler;