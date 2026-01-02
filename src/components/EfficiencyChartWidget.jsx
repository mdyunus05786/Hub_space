import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analyticsCompletion } from '../lib/api.js';

export default function EfficiencyChartWidget() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState('week');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const result = await analyticsCompletion(range);
        // Transform API response to chart format
        const { labels, values, completedCounts, totalCounts } = result;
        const chartData = labels.map((label, i) => ({
          date: label,
          efficiency: values[i],
          completed: completedCounts[i],
          total: totalCounts[i]
        }));
        setData(chartData);
      } catch (err) {
        setError(err?.response?.data?.error || err.message || 'Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [range]);

  return (
    <div className="card efficiency-chart-widget">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="h2">Completion Efficiency</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className={range === 'week' ? 'btn btn--ghost btn--active' : 'btn btn--ghost'} onClick={() => setRange('week')}>Week</button>
          <button className={range === 'month' ? 'btn btn--ghost btn--active' : 'btn btn--ghost'} onClick={() => setRange('month')}>Month</button>
          <button className={range === 'year' ? 'btn btn--ghost btn--active' : 'btn btn--ghost'} onClick={() => setRange('year')}>Year</button>
        </div>
      </div>
      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {!loading && !error && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency (%)" />
            <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
