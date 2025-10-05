import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface FeedbackData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  rating: number;
  feedback: string;
}

export const submitFeedback = async (feedbackData: FeedbackData, captchaToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback`, {
      ...feedbackData,
      captcha_token: captchaToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { message: "Submission failed" };
  }
};

export const fetchFeedbacks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feedback`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
};
