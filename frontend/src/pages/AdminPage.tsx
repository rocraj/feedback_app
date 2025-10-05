// frontend/src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import { fetchFeedbacks } from "../api/feedbackApi";
import type { FeedbackData } from "../api/feedbackApi"; // <-- type-only import

export interface Feedback extends FeedbackData {
  id: number; // assuming backend returns an id
  created_at: string; // assuming backend returns a timestamp
}

const AdminPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data: Feedback[] = await fetchFeedbacks();
        setFeedbackList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {feedbackList.length === 0 ? (
        <p>No feedbacks submitted yet.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Rating</th>
              <th className="px-4 py-2 border">Feedback</th>
              <th className="px-4 py-2 border">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((f) => (
              <tr key={f.id} className="text-center border-b">
                <td className="px-4 py-2 border">{`${f.first_name} ${f.last_name}`}</td>
                <td className="px-4 py-2 border">{f.email}</td>
                <td className="px-4 py-2 border">{f.mobile}</td>
                <td className="px-4 py-2 border">{f.rating}</td>
                <td className="px-4 py-2 border">{f.feedback}</td>
                <td className="px-4 py-2 border">
                  {new Date(f.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
