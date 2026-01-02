import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { completeTask, listTasks } from '../lib/api.js'
import WidgetShell from './WidgetShell.jsx'
import TaskForm from './TaskForm.jsx'
import { createTask } from '../lib/api.js'

export default function TaskListWidget({ compact = false, onRemove }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter((t) => (t.title || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
  }, [query, tasks])

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await listTasks({ completed: String(showCompleted) })
      setTasks(data.items)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompleted])

  async function handleComplete(id) {
    await completeTask(id)
    await refresh()
  }

  async function handleAddTask(formData) {
    // Always set due_date to today
    const today = new Date().toISOString().slice(0, 10)
    await createTask({ ...formData, due_date: today })
    await refresh()
  }

  return (
    <WidgetShell
      title={compact ? 'Tasks' : 'Task List'}
      subtitle={showCompleted ? 'Showing completed' : 'Showing active'}
      actions={
        <>
          <button className="btn btn--ghost" onClick={refresh}>
            Refresh
          </button>
          <button className="btn btn--ghost" onClick={() => setShowCompleted((v) => !v)}>
            {showCompleted ? 'Show active' : 'Show completed'}
          </button>
          {onRemove && (
            <button className="btn btn--ghost" onClick={onRemove} style={{ marginLeft: 8 }}>
              Remove
            </button>
          )}
        </>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <TaskForm onSubmit={handleAddTask} submitLabel="Add task for today" />
      </div>
      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}
    </WidgetShell>
  )
}
