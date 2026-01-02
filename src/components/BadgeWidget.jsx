import React, { useEffect, useState } from 'react';
import WidgetShell from './WidgetShell.jsx';
import { analyticsCompletion } from '../lib/api.js';

const BADGES = [
  { name: 'Diamond', color: '#00eaff', min: 90, icon: '💎' },
  { name: 'Gold', color: '#ffd700', min: 80, icon: '🥇' },
  { name: 'Silver', color: '#c0c0c0', min: 70, icon: '🥈' },
  { name: 'Brown', color: '#a0522d', min: 40, icon: '🥉' },
  { name: 'None', color: '#444', min: 0, icon: '🔘' },
];

function getBadge(efficiency) {
  for (const badge of BADGES) {
    if (efficiency >= badge.min) return badge;
  }
  return BADGES[BADGES.length - 1];
}

export default function BadgeWidget({ onRemove }) {
  const [efficiency, setEfficiency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const result = await analyticsCompletion('week');
        // Calculate weekly average efficiency from values array
        let avg = null;
        if (Array.isArray(result?.values) && result.values.length > 0) {
          const sum = result.values.reduce((a, b) => a + b, 0);
          avg = Math.round(sum / result.values.length);
        }
        setEfficiency(avg);
      } catch (err) {
        setError('Failed to load badge data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const badge = getBadge(efficiency || 0);

  return (
    <WidgetShell
      title="Badge"
      subtitle="Weekly average efficiency badge"
      actions={
        <>
          {onRemove && (
            <button className="btn btn--ghost" onClick={onRemove}>Remove</button>
          )}
        </>
      }
    >
      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {!loading && !error && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{ fontSize: 64, color: badge.color }}>{badge.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: badge.color }}>{badge.name} Badge</div>
          <div className="muted" style={{ marginTop: 8 }}>
            Weekly Efficiency: <b>{efficiency !== null ? efficiency + '%' : 'N/A'}</b>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
