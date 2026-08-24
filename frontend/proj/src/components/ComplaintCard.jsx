


import React from "react";
import { Link } from "react-router-dom";

const ComplaintCard = ({ complaint }) => {

  console.log("COMPLAINT FROM CARD:", complaint);
  console.log("COMPLAINT MONGODB ID:", complaint._id);

  return (
    <div className="complaint-card">

      {/* Image */}
      <div className="complaint-image">

        {complaint.image ? (
          <img
            src={complaint.image}
            alt={complaint.category}
          />
        ) : (
          <div className="no-image">
            📸
          </div>
        )}

      </div>

      {/* Information */}
      <div className="complaint-info">

        <div className="complaint-top">

          <h3>
            {complaint.category}
          </h3>

          <span className="status reported">
            {complaint.status || "Reported"}
          </span>

        </div>

        {/* Complaint ID */}
        <p className="complaint-id">
          Complaint ID:{" "}
          <strong>
            {complaint._id}
          </strong>
        </p>

        {/* Location */}
        <p>
          📍 {complaint.location}
        </p>

        {/* Description */}
        <p className="description">
          {complaint.description}
        </p>

        {/* Bottom */}
        <div className="complaint-bottom">

          <span>
            {complaint.severity === "Critical" && "🔴"}
            {complaint.severity === "High" && "🟠"}
            {complaint.severity === "Medium" && "🟡"}
            {complaint.severity === "Low" && "🟢"}

            {" "}

            {complaint.severity}
          </span>

          <span>
            {complaint.date}
          </span>

        </div>

        {/* View Details */}
        <Link
          to={`/complaint/${complaint._id}`}
          className="view-details-btn"
        >
          View Details →
        </Link>

      </div>

    </div>
  );
};

export default ComplaintCard;