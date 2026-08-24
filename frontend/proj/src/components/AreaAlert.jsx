import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AreaAlert.css";

function AreaAlert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/area-alerts"
        );

        console.log("Area Alerts:", response.data);

        setAlerts(response.data.data || []);
      } catch (error) {
        console.error("Area Alert Error:", error);
      }
    };

    fetchAlerts();
  }, []);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="area-alert-wrapper">
      {alerts.map((alert) => (
        <div className="area-alert-card" key={alert._id}>
          
          <div className="area-alert-heading">
            ⚠️ AREA ALERT
          </div>

          <div className="area-alert-body">
            <h2>📍 {alert.area}</h2>

            <h3>🚨 {alert.problem}</h3>

            <p>{alert.description}</p>

            <div className="area-alert-info">
              <span>
                🕐 Last updated:{" "}
                {alert.updatedAt
                  ? new Date(alert.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Recently"}
              </span>

              <span className="severity">
                {alert.severity}
              </span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default AreaAlert;