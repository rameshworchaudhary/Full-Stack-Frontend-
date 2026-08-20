import React from "react";
import { User, Mail, Shield, Server, LogOut, CheckCircle2 } from "lucide-react";

export function ProfileView({ user, onLogout }) {
  const displayName = user?.name || user?.email?.split("@")[0] || "Student User";
  const displayEmail = user?.email || "student@academic.edu";

  const getInitials = (u) => {
    const name = u?.name || u?.email?.split("@")[0] || "Student";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-page-container">
      {/* Profile Overview Card */}
      <div className="profile-card">
        <div className="profile-header-strip">
          <div className="profile-avatar-large">
            {getInitials(user)}
          </div>
          <div className="profile-title-group">
            <h2>{displayName}</h2>
            <p className="profile-role">Registered Student</p>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="detail-item">
            <div className="detail-label">
              <User size={15} />
              <span>Full Name</span>
            </div>
            <div className="detail-value">{displayName}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Mail size={15} />
              <span>Email Address</span>
            </div>
            <div className="detail-value">{displayEmail}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Shield size={15} />
              <span>Session Status</span>
            </div>
            <div className="detail-value active-badge">
              <CheckCircle2 size={14} /> Active Authenticated Session
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Server size={15} />
              <span>Backend API</span>
            </div>
            <div className="detail-value">Spring Boot (Render)</div>
          </div>
        </div>

        <div className="profile-actions-strip">
          <button className="logout-action-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* Security & System Info */}
      <div className="profile-security-card">
        <h3>Security & Account Access</h3>
        <p>
          Your account credentials are encrypted and verified through the Spring
          Boot REST API with BCrypt password hashing. All schedule and
          announcement updates sync directly with the central database.
        </p>
      </div>
    </div>
  );
}
