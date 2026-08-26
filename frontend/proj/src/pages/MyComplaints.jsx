


import React, { useEffect, useState } from "react";
import ComplaintCard from "../components/ComplaintCard";
import { getComplaints } from "../api/complaintApi.js";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const data = await getComplaints();

        console.log("API RESPONSE:", data);

        // Backend response:
        // {
        //   success: true,
        //   complaints: [...]
        // }

        setComplaints(data.complaints || []);
      } catch (error) {
        console.error("Fetch Complaints Error:", error);
        setError("Unable to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="complaints-page">
      <div className="complaints-container">

        <div className="page-title">
          <div>
            <h1>My Complaints</h1>

            <p>
              Track all the problems you have reported.
            </p>
          </div>

          <div className="total-count">
            {complaints.length} Reports
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-message">
            Loading complaints...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Complaints */}
        {!loading && !error && (
          <div className="complaints-list">

            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint._id}
                  complaint={complaint}
                />
              ))
            ) : (
              <div className="no-complaints">
                <h3>No complaints found</h3>
                <p>
                  You have not reported any complaints yet.
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyComplaints;