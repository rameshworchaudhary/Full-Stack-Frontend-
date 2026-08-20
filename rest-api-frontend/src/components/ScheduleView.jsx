import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  RefreshCw,
  X,
  Check,
  CalendarDays,
} from "lucide-react";
import { schedulesApi } from "../api/api";

export function ScheduleView() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    scheduledAt: "",
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await schedulesApi.getAll();
      const extracted = Array.isArray(response)
        ? response
        : response.data || [];
      setSchedules(extracted);
    } catch (err) {
      console.error("Failed to load schedules:", err);
      setError(err.message || "Failed to load study schedules from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.scheduledAt) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: form.title.trim(),
        scheduledAt: form.scheduledAt,
      };

      if (editingId) {
        await schedulesApi.update(editingId, payload);
      } else {
        await schedulesApi.create(payload);
      }

      setForm({ title: "", scheduledAt: "" });
      setEditingId(null);
      setShowForm(false);
      await loadSchedules();
    } catch (err) {
      setError(err.message || "Failed to save schedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    let formattedDate = "";
    if (schedule.scheduledAt) {
      // datetime-local input expects YYYY-MM-DDTHH:mm
      try {
        const d = new Date(schedule.scheduledAt);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().slice(0, 16);
        } else {
          formattedDate = schedule.scheduledAt.slice(0, 16);
        }
      } catch {
        formattedDate = schedule.scheduledAt ? schedule.scheduledAt.slice(0, 16) : "";
      }
    }

    setForm({
      title: schedule.title || "",
      scheduledAt: formattedDate,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await schedulesApi.delete(id);
      setDeleteConfirmId(null);
      await loadSchedules();
    } catch (err) {
      setError(err.message || "Failed to delete schedule item.");
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return { date: "No date", time: "" };
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { date: dateStr, time: "" };

      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);

      const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);

      return { date: formattedDate, time: formattedTime };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  // Sort chronological
  const sortedSchedules = [...schedules].sort((a, b) => {
    if (!a.scheduledAt) return 1;
    if (!b.scheduledAt) return -1;
    return new Date(a.scheduledAt) - new Date(b.scheduledAt);
  });

  const filteredSchedules = sortedSchedules.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (s.title || "").toLowerCase().includes(q);
  });

  return (
    <div className="schedule-container">
      {/* Top Controls Bar */}
      <div className="page-action-bar">
        <div className="search-filter-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search study schedules by session or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="action-buttons-group">
          <button
            className="secondary-btn"
            onClick={loadSchedules}
            title="Refresh schedules"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          {!showForm && (
            <button
              className="primary-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", scheduledAt: "" });
                setShowForm(true);
              }}
            >
              <Plus size={16} />
              <span>Add Schedule</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="system-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={loadSchedules} className="alert-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Create / Edit Schedule Form */}
      {showForm && (
        <div className="editor-card">
          <div className="editor-header">
            <h3>{editingId ? "Update Study Schedule" : "Add Study Schedule"}</h3>
            <button
              className="close-editor-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-group">
              <label htmlFor="schedule-title">Session Title / Topic</label>
              <input
                id="schedule-title"
                type="text"
                className="text-input"
                placeholder="e.g. Distributed Systems Lab Revision"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="schedule-time">Date & Time</label>
              <input
                id="schedule-time"
                type="datetime-local"
                className="text-input"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({ ...form, scheduledAt: e.target.value })
                }
                required
              />
            </div>

            <div className="editor-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? (
                  "Saving..."
                ) : editingId ? (
                  <>
                    <Check size={16} /> Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Schedule Session
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Schedule List */}
      {loading ? (
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading study schedules from server...</p>
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <CalendarDays size={28} />
          </div>
          <h3>
            {searchQuery ? "No matching schedules" : "No schedules recorded"}
          </h3>
          <p>
            {searchQuery
              ? `No schedule matches "${searchQuery}".`
              : "Plan your study sessions, lectures, project reviews, or exam dates."}
          </p>
          {!searchQuery && !showForm && (
            <button
              className="primary-btn"
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setForm({ title: "", scheduledAt: "" });
              }}
            >
              <Plus size={15} /> Add Schedule
            </button>
          )}
        </div>
      ) : (
        <div className="schedule-table-wrapper">
          <div className="schedule-list">
            {filteredSchedules.map((schedule) => {
              const dt = formatDateTime(schedule.scheduledAt);
              return (
                <div key={schedule.id} className="schedule-row-card">
                  <div className="schedule-date-col">
                    <div className="calendar-date-badge">
                      <span className="cal-icon">
                        <Calendar size={14} />
                      </span>
                      <span className="cal-date">{dt.date}</span>
                    </div>
                    {dt.time && (
                      <div className="calendar-time-badge">
                        <Clock size={13} />
                        <span>{dt.time}</span>
                      </div>
                    )}
                  </div>

                  <div className="schedule-info-col">
                    <div className="schedule-title-line">
                      <h4 className="schedule-title">{schedule.title}</h4>
                      <span className="record-badge">#{schedule.id}</span>
                    </div>
                  </div>

                  <div className="schedule-actions-col">
                    <button
                      className="action-icon-btn"
                      onClick={() => handleEdit(schedule)}
                      title="Edit schedule"
                    >
                      <Edit2 size={15} />
                      <span>Edit</span>
                    </button>

                    {deleteConfirmId === schedule.id ? (
                      <div className="inline-confirm-delete">
                        <span className="confirm-text">Delete?</span>
                        <button
                          className="delete-confirm-btn"
                          onClick={() => handleDelete(schedule.id)}
                        >
                          Yes
                        </button>
                        <button
                          className="delete-cancel-btn"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="action-icon-btn delete"
                        onClick={() => setDeleteConfirmId(schedule.id)}
                        title="Delete schedule"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
