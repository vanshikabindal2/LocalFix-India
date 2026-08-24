import React, { useEffect, useState } from "react";


const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET ALL COMPLAINTS


  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5001/api/complaints"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load complaints"
        );
      }

      setComplaints(data.complaints || []);

    } catch (error) {
      console.error("Load complaints error:", error);
      setError("Complaints load nahi ho pa rahi hain.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

 
  // UPDATE STATUS / DEPARTMENT
  

  const updateComplaint = async (
    id,
    status,
    department
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/complaints/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
            department,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update complaint"
        );
      }

      // Update UI immediately
      setComplaints((previousComplaints) =>
        previousComplaints.map((complaint) =>
          complaint._id === id
            ? data.complaint
            : complaint
        )
      );

    } catch (error) {
      console.error("Update complaint error:", error);

      alert(
        error.message ||
          "Complaint update nahi ho paayi."
      );
    }
  };

 
  // SEVERITY ICON
  

  const getPriorityIcon = (severity) => {
    if (severity === "Critical") return "🔴";
    if (severity === "High") return "🟠";
    if (severity === "Medium") return "🟡";
    if (severity === "Low") return "🟢";

    return "⚪";
  };


  // LOADING
  

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-card">
            <h2>Loading complaints...</h2>
          </div>
        </div>
      </div>
    );
  }

 
  // ERROR
  

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-card">
            <h2>{error}</h2>

            <button onClick={loadComplaints}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-page">

      <div className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>
            <p className="admin-label">
              LOCALFIX INDIA
            </p>

            <h1>
              Manage Complaints
            </h1>

            <p>
              Verify complaints and manage their status
            </p>
          </div>

        </div>


        {/* COMPLAINT COUNT */}

        <div className="admin-card">

          <h3>
            Total Complaints: {complaints.length}
          </h3>

        </div>


        {/* COMPLAINTS */}

        <div className="admin-complaints-list">

          {complaints.length === 0 ? (

            <div className="admin-card">

              <h2>
                No Complaints Found
              </h2>

            </div>

          ) : (

            complaints.map((complaint) => (

              <div
                className="admin-complaint-card"
                key={complaint._id}
              >

                {/* COMPLAINT INFORMATION */}

                <div className="admin-complaint-info">

                  <div className="admin-complaint-title">

                    <h2>
                      {complaint.category}
                    </h2>

                    <span className="admin-status">
                      {complaint.status || "Reported"}
                    </span>

                  </div>


                  <p className="admin-id">
                    Complaint ID:{" "}

                    <strong>
                      {complaint._id}
                    </strong>
                  </p>


                  <p>
                    📍 {complaint.location}
                  </p>


                  <p>
                    {complaint.description}
                  </p>


                  <p>
                    {getPriorityIcon(
                      complaint.severity
                    )}{" "}

                    Severity:{" "}

                    <strong>
                      {complaint.severity}
                    </strong>
                  </p>


                  <p>
                    🏢 Department:{" "}

                    <strong>
                      {complaint.department ||
                        "Not Assigned"}
                    </strong>
                  </p>

                </div>


                {/* ADMIN CONTROLS */}

                <div className="status-control">

                  {/* STATUS */}

                  <label>
                    Update Status
                  </label>

                  <select
                    value={
                      complaint.status ||
                      "Reported"
                    }
                    onChange={(e) =>
                      updateComplaint(
                        complaint._id,
                        e.target.value,
                        complaint.department || ""
                      )
                    }
                  >

                    <option value="Reported">
                      Reported
                    </option>

                    <option value="Verified">
                      Verified
                    </option>

                    <option value="Assigned">
                      Assigned
                    </option>

                    <option value="Work Started">
                      Work Started
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                    <option value="Citizen Verification">
                      Citizen Verification
                    </option>

                    <option value="Closed">
                      Closed
                    </option>

                  </select>


                  {/* DEPARTMENT */}

                  <label>
                    Assign Department
                  </label>

                  <select
                    value={
                      complaint.department || ""
                    }
                    onChange={(e) =>
                      updateComplaint(
                        complaint._id,
                        complaint.status ||
                          "Reported",
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Department
                    </option>

                    <option value="Road Department">
                      Road Department
                    </option>

                    <option value="Electrical Department">
                      Electrical Department
                    </option>

                    <option value="Water Department">
                      Water Department
                    </option>

                    <option value="Sanitation Department">
                      Sanitation Department
                    </option>

                    <option value="Drainage Department">
                      Drainage Department
                    </option>

                    <option value="Traffic Department">
                      Traffic Department
                    </option>

                    <option value="Municipal Department">
                      Municipal Department
                    </option>

                  </select>


                  <p className="update-info">
                    Changes are saved automatically.
                  </p>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default AdminComplaints;