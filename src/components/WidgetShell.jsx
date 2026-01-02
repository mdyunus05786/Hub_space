import React from 'react'

export default function WidgetShell({ title, subtitle, actions, children }) {
  return (
    <section className="widget">
      <header className="widget__header">
        <div>
          <div className="widget__title">{title}</div>
          {subtitle ? <div className="widget__subtitle">{subtitle}</div> : null}
        </div>
        <div className="widget__actions">{actions}</div>
      </header>
      <div className="widget__content">
        <div className="widget__inner">{children}</div>
      </div>
    </section>
  )
}
