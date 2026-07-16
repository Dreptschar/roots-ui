import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HouseHeart, Settings, Sprout } from 'lucide-react';

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
            <Sprout></Sprout>
          </span>
          <span>Plants</span>
        </NavLink>
        <NavLink to="/rooms" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="navIcon" aria-hidden="true">
            <HouseHeart></HouseHeart>
          </span>
          <span>Rooms</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <span className="navIcon" aria-hidden="true">
            <Settings />
          </span>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
