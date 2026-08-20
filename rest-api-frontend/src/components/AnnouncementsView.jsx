import React, { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  RefreshCw,
  X,
  Check,
} from "lucide-react";
import { postsApi } from "../api/api";

export function AnnouncementsView() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsApi.getAll();
      const extracted = Array.isArray(response)
        ? response
        : response.data || [];
      setPosts(extracted);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      setError(err.message || "Failed to load announcements from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (editingId) {
        await postsApi.update(editingId, {
          title: form.title.trim(),
          content: form.content.trim(),
        });
      } else {
        await postsApi.create({
          title: form.title.trim(),
          content: form.content.trim(),
        });
      }

      setForm({ title: "", content: "" });
      setEditingId(null);
      setShowForm(false);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to save announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      content: post.content || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await postsApi.delete(id);
      setDeleteConfirmId(null);
      await loadPosts();
    } catch (err) {
      setError(err.message || "Failed to delete announcement.");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = (p.title || "").toLowerCase().includes(q);
    const contentMatch = (p.content || "").toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });

  return (
    <div className="announcements-container">
      {/* Top Controls Bar */}
      <div className="page-action-bar">
        <div className="search-filter-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search announcements by title or keyword..."
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
            onClick={loadPosts}
            title="Refresh announcements"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          {!showForm && (
            <button
              className="primary-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ title: "", content: "" });
                setShowForm(true);
              }}
            >
              <Plus size={16} />
              <span>New Announcement</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="system-alert error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={loadPosts} className="alert-retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Inline Form for Create / Edit */}
      {showForm && (
        <div className="editor-card">
          <div className="editor-header">
            <h3>{editingId ? "Edit Announcement" : "Create New Announcement"}</h3>
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
              <label htmlFor="announcement-title">Subject / Title</label>
              <input
                id="announcement-title"
                type="text"
                className="text-input"
                placeholder="e.g. Midterm Exam Guidelines & Hall Allocations"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="announcement-content">Announcement Details</label>
              <textarea
                id="announcement-content"
                className="textarea-input"
                rows={5}
                placeholder="Enter the official details, guidelines, or notices for students..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
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
                    <Check size={16} /> Update Announcement
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Publish Announcement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading announcements from server...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon-box">
            <Bell size={28} />
          </div>
          <h3>
            {searchQuery
              ? "No matching announcements"
              : "No announcements available"}
          </h3>
          <p>
            {searchQuery
              ? `No announcements match the query "${searchQuery}". Try a different keyword.`
              : "Official announcements from faculty and administration will be listed here."}
          </p>
          {!searchQuery && !showForm && (
            <button
              className="primary-btn"
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setForm({ title: "", content: "" });
              }}
            >
              <Plus size={15} /> Create Announcement
            </button>
          )}
        </div>
      ) : (
        <div className="items-list">
          {filteredPosts.map((post) => (
            <article key={post.id} className="announcement-card">
              <div className="announcement-card-header">
                <div className="announcement-meta">
                  <span className="record-badge">Notice #{post.id}</span>
                </div>

                <div className="item-actions">
                  <button
                    className="action-icon-btn"
                    onClick={() => handleEdit(post)}
                    title="Edit announcement"
                  >
                    <Edit2 size={15} />
                    <span>Edit</span>
                  </button>

                  {deleteConfirmId === post.id ? (
                    <div className="inline-confirm-delete">
                      <span className="confirm-text">Confirm delete?</span>
                      <button
                        className="delete-confirm-btn"
                        onClick={() => handleDelete(post.id)}
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
                      onClick={() => setDeleteConfirmId(post.id)}
                      title="Delete announcement"
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>

              <h3 className="announcement-title">{post.title}</h3>
              <p className="announcement-body">{post.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
