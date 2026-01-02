import React, { useMemo, useState } from 'react'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import WidgetPickerModal from '../components/WidgetPickerModal.jsx'
import TodayTasksWidget from '../components/TodayTasksWidget.jsx'
import TaskListWidget from '../components/TaskListWidget.jsx'
import PerformanceWidget from '../components/PerformanceWidget.jsx'
import CompletedWidget from '../components/CompletedWidget.jsx'
import NotepadWidget from '../components/NotepadWidget.jsx'
import TimerWidget from '../components/TimerWidget.jsx'
import BadgeWidget from '../components/BadgeWidget.jsx'

const ReactGridLayout = WidthProvider(GridLayout)

const STORAGE_KEY = 'hubspace.layout.v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const DEFAULT = {
  widgets: ['today', 'performance', 'list'],
  layout: [
    { i: 'today', x: 0, y: 0, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'performance', x: 4, y: 0, w: 8, h: 6, minW: 4, minH: 4 },
    { i: 'list', x: 0, y: 6, w: 12, h: 7, minW: 4, minH: 4 },
  ],
}

function Widget({ type, onRemove }) {
  if (type === 'today') return <TodayTasksWidget onRemove={onRemove} />
  if (type === 'list') return <TaskListWidget compact onRemove={onRemove} />
  if (type === 'performance') return <PerformanceWidget onRemove={onRemove} />
  if (type === 'completed') return <CompletedWidget onRemove={onRemove} />
  if (type === 'notepad') return <NotepadWidget onRemove={onRemove} />
  if (type === 'timer') return <TimerWidget onRemove={onRemove} />
  if (type === 'badge') return <BadgeWidget onRemove={onRemove} />
  return null;
}

export default function DashboardPage() {
  const initial = useMemo(() => loadState() || DEFAULT, [])
  const [widgets, setWidgets] = useState(initial.widgets)
  const [layout, setLayout] = useState(initial.layout)
  const [pickerOpen, setPickerOpen] = useState(false)

  function persist(nextWidgets, nextLayout) {
    saveState({ widgets: nextWidgets, layout: nextLayout })
  }

  function onLayoutChange(next) {
    setLayout(next)
    persist(widgets, next)
  }

  function removeWidget(key) {
    const nextWidgets = widgets.filter((w) => w !== key)
    const nextLayout = layout.filter((l) => l.i !== key)
    setWidgets(nextWidgets)
    setLayout(nextLayout)
    persist(nextWidgets, nextLayout)
  }

  function addWidget(key) {
    const nextWidgets = widgets.includes(key) ? widgets : [...widgets, key]
    const nextLayout = layout.some((l) => l.i === key)
      ? layout
      : [...layout, { i: key, x: 0, y: Infinity, w: 6, h: 6, minW: 3, minH: 4 }]
    setWidgets(nextWidgets)
    setLayout(nextLayout)
    persist(nextWidgets, nextLayout)
    setPickerOpen(false)
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="h1">Your Space</h1>
          <div className="muted">Drag, resize, and customize widgets. Your layout is saved locally.</div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn--ghost" onClick={() => setPickerOpen(true)}>
            Widgets
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => {
              setWidgets(DEFAULT.widgets)
              setLayout(DEFAULT.layout)
              persist(DEFAULT.widgets, DEFAULT.layout)
            }}
          >
            Reset layout
          </button>
        </div>
      </div>

      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={40}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        draggableHandle=".widget__header"
        draggableCancel=".widget__header button, .widget__header [role='button'], .widget__header input, .widget__header select, .widget__header textarea"
        onLayoutChange={onLayoutChange}
      >
        {widgets.map((key) => (
          <div key={key} className="gridItem">
            <div className="gridItem__chrome">
              <Widget type={key} onRemove={() => removeWidget(key)} />
            </div>
          </div>
        ))}
      </ReactGridLayout>

      <WidgetPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={addWidget}
        existingKeys={widgets}
      />
    </div>
  )
}
