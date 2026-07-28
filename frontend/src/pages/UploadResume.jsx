import { useState } from "react";

function UploadResume() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        AI Resume Analyzer
      </h1>

      {/* Resume Upload */}

      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Upload Resume (PDF)
        </label>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />
      </div>

      {/* Job Description */}

      <div className="mb-6">

        <label className="block mb-2 font-semibold">
          Job Description
        </label>

        <textarea
          rows="12"
          className="w-full border rounded-lg p-4"
          placeholder="Paste Job Description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

      </div>

      {/* Button */}

      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Analyze Resume
      </button>

    </div>
  );
}

export default UploadResume;