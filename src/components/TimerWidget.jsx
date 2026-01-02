import React, { useState, useEffect } from 'react';
import WidgetShell from './WidgetShell.jsx';
import { listTasks, getTask } from '../lib/api.js';
import CountdownCircle from './CountdownCircle.jsx';

function getTimeParts(deadline) {
  if (!deadline) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

export default function TimerWidget({ onRemove }) {
  const [tasks, setTasks] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const data = await listTasks({ completed: false });
        setTasks(data.items);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedTask(null);
      return;
    }
    async function fetchTask() {
      const t = await getTask(selectedId);
      setSelectedTask(t);
    }
    fetchTask();
  }, [selectedId]);

  // Update timer every second
  useEffect(() => {
    if (!selectedTask) return;
    const interval = setInterval(() => {
      setSelectedTask((t) => ({ ...t })); // force re-render
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTask]);

  return (
    <WidgetShell
      title="Task Timer"
      subtitle="Track time left for a task deadline"
      actions={
        <>
          {onRemove && (
            <button className="btn btn--ghost" onClick={onRemove}>Remove</button>
          )}
        </>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            className="input timer-select"
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">Select a task…</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedTask && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div className="h2">{selectedTask.title}</div>
          {(() => {
            const { days, hours, minutes, seconds, expired } = getTimeParts(selectedTask.due_date);
            if (expired) return <div style={{ fontSize: 22, fontWeight: 800, margin: '18px 0' }}>Deadline passed</div>;
            return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, margin: '18px 0' }}>
                <CountdownCircle value={days} max={99} label="Days" />
                <CountdownCircle value={hours} max={24} label="Hours" />
                <CountdownCircle value={minutes} max={60} label="Minutes" />
                <CountdownCircle value={seconds} max={60} label="Seconds" />
              </div>
            );
          })()}
          <div className="muted">Deadline: {selectedTask.due_date || 'No due date'}</div>
        </div>
      )}
      {!selectedTask && <div className="muted">Select a task to start the timer.</div>}
    </WidgetShell>
  );
}
