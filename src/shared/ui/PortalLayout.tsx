import { NavLink, Outlet } from 'react-router-dom';
import { features } from '../../app/registry';

export default function PortalLayout() {
  const nav = features.flatMap((f) => f.nav ?? []);
  return (
    <>
      <header className="hdr">
        <h1>HOD Tracker</h1>
        <small>Department Marks Issues Portal</small>
      </header>
      <nav className="nav">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="wrap">
        <main className="main">
          <Outlet />
        </main>
      </div>
      <footer className="foot">HOD Tracker</footer>
    </>
  );
}
