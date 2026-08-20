import React from "react";
import { Menu } from "lucide-react";

export function Header({ activePage, user, onOpenMobile, onOpenProfile }) {
  const getPageDescription = (page) => {
    switch (page) {
      case "Dashboard":
        return "Academic overview, study schedules, and recent announcements";
      case "Courses":
        return "Current semester syllabus, registered subjects, and learning materials";
      case "Assignments":
        return "Coursework deadlines, project deliverables, and academic tasks";
      case "Schedule":
        return "Timetable for classes, study sessions, and examinations";
      case "Announcements":
        return "Official updates and notices from faculty and administration";
      case "Profile":
        return "Student account settings, credentials, and academic profile";
      default:
        return "Student portal";
    }
  };

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
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-menu-trigger"
          onClick={onOpenMobile}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-titles">
          <div className="breadcrumbs">
            <span>Student Portal</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{activePage}</span>
          </div>
          <h1 className="header-heading">{activePage}</h1>
          <p className="header-subtext">{getPageDescription(activePage)}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="api-connection-badge" title="Connected to Spring Boot backend">
          <span className="connection-indicator"></span>
          <span className="connection-label">Server Online</span>
        </div>

        <button
          className="header-avatar-btn"
          onClick={onOpenProfile}
          title="View Student Profile"
        >
          <span className="avatar-text">{getInitials(user)}</span>
        </button>
      </div>
    </header>
  );
}
