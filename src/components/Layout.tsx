import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

type LayoutProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Layout({ title, subtitle, actions, children }: LayoutProps) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbarMain">
          <Link to="/" className="brand">
            Roots
          </Link>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div className="topbarActions">{actions}</div> : null}
      </header>
      <main className="content">{children}</main>
      <nav className="bottomNav" aria-label="Primary">
        <NavLink to="/plants" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="navIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4h12v16H6z" />
              <path d="M9 8h6M9 12h6M9 16h3" />
            </svg>
          </span>
          <span>Plants</span>
        </NavLink>
        <NavLink to="/rooms" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="navIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20V8l8-4 8 4v12" />
              <path d="M9 20v-6h6v6" />
            </svg>
          </span>
          <span>Rooms</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="navIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
              <path d="M19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.9 7.9 0 0 0-1.7-1L15 5h-6l-.3 2a7.9 7.9 0 0 0-1.7 1L4.6 7.5l-2 3.5L4.6 12a7.9 7.9 0 0 0-.1 1 7.9 7.9 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7.9 7.9 0 0 0 1.7 1L9 19h6l.3-2a7.9 7.9 0 0 0 1.7-1l2.4 1 2-3.5Z" />
            </svg>
          </span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
