import React, { useState } from 'react';
import WidgetShell from './WidgetShell.jsx';

export default function NotepadWidget({ onRemove }) {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  function addNote(e) {
    e.preventDefault();
    if (input.trim()) {
      setNotes([...notes, input.trim()]);
      setInput('');
    }
  }

  function deleteNote(idx) {
    setNotes(notes.filter((_, i) => i !== idx));
  }

  function resetNotes() {
    setNotes([]);
  }

  return (
    <WidgetShell
      title="Notepad"
      subtitle="Quick notes, bullet style"
      actions={
        <>
          <button className="btn btn--ghost" onClick={resetNotes}>Reset</button>
          {onRemove && (
            <button className="btn btn--ghost" onClick={onRemove} style={{ marginLeft: 8 }}>Remove</button>
          )}
        </>
      }
    >
      <form onSubmit={addNote} style={{ marginBottom: 12 }}>
        <div className="row" style={{ gap: 10 }}>
          <input
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a note and press Enter"
          />
          <button type="submit" className="btn btn--small">Add</button>
        </div>
      </form>
      <ul className="list">
        {notes.map((note, idx) => (
          <li key={idx} className="list__item" style={{ cursor: 'pointer' }}>
            <span>• {note}</span>
            <button className="btn btn--danger btn--small" style={{ marginLeft: 12 }} onClick={() => deleteNote(idx)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}
