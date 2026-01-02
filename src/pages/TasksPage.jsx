import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createTask, listTasks } from '../lib/api.js'
import TaskForm from '../components/TaskForm.jsx'

export default function TasksPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listTasks({ completed: 'false', limit: 100 })
      setItems(data.items)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd(payload) {
    await createTask(payload)
    await refresh()
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="h1">Tasks</h1>
          <div className="muted">Add tasks, then manage them in your Space widgets.</div>
        </div>
        <button className="btn btn--ghost" onClick={refresh}>
          Refresh
        </button>
      </div>

      <div className="grid2">
        <div className="card">
          <h2 className="h2">Add a task</h2>
          <TaskForm onSubmit={handleAdd} />
        </div>

        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 className="h2">Active list</h2>
            <Link to="/completed" className="link">
              View completed →
            </Link>
          </div>
          {loading ? <div className="muted">Loading…</div> : null}
          {error ? <div className="error">{error}</div> : null}
          <ul className="list">
            {items.map((t) => (
              <li key={t.id} className="list__item">
                <div className="list__main">
                  <Link to={`/tasks/${t.id}`} className="link">
                    <div className="list__title">{t.title}</div>
                  </Link>
                  <div className="list__meta">
                    {t.due_date ? `Due ${t.due_date}` : 'No due date'} · Priority {t.priority}
                  </div>
                </div>
                <span className="pill">Open</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
