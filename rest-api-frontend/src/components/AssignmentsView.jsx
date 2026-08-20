import React from "react";
import { FileCheck2, Info } from "lucide-react";

export function AssignmentsView({ onNavigate }) {
  return (
    <div className="section-content-container">
      <div className="status-notice-card">
        <div className="notice-icon-box">
          <Info size={22} />
        </div>
        <div className="notice-text">
          <h4>Coursework & Deliverables</h4>
          <p>
            Assignment submissions and grading rubrics are published in
            accordance with your syllabus timeline. When tasks are assigned by
            your course instructors, they will appear here with associated due
            dates.
          </p>
        </div>
      </div>

      <div className="empty-state-card clean">
        <div className="empty-icon-box">
          <FileCheck2 size={30} />
        </div>
        <h3>No pending assignments</h3>
        <p>
          You have no pending assignment submissions or project deliverables
          scheduled at this time.
        </p>
        <div className="empty-actions">
          <button
            className="secondary-btn"
            onClick={() => onNavigate("Dashboard")}
          >
            Return to Dashboard
          </button>
          <button
            className="primary-btn"
            onClick={() => onNavigate("Schedule")}
          >
            Manage Study Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
