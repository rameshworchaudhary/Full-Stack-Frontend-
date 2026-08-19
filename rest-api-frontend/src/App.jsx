import { useEffect, useState } from "react";
import { authApi, postsApi, schedulesApi } from "./api/api";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activePage, setActivePage] = useState("Dashboard");

  const handleLogin = (userData) => {
    localStorage.setItem("isLoggedIn", "true");

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }

    setIsLoggedIn(true);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setActivePage("Dashboard");
  };

  if (!isLoggedIn) {
    return <Authentication onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout
      activePage={activePage}
      setActivePage={setActivePage}
      user={user}
      onLogout={handleLogout}
    />
  );
}

/* =========================
   DASHBOARD LAYOUT
========================= */

function DashboardLayout({
  activePage,
  setActivePage,
  user,
  onLogout,
}) {
  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Posts", icon: "▤" },
    { name: "Schedules", icon: "◷" },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">R</div>

          <div>
            <h2>REST Studio</h2>
            <span>Spring Boot API</span>
          </div>
        </div>

        <div className="menu-title">MENU</div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="connection">
            <span className="status-dot"></span>

            <div>
              <strong>Backend Online</strong>
              <small>localhost:8080</small>
            </div>
          </div>

          <div className="logged-user">
            <div className="user-avatar">
              {getInitials(user)}
            </div>

            <div className="user-details">
              <strong>{getUserName(user)}</strong>
              <small>{getUserEmail(user)}</small>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              REST API / {activePage}
            </p>

            <h1>{activePage}</h1>
          </div>

          <div className="top-actions">
            <div className="api-status">
              <span></span>
              API Connected
            </div>

            <div className="avatar">
              {getInitials(user)}
            </div>
          </div>
        </header>

        {activePage === "Dashboard" && <Dashboard />}

        {activePage === "Posts" && <Posts />}

        {activePage === "Schedules" && <Schedules />}
      </main>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const [postCount, setPostCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [postsResponse, schedulesResponse] =
        await Promise.all([
          postsApi.getAll(),
          schedulesApi.getAll(),
        ]);

      setPostCount(postsResponse.data?.length || 0);
      setScheduleCount(schedulesResponse.data?.length || 0);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  return (
    <section className="content">
      <div className="hero-card">
        <div>
          <span className="eyebrow">
            SPRING BOOT REST API
          </span>

          <h2>Welcome back 👋</h2>

          <p>
            Manage your REST APIs, posts and schedules from
            one powerful dashboard.
          </p>
        </div>

        <div className="hero-icon">⚡</div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="▤"
          title="Total Posts"
          value={postCount}
        />

        <StatCard
          icon="◷"
          title="Schedules"
          value={scheduleCount}
        />

        <StatCard
          icon="◉"
          title="API Endpoints"
          value="15+"
        />

        <StatCard
          icon="✓"
          title="API Status"
          value="Online"
        />
      </div>

      <div className="section-header">
        <div>
          <h2>API Activity</h2>
          <p>REST API operations</p>
        </div>
      </div>

      <div className="activity-card">
        <Activity
          method="POST"
          endpoint="/api/auth/login"
          status="200"
        />

        <Activity
          method="POST"
          endpoint="/api/posts"
          status="201"
        />

        <Activity
          method="GET"
          endpoint="/api/posts"
          status="200"
        />

        <Activity
          method="POST"
          endpoint="/api/schedules"
          status="201"
        />

        <Activity
          method="GET"
          endpoint="/api/schedules"
          status="200"
        />
      </div>
    </section>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

function Activity({ method, endpoint, status }) {
  return (
    <div className="activity-row">
      <span className={`method ${method.toLowerCase()}`}>
        {method}
      </span>

      <span className="endpoint">{endpoint}</span>

      <span className="success-status">
        <span>●</span> {status}
      </span>
    </div>
  );
}

/* =========================
   AUTHENTICATION
========================= */

function Authentication({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      let response;

      if (mode === "login") {
        response = await authApi.login({
          email: form.email,
          password: form.password,
        });

        setMessage(
          response.message || "Login successful"
        );

        const userData = {
          name: form.email.split("@")[0],
          email: form.email,
        };

        setTimeout(() => {
          onLogin(userData);
        }, 500);
      } else {
        response = await authApi.register({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        setMessage(
          response.message ||
            "Registration successful"
        );

        setForm({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          setMode("login");
          setMessage("");
        }, 1200);
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">

        <div className="auth-brand">
          <div className="brand-logo">R</div>

          <h1>REST Studio</h1>

          <p>
            Spring Boot REST API Dashboard
          </p>
        </div>

        <div className="auth-layout">

          <div className="auth-info">
            <span className="eyebrow">
              SECURE ACCESS
            </span>

            <h2>
              Build. Manage.
              <br />
              Control your APIs.
            </h2>

            <p>
              A modern dashboard for managing your
              Spring Boot REST APIs, posts and
              schedules.
            </p>

            <div className="feature">
              <span>✓</span>

              <div>
                <strong>Bean Validation</strong>
                <small>
                  Validated request data
                </small>
              </div>
            </div>

            <div className="feature">
              <span>✓</span>

              <div>
                <strong>BCrypt Security</strong>
                <small>
                  Encrypted passwords
                </small>
              </div>
            </div>

            <div className="feature">
              <span>✓</span>

              <div>
                <strong>REST API</strong>
                <small>
                  Spring Boot backend
                </small>
              </div>
            </div>

            <div className="feature">
              <span>✓</span>

              <div>
                <strong>H2 Database</strong>
                <small>
                  Persistent API data
                </small>
              </div>
            </div>
          </div>

          <div className="form-card auth-form-card">

            <div className="form-tabs">

              <button
                className={
                  mode === "login"
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
              >
                Login
              </button>

              <button
                className={
                  mode === "register"
                    ? "selected"
                    : ""
                }
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
              >
                Register
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {mode === "register" && (
                <label>
                  Name

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rameshwor Chaudhary"
                    required
                  />
                </label>
              )}

              <label>
                Email

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </label>

              {error && (
                <div className="auth-message error">
                  {error}
                </div>
              )}

              {message && (
                <div className="auth-message success">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login →"
                  : "Create Account →"}
              </button>

            </form>
          </div>
        </div>

        <p className="auth-footer">
          REST Studio • Spring Boot REST API
        </p>

      </div>
    </div>
  );
}

/* =========================
   POSTS
========================= */

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const loadPosts = async () => {
    try {
      setLoading(true);

      const response = await postsApi.getAll();

      setPosts(response.data || []);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await postsApi.update(
          editingId,
          form
        );
      } else {
        await postsApi.create(form);
      }

      setForm({
        title: "",
        content: "",
      });

      setEditingId(null);
      setShowForm(false);

      await loadPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);

    setForm({
      title: post.title,
      content: post.content,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post?"
      )
    ) {
      return;
    }

    try {
      await postsApi.delete(id);

      await loadPosts();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="content">

      <div className="page-heading-row">

        <div>
          <h2>Posts</h2>

          <p>
            Manage posts through your Spring Boot API.
          </p>
        </div>

        <button
          className="primary-btn small"
          onClick={() => {
            setEditingId(null);

            setForm({
              title: "",
              content: "",
            });

            setShowForm(true);
          }}
        >
          + Create Post
        </button>

      </div>

      {showForm && (
        <div className="form-card post-form">

          <h3>
            {editingId
              ? "Update Post"
              : "Create New Post"}
          </h3>

          <form onSubmit={handleSubmit}>

            <label>
              Title

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Enter post title"
                required
              />
            </label>

            <label>
              Content

              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: e.target.value,
                  })
                }
                placeholder="Write your post content..."
                required
                rows="6"
              />
            </label>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-btn small"
              >
                {editingId
                  ? "Update Post"
                  : "Create Post"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>

            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="empty-card">
          <h3>Loading posts...</h3>
          <p>
            Fetching data from Spring Boot.
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-card">

          <div className="empty-icon">▤</div>

          <h3>No posts yet</h3>

          <p>
            Create your first post using the REST API.
          </p>

          <button
            className="primary-btn"
            onClick={() => setShowForm(true)}
          >
            + Create Post
          </button>

        </div>
      ) : (
        <div className="posts-grid">

          {posts.map((post) => (
            <div
              className="post-card"
              key={post.id}
            >

              <div className="post-card-top">
                <span className="post-badge">
                  POST #{post.id}
                </span>
              </div>

              <h3>{post.title}</h3>

              <p>{post.content}</p>

              <div className="post-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(post)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(post.id)
                  }
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </section>
  );
}

/* =========================
   SCHEDULES
========================= */

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    scheduledAt: "",
  });

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const response =
        await schedulesApi.getAll();

      setSchedules(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load schedules:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const scheduleData = {
        title: form.title,
        scheduledAt: form.scheduledAt,
      };

      if (editingId) {
        await schedulesApi.update(
          editingId,
          scheduleData
        );
      } else {
        await schedulesApi.create(
          scheduleData
        );
      }

      setForm({
        title: "",
        scheduledAt: "",
      });

      setEditingId(null);
      setShowForm(false);

      await loadSchedules();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);

    setForm({
      title: schedule.title,
      scheduledAt: schedule.scheduledAt
        ? schedule.scheduledAt.slice(0, 16)
        : "",
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this schedule?"
      )
    ) {
      return;
    }

    try {
      await schedulesApi.delete(id);

      await loadSchedules();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="content">

      <div className="page-heading-row">

        <div>
          <h2>Schedules</h2>

          <p>
            Manage scheduled tasks through your
            Spring Boot API.
          </p>
        </div>

        <button
          className="primary-btn small"
          onClick={() => {
            setEditingId(null);

            setForm({
              title: "",
              scheduledAt: "",
            });

            setShowForm(true);
          }}
        >
          + New Schedule
        </button>

      </div>

      {showForm && (
        <div className="form-card post-form">

          <h3>
            {editingId
              ? "Update Schedule"
              : "Create New Schedule"}
          </h3>

          <form onSubmit={handleSubmit}>

            <label>
              Title

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Enter schedule title"
                required
              />
            </label>

            <label>
              Scheduled Time

              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) =>
                  setForm({
                    ...form,
                    scheduledAt: e.target.value,
                  })
                }
                required
              />
            </label>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-btn small"
              >
                {editingId
                  ? "Update Schedule"
                  : "Create Schedule"}
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {loading ? (
        <div className="empty-card">
          <h3>Loading schedules...</h3>
          <p>
            Fetching data from Spring Boot.
          </p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="empty-card">

          <div className="empty-icon">◷</div>

          <h3>No schedules yet</h3>

          <p>
            Create your first scheduled event.
          </p>

          <button
            className="primary-btn"
            onClick={() => setShowForm(true)}
          >
            + New Schedule
          </button>

        </div>
      ) : (
        <div className="posts-grid">

          {schedules.map((schedule) => (
            <div
              className="post-card"
              key={schedule.id}
            >

              <div className="post-card-top">
                <span className="post-badge">
                  SCHEDULE #{schedule.id}
                </span>
              </div>

              <h3>{schedule.title}</h3>

              <p>
                📅{" "}
                {schedule.scheduledAt
                  ? new Date(
                      schedule.scheduledAt
                    ).toLocaleString()
                  : "No date"}
              </p>

              <div className="post-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(schedule)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(schedule.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </section>
  );
}

/* =========================
   USER HELPERS
========================= */

function getUserName(user) {
  if (!user) return "User";

  return (
    user.name ||
    user.email?.split("@")[0] ||
    "User"
  );
}

function getUserEmail(user) {
  return user?.email || "Authenticated user";
}

function getInitials(user) {
  const name = getUserName(user);

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default App;