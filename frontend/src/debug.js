// Debug script to test API endpoint access
// Run this with Node.js to test the API connection

const axios = require('axios');

const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
console.log(`Using API_BASE_URL: ${API_BASE_URL}`);

async function testMagicLinkRequest() {
  try {
    console.log(`Making request to: ${API_BASE_URL}/magic-link/request-magic-link`);
    const response = await axios.post(`${API_BASE_URL}/magic-link/request-magic-link`, {
      email: "test@example.com"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      }
    });
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received, request details:", error.request);
    }
  }
}

testMagicLinkRequest();