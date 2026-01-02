import React, { useEffect, useState } from 'react'
import { listTasks } from '../lib/api.js'
import WidgetShell from './WidgetShell.jsx'

export default function CompletedWidget({ onRemove }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listTasks({ completed: 'true', limit: 20 })
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
    <WidgetShell
      title="Completed"
      subtitle="Most recent"
      actions={
        <>
          <button className="btn btn--ghost" onClick={refresh}>
            Refresh
          </button>
          {onRemove && (
            <button className="btn btn--ghost" onClick={onRemove} style={{ marginLeft: 8 }}>
              Remove
            </button>
          )}
        </>
      }
    >
      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}
      <ul className="list">
        {items.map((t) => (
          <li key={t.id} className="list__item">
            <div className="list__main">
              <div className="list__title">{t.title}</div>
              <div className="list__meta">Completed: {t.completed_at ? t.completed_at.slice(0, 19).replace('T', ' ') : '—'}</div>
            </div>
            <span className="pill">Done</span>
          </li>
        ))}
      </ul>
    </WidgetShell>
  )
}
