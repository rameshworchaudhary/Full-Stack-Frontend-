import React from "react";
import { BookOpen, Info } from "lucide-react";

export function CoursesView({ onNavigate }) {
  return (
    <div className="section-content-container">
      <div className="status-notice-card">
        <div className="notice-icon-box">
          <Info size={22} />
        </div>
        <div className="notice-text">
          <h4>Academic Course Enrollment</h4>
          <p>
            Course registration for the current semester is managed centrally by
            the university registrar. Once enrolled, your curriculum syllabus,
            course codes, and instructor contacts will synchronize directly with
            this portal.
          </p>
        </div>
      </div>

      <div className="empty-state-card clean">
        <div className="empty-icon-box">
          <BookOpen size={30} />
        </div>
        <h3>No courses enrolled</h3>
        <p>
          You are currently not enrolled in any active course modules. Check
          the study schedule or announcements for semester registration notices.
        </p>
        <div className="empty-actions">
          <button
            className="secondary-btn"
            onClick={() => onNavigate("Announcements")}
          >
            Check Announcements
          </button>
          <button
            className="primary-btn"
            onClick={() => onNavigate("Schedule")}
          >
            View Study Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
