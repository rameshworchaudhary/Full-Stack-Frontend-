import React, { useEffect, useState } from "react";
import {
  Calendar,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  BookOpen,
  FileCheck2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { postsApi, schedulesApi } from "../api/api";

export function DashboardView({ onNavigate, user }) {
  const [posts, setPosts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentName = user?.name || user?.email?.split("@")[0] || "Student";

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postsRes, schedulesRes] = await Promise.all([
        postsApi.getAll(),
        schedulesApi.getAll(),
      ]);

      const extractedPosts = Array.isArray(postsRes)
        ? postsRes
        : postsRes.data || [];
      const extractedSchedules = Array.isArray(schedulesRes)
        ? schedulesRes
        : schedulesRes.data || [];

      setPosts(extractedPosts);
      setSchedules(extractedSchedules);
    } catch (err) {
      console.error("Dashboard data load error:", err);
      setError(err.message || "Failed to load dashboard data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatScheduleDate = (dateStr) => {
    if (!dateStr) return "Not scheduled";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  // Sort upcoming schedules by date if available
  const sortedSchedules = [...schedules].sort((a, b) => {
    if (!a.scheduledAt) return 1;
    if (!b.scheduledAt) return -1;
    return new Date(a.scheduledAt) - new Date(b.scheduledAt);
  });

  const recentPosts = [...posts].slice(-4).reverse();
  const upcomingSchedules = sortedSchedules.slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {studentName}</h2>
          <p>Here's what's happening with your studies.</p>
        </div>
        <div className="banner-actions">
          <button
            className="secondary-btn"
            onClick={fetchDashboardData}
            title="Refresh latest data"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {/* Error Notice */}
      {error && (
        <div className="system-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="alert-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Real Statistics Grid */}
      <section className="stats-section">
        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Scheduled Sessions</span>
            <span className="stat-number">
              {loading ? "..." : schedules.length}
            </span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <Bell size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Announcements</span>
            <span className="stat-number">
              {loading ? "..." : posts.length}
            </span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Backend Service</span>
            <span className="stat-number stat-status">Online</span>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column: Upcoming Schedule */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Calendar size={18} />
              <h3>Upcoming Schedule</h3>
            </div>
            <button
              className="panel-action-link"
              onClick={() => onNavigate("Schedule")}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="panel-body">
            {loading ? (
              <div className="panel-loading-state">
                <div className="skeleton-line full"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
              </div>
            ) : upcomingSchedules.length === 0 ? (
              <div className="panel-empty-state">
                <Calendar size={32} className="empty-icon-muted" />
                <p className="empty-title">No upcoming schedules</p>
                <p className="empty-description">
                  Plan your classes, study routines, or upcoming examination dates.
                </p>
                <button
                  className="primary-btn small"
                  onClick={() => onNavigate("Schedule")}
                >
                  <Plus size={14} /> Add Schedule
                </button>
              </div>
            ) : (
              <div className="schedule-item-list">
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule.id} className="schedule-item-row">
                    <div className="schedule-date-badge">
                      <Clock size={15} />
                    </div>
                    <div className="schedule-item-details">
                      <span className="schedule-item-title">
                        {schedule.title}
                      </span>
                      <span className="schedule-item-time">
                        {formatScheduleDate(schedule.scheduledAt)}
                      </span>
                    </div>
                    <span className="schedule-id-chip">#{schedule.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Announcements */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Bell size={18} />
              <h3>Recent Announcements</h3>
            </div>
            <button
              className="panel-action-link"
              onClick={() => onNavigate("Announcements")}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div className="panel-body">
            {loading ? (
              <div className="panel-loading-state">
                <div className="skeleton-line full"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
              </div>
            ) : recentPosts.length === 0 ? (
              <div className="panel-empty-state">
                <Bell size={32} className="empty-icon-muted" />
                <p className="empty-title">No announcements available</p>
                <p className="empty-description">
                  Important faculty updates and notifications will appear here.
                </p>
                <button
                  className="primary-btn small"
                  onClick={() => onNavigate("Announcements")}
                >
                  <Plus size={14} /> Post Announcement
                </button>
              </div>
            ) : (
              <div className="announcement-item-list">
                {recentPosts.map((post) => (
                  <div key={post.id} className="announcement-item-row">
                    <div className="announcement-item-content">
                      <h4 className="announcement-item-title">{post.title}</h4>
                      <p className="announcement-item-snippet">
                        {post.content}
                      </p>
                    </div>
                    <span className="announcement-id-chip">#{post.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <section className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <button
            className="action-card-btn"
            onClick={() => onNavigate("Schedule")}
          >
            <div className="action-card-icon">
              <Calendar size={18} />
            </div>
            <div className="action-card-text">
              <strong>Manage Schedule</strong>
              <span>Create or review your academic timetable</span>
            </div>
          </button>

          <button
            className="action-card-btn"
            onClick={() => onNavigate("Announcements")}
          >
            <div className="action-card-icon">
              <Bell size={18} />
            </div>
            <div className="action-card-text">
              <strong>Announcements</strong>
              <span>Read institutional updates and notices</span>
            </div>
          </button>

          <button
            className="action-card-btn"
            onClick={() => onNavigate("Courses")}
          >
            <div className="action-card-icon">
              <BookOpen size={18} />
            </div>
            <div className="action-card-text">
              <strong>View Courses</strong>
              <span>Check registered subjects and syllabi</span>
            </div>
          </button>

          <button
            className="action-card-btn"
            onClick={() => onNavigate("Assignments")}
          >
            <div className="action-card-icon">
              <FileCheck2 size={18} />
            </div>
            <div className="action-card-text">
              <strong>Assignments</strong>
              <span>Review pending coursework deadlines</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
