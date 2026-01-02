import React from 'react'

const WIDGETS = [
  {
    key: 'today',
    title: 'Today Tasks',
    desc: 'Tasks due today + quick complete.',
  },
  {
    key: 'list',
    title: 'Task List',
    desc: 'All tasks with filters.',
  },
  {
    key: 'performance',
    title: 'Performance',
    desc: 'Completion trend + streak cues.',
  },
  {
    key: 'completed',
    title: 'Completed',
    desc: 'Recently completed tasks.',
  },
  {
    key: 'notepad',
    title: 'Notepad',
    desc: 'Quick notes, bullet style, with reset and delete.',
  },
  {
    key: 'timer',
    title: 'Task Timer',
    desc: 'Select a task and track time left until its deadline.',
  },
  {
    key: 'badge',
    title: 'Badge',
    desc: 'Shows your weekly efficiency badge (brown, silver, gold, diamond).',
  },
]

export default function WidgetPickerModal({ open, onClose, onPick, existingKeys = [] }) {
  if (!open) return null

  return (
    <div className="modal__backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <div>
            <div className="modal__title">Add a widget</div>
            <div className="modal__subtitle">Widgets are draggable + resizable in your Space.</div>
          </div>
          <button className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal__grid">
          {WIDGETS.map((w) => {
            const disabled = existingKeys.includes(w.key)
            return (
              <button
                key={w.key}
                className={`picker ${disabled ? 'picker--disabled' : ''}`}
                onClick={() => !disabled && onPick(w.key)}
              >
                <div className="picker__title">{w.title}</div>
                <div className="picker__desc">{w.desc}</div>
                <div className="picker__hint">{disabled ? 'Already added' : 'Click to add'}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
