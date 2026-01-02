import React, { useEffect, useMemo, useState } from 'react'
import { completeTask, listTasks } from '../lib/api.js'
import WidgetShell from './WidgetShell.jsx'

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString()
  } catch {
    return d
  }
}

export default function TodayTasksWidget({ onRemove }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const todayStr = useMemo(() => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listTasks({ due_date: todayStr, completed: 'false' })
      setTasks(data.items)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load today tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleComplete(id) {
    await completeTask(id)
    await refresh()
  }

  return (
    <WidgetShell
      title="Today"
      subtitle={`Due: ${formatDate(todayStr)}`}
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
      {!loading && !error && tasks.length === 0 ? <div className="muted">No tasks due today 🎉</div> : null}
      <ul className="list">
        {tasks.map((t) => (
          <li key={t.id} className="list__item">
            <div className="list__main">
              <div className="list__title">{t.title}</div>
              {t.description ? <div className="list__meta">{t.description}</div> : null}
            </div>
            <button className="btn btn--small" onClick={() => handleComplete(t.id)}>
              Complete
            </button>
          </li>
        ))}
      </ul>
    </WidgetShell>
  )
}
