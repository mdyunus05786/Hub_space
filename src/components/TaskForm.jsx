import React, { useState } from 'react'

export default function TaskForm({ initial = {}, onSubmit, submitLabel = 'Add task' }) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [dueDate, setDueDate] = useState(initial.due_date || '')
  const [priority, setPriority] = useState(initial.priority ?? 2)
  const [estimate, setEstimate] = useState(initial.estimate_minutes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate || null,
        priority: Number(priority),
        estimate_minutes: estimate === '' ? null : Number(estimate),
      })
      if (!initial.id) {
        setTitle('')
        setDescription('')
        setDueDate('')
        setPriority(2)
        setEstimate('')
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Finish lab report" />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
          rows={3}
        />
      </div>
      <div className="row">
        <div className="field">
          <label>Due date</label>
          <input type="date" value={dueDate || ''} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>
        <div className="field">
          <label>Estimate (min)</label>
          <input
            type="number"
            min="0"
            value={estimate}
            onChange={(e) => setEstimate(e.target.value)}
            placeholder="e.g., 45"
          />
        </div>
      </div>
      {error ? <div className="error">{error}</div> : null}
      <button className="btn" type="submit" disabled={saving}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
