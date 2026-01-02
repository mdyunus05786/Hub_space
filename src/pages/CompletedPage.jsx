import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listTasks } from '../lib/api.js'

export default function CompletedPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listTasks({ completed: 'true', limit: 200 })
      setItems(data.items)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load completed tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="h1">Completed</h1>
          <div className="muted">
            <Link className="link" to="/tasks">
              ← Back to tasks
            </Link>
          </div>
        </div>
        <button className="btn btn--ghost" onClick={refresh}>
          Refresh
        </button>
      </div>

      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}

      <div className="card">
        <ul className="list">
          {items.map((t) => (
            <li key={t.id} className="list__item">
              <div className="list__main">
                <div className="list__title">{t.title}</div>
                <div className="list__meta">
                  Completed: {t.completed_at ? t.completed_at.slice(0, 19).replace('T', ' ') : '—'}
                </div>
              </div>
              <span className="pill">Done</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
