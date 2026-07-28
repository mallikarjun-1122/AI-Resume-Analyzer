import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ai-resume-analyzer-48h4.onrender.com",
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