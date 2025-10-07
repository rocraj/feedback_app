import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export interface FeedbackData {
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string;
  rating: number;
  feedback: string;
}

// For simple feedback submission (no captcha)
export const submitFeedbackWithCaptcha = async (feedbackData: FeedbackData, _captchaToken?: string) => {
  try {
    // Using the simple feedback endpoint that doesn't require captcha
    // _captchaToken is ignored but kept in signature for compatibility
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

// For Magic Link-based feedback submission
export const submitFeedbackWithMagicLink = async (feedbackData: FeedbackData, magicToken: string) => {
  try {
    console.log(`Submitting feedback with magic link to ${API_BASE_URL}/magic-link/feedback`);
    // Structure the request to match the backend's expected format
    const response = await axios.post(`${API_BASE_URL}/magic-link/feedback`, {
      feedback_data: feedbackData,
      validation: {
        email: feedbackData.email,
        token: magicToken
      }
    });
    console.log("Feedback submission response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error submitting feedback with magic link:", error);
    console.error("Error details:", error.response?.data || "No detailed error data");
    throw error;
  }
};

// Request a magic link to be sent to an email
export const requestMagicLink = async (email: string) => {
  try {
    console.log(`Requesting magic link for ${email} to ${API_BASE_URL}/magic-link/request-magic-link`);
    const response = await axios.post(`${API_BASE_URL}/magic-link/request-magic-link`, {
      email
    });
    console.log("Magic link request response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error requesting magic link:", error);
    console.error("Error details:", error.response?.data || "No detailed error data");
    throw error;
  }
};

// Validate a magic link token
export const validateMagicLink = async (email: string, token: string) => {
  try {
    console.log(`Validating magic link for ${email} to ${API_BASE_URL}/magic-link/validate-magic-link`);
    const response = await axios.post(`${API_BASE_URL}/magic-link/validate-magic-link`, {
      email,
      token
    });
    console.log("Magic link validation response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error validating magic link:", error);
    console.error("Error details:", error.response?.data || "No detailed error data");
    throw error;
  }
};

// Interface for pagination and sorting parameters
export interface FeedbackQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Fetch feedbacks with pagination (for display or admin purposes)
export const fetchFeedbacks = async (params?: FeedbackQueryParams) => {
  try {
    const { page = 1, size = 20, sortBy = 'created_at', sortDirection = 'desc' } = params || {};
    
    const response = await axios.get(`${API_BASE_URL}/feedback`, {
      params: {
        page,
        size,
        sort_by: sortBy,
        sort_direction: sortDirection
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Error fetching feedbacks:", error);
    console.error("Error details:", error.response?.data || "No detailed error data");
    throw error;
  }
};

// Fetch feedback statistics for admin dashboard
export const fetchFeedbackStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/feedback/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback statistics:", error);
    return {};
  }
};
