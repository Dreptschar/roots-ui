import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

type LayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Layout({ title, subtitle, children }: LayoutProps) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <Link to="/" className="brand">
            Roots
          </Link>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </header>
      <main className="content">{children}</main>
      <nav className="bottomNav" aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Dashboard
        </NavLink>
        <NavLink to="/plants/new" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Add plant
        </NavLink>
      </nav>
    </div>
  );
}
