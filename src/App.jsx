import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import TaskDetailPage from './pages/TaskDetailPage.jsx'
import CompletedPage from './pages/CompletedPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'

function TopNav() {
  return (
    <header className="topnav">
      <div className="topnav__inner">
        <div className="brand">
          <div className="brand__logo">HS</div>
          <div className="brand__text">
            <div className="brand__title">HubSpace</div>
            <div className="brand__subtitle">Tasks + Performance</div>
          </div>
        </div>
        <nav className="navlinks">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Space
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : '')}>
            Tasks
          </NavLink>
          <NavLink to="/completed" className={({ isActive }) => (isActive ? 'active' : '')}>
            Completed
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
            Analytics
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="app">
      <TopNav />
      <main className="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/completed" element={<CompletedPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </div>
  )
}
