import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data && typeof error.response.data === "string") {
      const dataStr = error.response.data.toLowerCase();
      if (dataStr.includes("<html") || dataStr.includes("<!doctype")) {
        // Prevent Django HTML debug pages from bleeding into the UI
        error.response.data = { detail: "Internal Server Error. Please contact support if the issue persists." };
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;