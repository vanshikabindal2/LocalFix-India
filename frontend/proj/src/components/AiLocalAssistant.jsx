import React, { useState } from "react";
import axios from "axios";
import "./AiLocalAssistant.css";

const AiLocalAssistant = ({ onAnalysis }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Photo select karna
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAnalysis(null);
  };

  // AI se photo analyze karwana
  const analyzeImage = async () => {
    if (!image) {
      alert("Please upload a problem photo first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:5001/api/ai/analyze-image",
        formData
      );

      console.log("Backend AI Response:", response.data);

      if (response.data.success) {
        const result = response.data.data;

        // AI result screen par show hoga
        setAnalysis(result);

      } else {
        alert(
          response.data.message ||
            "AI analysis failed."
        );
      }

    } catch (error) {
      console.error(
        "AI Image Upload Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Image analysis failed. Please try again.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // AI result ko complaint form mein bhejna
  const useThisComplaint = () => {
    if (onAnalysis && analysis) {
      onAnalysis({
        ...analysis,
        image: image,
      });
    }
  };

  return (
    <div className="ai-assistant">

      <h2>🤖 AI Local Assistant</h2>

      <p className="ai-label">
        Problem ki photo upload karein.
        AI automatically problem identify karega.
      </p>

      {/* Photo Upload */}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Image Preview */}

      {preview && (
        <div className="image-preview">

          <img
            src={preview}
            alt="Problem Preview"
            style={{
              width: "250px",
              marginTop: "15px",
              borderRadius: "10px",
            }}
          />

        </div>
      )}

      {/* Analyze Button */}

      <button
        className="analyze-btn"
        onClick={analyzeImage}
        disabled={loading}
      >
        {loading
          ? "🤖 Analyzing..."
          : "🤖 Analyze Photo"}
      </button>

      {/* AI Result */}

      {analysis && (
        <div className="analysis-result">

          <h3>AI Analysis Result</h3>

          <div className="result-item">
            <strong>Category:</strong>
            <span>{analysis.category}</span>
          </div>

          <div className="result-item">
            <strong>Description:</strong>
            <span>{analysis.description}</span>
          </div>

          <div className="result-item">
            <strong>Severity:</strong>
            <span>{analysis.severity}</span>
          </div>

          <div className="result-item">
            <strong>Priority:</strong>
            <span>{analysis.priority}</span>
          </div>

          {/* Use AI Result */}

          <button
            type="button"
            className="use-result-btn"
            onClick={useThisComplaint}
          >
            📝 Use This Complaint
          </button>

        </div>
      )}

    </div>
  );
};

export default AiLocalAssistant;