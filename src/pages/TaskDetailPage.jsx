import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { completeTask, deleteTask, getTask, logTaskVisit, updateTask } from '../lib/api.js'
import TaskForm from '../components/TaskForm.jsx'

export default function TaskDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const t = await getTask(id)
      setTask(t)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load task.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    logTaskVisit(id, 'view').catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleUpdate(payload) {
    setWorking(true)
    try {
      await updateTask(id, payload)
      await logTaskVisit(id, 'update')
      await load()
    } finally {
      setWorking(false)
    }
  }

  async function handleComplete() {
    setWorking(true)
    try {
      await completeTask(id)
      await logTaskVisit(id, 'complete')
      navigate('/completed')
    } finally {
      setWorking(false)
    }
  }

  async function handleDelete() {
    const ok = confirm('Delete this task?')
    if (!ok) return
    setWorking(true)
    try {
      await deleteTask(id)
      navigate('/tasks')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="h1">Task</h1>
          <div className="muted">
            <Link to="/tasks" className="link">
              ← Back to tasks
            </Link>
          </div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn--ghost" onClick={load} disabled={loading}>
            Refresh
          </button>
          {task && !task.is_completed ? (
            <button className="btn" onClick={handleComplete} disabled={working}>
              Mark complete
            </button>
          ) : null}
          <button className="btn btn--danger" onClick={handleDelete} disabled={working}>
            Delete
          </button>
        </div>
      </div>

      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {task ? (
        <div className="grid2">
          <div className="card">
            <h2 className="h2">Edit</h2>
            <TaskForm initial={task} onSubmit={handleUpdate} submitLabel={working ? 'Saving…' : 'Save changes'} />
          </div>
          <div className="card">
            <h2 className="h2">Details</h2>
            <div className="stack" style={{ gap: 10 }}>
              <div>
                <div className="muted">Status</div>
                <div>{task.is_completed ? 'Completed' : 'Active'}</div>
              </div>
              <div>
                <div className="muted">Due date</div>
                <div>{task.due_date || '—'}</div>
              </div>
              <div>
                <div className="muted">Priority</div>
                <div>{task.priority}</div>
              </div>
              <div>
                <div className="muted">Estimate</div>
                <div>{task.estimate_minutes ?? '—'} min</div>
              </div>
              <div>
                <div className="muted">Created</div>
                <div>{task.created_at ? task.created_at.slice(0, 19).replace('T', ' ') : '—'}</div>
              </div>
              <div>
                <div className="muted">Completed at</div>
                <div>{task.completed_at ? task.completed_at.slice(0, 19).replace('T', ' ') : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
