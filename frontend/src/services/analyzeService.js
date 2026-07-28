import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ai-resume-analyzer-48h4.onrender.com",
  timeout: 90000, // 90 seconds timeout for Render cold starts
});

// Automatic retry for Render spin-up delays
API.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || config.__isRetry) {
    return Promise.reject(error);
  }

  // Network error or 504 gateway timeout from cold start
  if (error.message === "Network Error" || error.code === "ECONNABORTED" || error.response?.status >= 500) {
    config.__isRetry = true;
    console.warn("Backend waking up from free-tier sleep, retrying request in 3s...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return API(config);
  }

  return Promise.reject(error);
});

export const analyzeResume = async (formData) => {
  const response = await API.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const batchAnalyzeResumes = async (formData) => {
  const response = await API.post("/batch-analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const enhanceBulletPoint = async (formData) => {
  const response = await API.post("/enhance-bullet", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const generateCoverLetter = async (formData) => {
  const response = await API.post("/generate-cover-letter", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};