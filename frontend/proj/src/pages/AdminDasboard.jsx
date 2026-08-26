import React, { useEffect, useState } from "react";
import { getComplaints } from "../api/complaintApi.js";
import { useNavigate, Link } from "react-router-dom";
const AdminDashboard = () => {
  const navigate=useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
  const fetchComplaints = async () => {
    try {
    const data = await getComplaints();

console.log("ADMIN API RESPONSE:", data);

setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  fetchComplaints();
}, []);

  const total = complaints.length;

  const pending = complaints.filter(
    (item) =>
      item.status === "Reported" ||
      item.status === "Verified" ||
      item.status === "Assigned"
  ).length;

  const inProgress = complaints.filter(
    (item) => item.status === "Work Started"
  ).length;

  const resolved = complaints.filter(
    (item) =>
      item.status === "Resolved" ||
      item.status === "Closed"
  ).length;

  const critical = complaints.filter(
    (item) => item.severity === "Critical"
  ).length;

  const high = complaints.filter(
    (item) => item.severity === "High"
  ).length;

  const medium = complaints.filter(
    (item) => item.severity === "Medium"
  ).length;

  const low = complaints.filter(
    (item) => item.severity === "Low"
  ).length;

  const departmentCount = {};

  complaints.forEach((item) => {
    const department = item.department || "Not Assigned";

    departmentCount[department] =
      (departmentCount[department] || 0) + 1;
  });

  return (
    <div className="admin-dashboard">

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
{/* admin-action */}
<div className="admin-actions">
  <button onClick={()=>navigate("/admin/complaints")}>Manage Complaints</button>
<Link to="/admin/area-alerts" className="admin-area-alert-btn">🚨Area Alert</Link>
  {/* <button onClick={()=>navigate("/")}>Home</button> */}

</div>


          {/* <button onClick={()=>{
            localStorage.removeItem("admin LoggedIn");
            navigate("/admin-login");
          }}>Logout</button> */}
          
<button onClick={() => {
  localStorage.removeItem("adminLoggedIn");
  navigate("/admin-login", { replace: true });
}}>
  Logout
</button>

          <p>LOCALFIX INDIA - Complaint Management</p>
        </div>

        <div className="admin-badge">
          👨‍💼 Admin
        </div>
      </div>

      {/* Main Stats */}

      <div className="stats-grid">

        <div className="stat-card">
          <span>📋</span>
          <h3>Total Problems</h3>
          <strong>{total}</strong>
        </div>

        <div className="stat-card">
          <span>⏳</span>
          <h3>Pending</h3>
          <strong>{pending}</strong>
        </div>

        <div className="stat-card">
          <span>🔧</span>
          <h3>In Progress</h3>
          <strong>{inProgress}</strong>
        </div>

        <div className="stat-card">
          <span>✅</span>
          <h3>Resolved</h3>
          <strong>{resolved}</strong>
        </div>

      </div>


      {/* Severity */}

      <div className="dashboard-section">

        <h2>🚨 Complaint Severity</h2>

        <div className="severity-summary">

          <div>
            🔴 Critical
            <strong>{critical}</strong>
          </div>

          <div>
            🟠 High
            <strong>{high}</strong>
          </div>

          <div>
            🟡 Medium
            <strong>{medium}</strong>
          </div>

          <div>
            🟢 Low
            <strong>{low}</strong>
          </div>

        </div>

      </div>


      {/* Departments */}

      <div className="dashboard-section">

        <h2>🏢 Department-wise Complaints</h2>

        {Object.keys(departmentCount).length === 0 ? (

          <p>No complaints available.</p>

        ) : (

          <div className="department-list">

            {Object.entries(departmentCount).map(
              ([department, count]) => (

                <div
                  className="department-row"
                  key={department}
                >

                  <span>{department}</span>

                  <strong>{count}</strong>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* Recent Complaints */}

      <div className="dashboard-section">

        <h2>📋 Recent Complaints</h2>

        {complaints.length === 0 ? (

          <p>No complaints reported yet.</p>

        ) : (

          <div className="recent-list">

            {complaints.slice(0, 5).map((item) => (

              <div
                className="recent-complaint"
                key={item._id}
              >

                <div>
                  <strong>{item.category}</strong>

                  <p>
                    📍 {item.location}
                  </p>
                </div>

                <span>
                  {item.status}
                </span>

              </div>
            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminDashboard;