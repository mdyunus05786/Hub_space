import React, { useEffect, useMemo, useState } from 'react'
import { analyticsSummary } from '../lib/api.js'
import WidgetShell from './WidgetShell.jsx'

function Bar({ value, max }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="bar">
      <div className="bar__fill" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function PerformanceWidget({ onRemove }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const d = await analyticsSummary()
      setData(d)
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const maxDay = useMemo(() => {
    if (!data?.daily) return 0
    return Math.max(1, ...data.daily.map((x) => x.completed))
  }, [data])

  return (
    <WidgetShell
      title="Performance"
      subtitle={data ? `7-day completion rate: ${data.completion_rate_7d}%` : 'Loading…'}
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

      {data ? (
        <div className="stack" style={{ gap: 12 }}>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi__num">{data.completed_today}</div>
              <div className="kpi__label">Completed today</div>
            </div>
            <div className="kpi">
              <div className="kpi__num">{data.remaining_today}</div>
              <div className="kpi__label">Remaining today</div>
            </div>
            <div className="kpi">
              <div className="kpi__num">{data.total_active}</div>
              <div className="kpi__label">Active tasks</div>
            </div>
          </div>

          <div>
            <div className="muted" style={{ marginBottom: 8 }}>
              Completed in last 7 days
            </div>
            <div className="bars">
              {data.daily.map((d) => (
                <div key={d.date} className="bars__row">
                  <div className="bars__date">{d.date.slice(5)}</div>
                  <Bar value={d.completed} max={maxDay} />
                  <div className="bars__val">{d.completed}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </WidgetShell>
  )
}
