import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { ScheduleView } from "./components/ScheduleView";
import { AnnouncementsView } from "./components/AnnouncementsView";
import { CoursesView } from "./components/CoursesView";
import { AssignmentsView } from "./components/AssignmentsView";
import { ProfileView } from "./components/ProfileView";
import { AuthView } from "./components/AuthView";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

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
    setMobileOpen(false);
  };

  if (!isLoggedIn) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="student-portal-app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="portal-main-area">
        <Header
          activePage={activePage}
          user={user}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenProfile={() => setActivePage("Profile")}
        />

        <main className="portal-content-body">
          {activePage === "Dashboard" && (
            <DashboardView onNavigate={setActivePage} user={user} />
          )}

          {activePage === "Courses" && (
            <CoursesView onNavigate={setActivePage} />
          )}

          {activePage === "Assignments" && (
            <AssignmentsView onNavigate={setActivePage} />
          )}

          {activePage === "Schedule" && <ScheduleView />}

          {activePage === "Announcements" && <AnnouncementsView />}

          {activePage === "Profile" && (
            <ProfileView user={user} onLogout={handleLogout} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
