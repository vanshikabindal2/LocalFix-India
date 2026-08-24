import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Citizen Resolution
  const [resolution, setResolution] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // GET COMPLAINT DETAILS
  // =====================================================

  const loadComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://local-fix-india-backend.vercel.app/api/complaints/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Complaint not found"
        );
      }

      setComplaint(data.complaint);

      // Existing citizen verification data
      if (data.complaint.citizenResolution) {
        setResolution(
          data.complaint.citizenResolution
        );
      }

      if (data.complaint.rating) {
        setRating(data.complaint.rating);
      }

      if (data.complaint.citizenFeedback) {
        setFeedback(
          data.complaint.citizenFeedback
        );
      }
    } catch (error) {
      console.error(
        "Complaint details error:",
        error
      );

      setError(
        error.message ||
          "Complaint load nahi ho pa rahi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadComplaint();
  }, [id]);

  // =====================================================
  // SUBMIT CITIZEN RESOLUTION
  // =====================================================

  const handleResolutionSubmit = async () => {
    setError("");
    setSuccessMessage("");

    // YES / NO select hona chahiye
    if (!resolution) {
      setError(
        "Please select whether the problem was solved."
      );
      return;
    }

    // YES ke liye rating required hai
    if (
      resolution === "Yes" &&
      rating === 0
    ) {
      setError(
        "Please give a rating before submitting."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `https://local-fix-india-backend.vercel.app/api/complaints/${id}/verify-resolution`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            citizenResolution: resolution,

            rating:
              resolution === "Yes"
                ? rating
                : null,

            citizenFeedback: feedback,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Verification failed"
        );
      }

      // Updated complaint
      setComplaint(data.complaint);

      if (resolution === "Yes") {
        setSuccessMessage(
          "🎉 Thank you! Complaint has been verified and closed."
        );
      } else {
        setSuccessMessage(
          "Complaint has been reopened for further work."
        );
      }
    } catch (error) {
      console.error(
        "Resolution submit error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-card">
          <h2>Loading complaint...</h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !complaint) {
    return (
      <div className="details-page">
        <div className="details-card">
          <h2>{error}</h2>

          <button
            onClick={() =>
              navigate("/my-complaints")
            }
          >
            Back to My Complaints
          </button>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return null;
  }

  // =====================================================
  // STATUS TIMELINE
  // =====================================================

  const statuses = [
    "Reported",
    "Verified",
    "Assigned",
    "Work Started",
    "Resolved",
    "Citizen Verification",
    "Closed",
  ];

  const currentStatusIndex =
    statuses.indexOf(complaint.status);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="details-page">

      <div className="details-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="details-header">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/my-complaints")
            }
          >
            ← Back
          </button>

          <div>
            <p className="details-label">
              LOCALFIX INDIA
            </p>

            <h1>
              Complaint Details
            </h1>
          </div>

        </div>

        {/* =================================================
            COMPLAINT INFORMATION
        ================================================= */}

        <div className="details-card">

          <div className="details-title-row">

            <div>

              <p className="details-label">
                Complaint
              </p>

              <h2>
                {complaint.category}
              </h2>

            </div>

            <span className="details-status">
              {complaint.status}
            </span>

          </div>

          {/* DETAILS */}

          <div className="details-info">

            <div className="detail-item">

              <span>
                Complaint ID
              </span>

              <strong>
                {complaint._id}
              </strong>

            </div>

            <div className="detail-item">

              <span>
                Location
              </span>

              <strong>
                📍 {complaint.location}
              </strong>

            </div>

            <div className="detail-item">

              <span>
                Severity
              </span>

              <strong>
                {complaint.severity}
              </strong>

            </div>

            <div className="detail-item">

              <span>
                Department
              </span>

              <strong>
                {complaint.department ||
                  "Not Assigned"}
              </strong>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="description-section">

            <h3>
              Description
            </h3>

            <p>
              {complaint.description}
            </p>

          </div>

          {/* IMAGE */}

          {complaint.image && (

            <div className="complaint-image-section">

              <h3>
                Complaint Photo
              </h3>

              <img
                src={complaint.image}
                alt="Complaint"
                className="complaint-detail-image"
              />

            </div>

          )}

        </div>

        {/* =================================================
            STATUS TIMELINE
        ================================================= */}

        <div className="details-card">

          <h2>
            Complaint Progress
          </h2>

          <div className="status-timeline">

            {statuses.map(
              (status, index) => {

                const isCompleted =
                  index <= currentStatusIndex;

                const isCurrent =
                  status === complaint.status;

                return (

                  <div
                    className={`timeline-item ${
                      isCompleted
                        ? "completed"
                        : ""
                    } ${
                      isCurrent
                        ? "current"
                        : ""
                    }`}
                    key={status}
                  >

                    <div className="timeline-dot">

                      {isCompleted
                        ? "✓"
                        : index + 1}

                    </div>

                    <div className="timeline-content">

                      <h3>
                        {status}
                      </h3>

                      {isCurrent && (
                        <p>
                          Current Status
                        </p>
                      )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </div>

        {/* =================================================
            CITIZEN VERIFICATION
        ================================================= */}

        {complaint.status ===
          "Resolved" &&
          !complaint.citizenVerified && (

          <div className="details-card resolution-card">

            {/* HEADER */}

            <div className="resolution-header">

              <span className="resolution-icon">
                🎉
              </span>

              <div>

                <h2>
                  Problem Marked as Resolved
                </h2>

                <p>
                  The department has marked this
                  complaint as resolved.
                </p>

              </div>

            </div>

            {/* QUESTION */}

            <div className="resolution-question">

              <h3>
                Was the problem actually solved?
              </h3>

              <p>
                Please verify the resolution
                before closing this complaint.
              </p>

            </div>

            {/* =================================================
                YES / NO BUTTONS
            ================================================= */}

            <div className="resolution-options">

              {/* YES */}

              <button
                type="button"
                className={`resolution-btn yes-btn ${
                  resolution === "Yes"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setResolution("Yes")
                }
              >

                <span>
                  ✅
                </span>

                <div>

                  <strong>
                    Yes, Problem Solved
                  </strong>

                  <small>
                    The issue has been fixed.
                  </small>

                </div>

              </button>

              {/* NO */}

              <button
                type="button"
                className={`resolution-btn no-btn ${
                  resolution === "No"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setResolution("No")
                }
              >

                <span>
                  ❌
                </span>

                <div>

                  <strong>
                    No, Still Not Solved
                  </strong>

                  <small>
                    The problem still exists.
                  </small>

                </div>

              </button>

            </div>

            {/* =================================================
                RATING
            ================================================= */}

            {resolution === "Yes" && (

              <div className="rating-section">

                <h3>
                  How would you rate the resolution?
                </h3>

                <p>
                  Your feedback helps us improve
                  local services.
                </p>

                <div className="stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                    <button
                      key={star}
                      type="button"
                      className={
                        star <=
                        (hoverRating ||
                          rating)
                          ? "star active"
                          : "star"
                      }
                      onClick={() =>
                        setRating(star)
                      }
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                    >
                      ★
                    </button>

                  ))
                  }

                </div>

                {/* RATING TEXT */}

                {rating > 0 && (

                  <p className="rating-text">

                    You selected{" "}
                    {rating} out of 5 stars

                  </p>

                )}

              </div>

            )}

            {/* =================================================
                FEEDBACK
            ================================================= */}

            {resolution && (

              <div className="feedback-section">

                <label>

                  Additional Feedback

                  <span>
                    {" "}
                    (Optional)
                  </span>

                </label>

                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(
                      e.target.value
                    )
                  }
                  placeholder={
                    resolution === "Yes"
                      ? "Tell us about your experience..."
                      : "Tell us what is still wrong..."
                  }
                  rows="4"
                />

              </div>

            )}

            {/* ERROR */}

            {error && (

              <div className="resolution-error">
                {error}
              </div>

            )}

            {/* SUCCESS */}

            {successMessage && (

              <div className="resolution-success">
                {successMessage}
              </div>

            )}

            
                {/* // SUBMIT BUTTON */}
           

            {resolution &&
              !successMessage && (

              <button
                type="button"
                className="resolution-submit-btn"
                onClick={
                  handleResolutionSubmit
                }
                disabled={submitting}
              >

                {submitting
                  ? "Submitting..."
                  : resolution === "Yes"
                  ? "Submit & Close Complaint"
                  : "Report Still Not Solved"}

              </button>

            )}

          </div>

        )}

        {/* =================================================
            ALREADY VERIFIED
         */}

        {complaint.citizenVerified && (

          <div className="details-card verification-complete">

            {/* YES */}

            {complaint.citizenResolution ===
              "Yes" ? (

              <>

                <div className="complete-icon">
                  ✅
                </div>

                <h2>
                  Problem Successfully Verified
                </h2>

                <p>
                  Thank you for confirming that
                  the problem has been solved.
                </p>

                {/* SAVED RATING */}

                {complaint.rating && (

                  <div className="saved-rating">

                    <span>
                      Your Rating
                    </span>

                    <div className="saved-stars">

                      {"★".repeat(
                        complaint.rating
                      )}

                      {"☆".repeat(
                        5 -
                          complaint.rating
                      )}

                    </div>

                  </div>

                )}

                {/* SAVED FEEDBACK */}

                {complaint.citizenFeedback && (

                  <div className="saved-feedback">

                    <strong>
                      Your Feedback
                    </strong>

                    <p>
                      {complaint.citizenFeedback}
                    </p>

                  </div>

                )}

              </>

            ) : (

              /* NO */

              <>

                <div className="complete-icon">
                  🔄
                </div>

                <h2>
                  Complaint Reopened
                </h2>

                <p>
                  You reported that the problem
                  is still not solved. The complaint
                  has been sent back for further work.
                </p>

              </>

            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default ComplaintDetails;