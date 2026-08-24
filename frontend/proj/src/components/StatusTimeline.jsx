
import React from "react";
const StatusTimeline = ({ currentStatus }) => {
  const statuses = [
    "Reported",
    "Verified",
    "Assigned",
    "Work Started",
    "Resolved",
    "Citizen Verification",
    "Closed",
  ];

  const currentIndex =
    statuses.indexOf(currentStatus);

  return (
    <div className="timeline">

      {statuses.map((status, index) => {

        const completed =
          index <= currentIndex;

        return (
          <div
            className="timeline-item"
            key={status}
          >

            <div
              className={`timeline-dot ${
                completed ? "completed" : ""
              }`}
            >
              {completed ? "✓" : ""}
            </div>


            <div className="timeline-content">

              <h3>
                {status}
              </h3>

              <p>

                {status === "Reported" &&
                  "Complaint successfully reported."}

                {status === "Verified" &&
                  "Complaint is being verified."}

                {status === "Assigned" &&
                  "Complaint assigned to relevant department."}

                {status === "Work Started" &&
                  "Department has started the work."}

                {status === "Resolved" &&
                  "Problem has been resolved."}

                {status === "Citizen Verification" &&
                  "Waiting for citizen verification."}

                {status === "Closed" &&
                  "Complaint has been successfully closed."}

              </p>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default StatusTimeline;