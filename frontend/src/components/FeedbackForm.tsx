import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { submitFeedback } from "../api/feedbackApi";
import type { FeedbackData } from "../api/feedbackApi";
import "./FeedbackForm.scss";

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    rating: 5,
    feedback: "",
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setMessage("⚠️ Please complete the CAPTCHA before submitting.");
      return;
    }
    const result = await submitFeedback(formData, captchaToken);
    setMessage(result?.message || "✅ Feedback submitted successfully!");
  };

  return (
    <div className="feedback-form-container">
      <div className="feedback-card">
        <h2>Share Your Feedback</h2>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="name-fields">
            <input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
          />

          <div className="rating-field">
            <label>Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} ⭐
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="feedback"
            placeholder="Your feedback..."
            value={formData.feedback}
            onChange={handleChange}
            rows={4}
            required
          ></textarea>

          <div className="captcha-wrapper">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY as string}
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <button type="submit">Submit Feedback</button>
        </form>

        {message && (
          <p className={`feedback-message ${message.includes("⚠️") ? "warning" : "success"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
