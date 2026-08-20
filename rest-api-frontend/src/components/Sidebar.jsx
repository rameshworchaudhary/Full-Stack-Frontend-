import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Calendar,
  Bell,
  User,
  LogOut,
  X,
  GraduationCap,
} from "lucide-react";

export function Sidebar({
  activePage,
  setActivePage,
  user,
  onLogout,
  mobileOpen,
  setMobileOpen,
}) {
  const navigationItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Courses", label: "Courses", icon: BookOpen },
    { id: "Assignments", label: "Assignments", icon: FileCheck2 },
    { id: "Schedule", label: "Schedule", icon: Calendar },
    { id: "Announcements", label: "Announcements", icon: Bell },
    { id: "Profile", label: "Profile", icon: User },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (setMobileOpen) {
      setMobileOpen(false);
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

  const displayName = user?.name || user?.email?.split("@")[0] || "Student";
  const displayEmail = user?.email || "student@academic.edu";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-badge">
            <GraduationCap size={20} strokeWidth={2.2} />
          </div>
          <div className="brand-info">
            <h2>Student Portal</h2>
            <span>Academic Dashboard</span>
          </div>
          {mobileOpen && (
            <button
              className="close-drawer-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-section-label">MAIN NAVIGATION</div>
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id.toLowerCase()}`}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-text">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="sidebar-footer">
          <div className="user-profile-summary">
            <div className="user-avatar-small">{getInitials(user)}</div>
            <div className="user-text-summary">
              <span className="user-name">{displayName}</span>
              <span className="user-email">{displayEmail}</span>
            </div>
          </div>

          <button
            id="logout-button"
            className="logout-button"
            onClick={onLogout}
            title="Sign out of student account"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
