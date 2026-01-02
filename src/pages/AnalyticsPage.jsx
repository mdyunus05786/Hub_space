import React, { useEffect, useState } from 'react'
import { analyticsSummary, api } from '../lib/api.js'
import EfficiencyChartWidget from '../components/EfficiencyChartWidget.jsx'

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  //  move these hooks here (top-level)
  const [showReset, setShowReset] = useState(false)
  const [resetDate, setResetDate] = useState('')

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

  async function handleReset(range, date = null) {
    setShowReset(false)
    let params = { range }
    if (range === 'day') {
      if (!date) {
        alert('Please select a date.')
        return
      }
      params.date = date
    }
    try {
      await api.post('/api/analytics/reset', null, { params })
      refresh()
    } catch (err) {
      alert(err?.response?.data?.error || err.message || 'Failed to reset analytics.')
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="h1">Analytics</h1>
          <div className="muted">Quick summary from your Django DB.</div>
        </div>

        <button className="btn btn--ghost" onClick={refresh}>
          Refresh
        </button>

        <button className="btn btn--ghost" onClick={() => setShowReset(true)}>
          Reset Analytics
        </button>
      </div>

      {showReset && (
        <div className="modal__backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal__header">
              <div>
                <div className="modal__title">Reset Analytics Data</div>
                <div className="modal__subtitle">
                  Remove all tasks and analytics for a selected range.
                </div>
              </div>
              <button className="btn btn--ghost" onClick={() => setShowReset(false)}>
                Cancel
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn btn--ghost btn--wide" onClick={() => handleReset('week')}>
                Reset Week
              </button>
              <button className="btn btn--ghost btn--wide" onClick={() => handleReset('month')}>
                Reset Month
              </button>
              <button className="btn btn--ghost btn--wide" onClick={() => handleReset('year')}>
                Reset Year
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label htmlFor="reset-date" style={{ color: 'var(--muted)', fontWeight: 700, marginRight: 8 }}>
                  Select date:
                </label>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    id="reset-date"
                    type="date"
                    className="input"
                    value={resetDate}
                    onChange={e => {
                      setResetDate(e.target.value);
                      // Show calendar picker when typing
                      e.target.showPicker && e.target.showPicker();
                    }}
                    onFocus={e => {
                      // Show calendar picker when focused
                      e.target.showPicker && e.target.showPicker();
                    }}
                    style={{ width: '100%', paddingRight: '32px' }}
                  />
                  <span
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}
                    onClick={() => document.getElementById('reset-date').focus()}
                  >
                    📅
                  </span>
                </div>
                <button
                  className="btn btn--ghost btn--wide"
                  style={{ height: '40px', flex: 1 }}
                  disabled={!resetDate}
                  onClick={() => handleReset('day', resetDate)}
                >
                  Reset Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      // ...existing code...

      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {data ? (
        <div className="grid2">
          <div className="card">
            <h2 className="h2">Today</h2>
            <div className="kpis">
              <div className="kpi">
                <div className="kpi__num">{data.completed_today}</div>
                <div className="kpi__label">Completed</div>
              </div>
              <div className="kpi">
                <div className="kpi__num">{data.remaining_today}</div>
                <div className="kpi__label">Remaining</div>
              </div>
              <div className="kpi">
                <div className="kpi__num">{data.total_active}</div>
                <div className="kpi__label">Active</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="h2">7-day summary</h2>
            <div className="stack" style={{ gap: 10 }}>
              <div>
                <div className="muted">Completion rate</div>
                <div className="big">{data.completion_rate_7d}%</div>
              </div>
              <div>
                <div className="muted">Tasks created</div>
                <div className="big">{data.created_7d}</div>
              </div>
              <div>
                <div className="muted">Tasks completed</div>
                <div className="big">{data.completed_7d}</div>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <EfficiencyChartWidget />
          </div>
        </div>
      ) : null}
    </div>
  )
}
