import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Code2, ClipboardList, BookOpen, User, FileSearch, History, FileText } from 'lucide-react';

const navItems = [
  { to: '/dashboard', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/analyze', end: false, label: 'Analyze', icon: FileSearch },
  { to: '/dashboard/results', end: false, label: 'Results', icon: FileText },
  { to: '/dashboard/history', end: false, label: 'History', icon: History },
  { to: '/dashboard/practice', end: false, label: 'Practice', icon: Code2 },
  { to: '/dashboard/assessments', end: false, label: 'Assessments', icon: ClipboardList },
  { to: '/dashboard/resources', end: false, label: 'Resources', icon: BookOpen },
  { to: '/dashboard/profile', end: false, label: 'Profile', icon: User },
];

function NavIcon({ icon: Icon }) {
  return <Icon className="w-5 h-5 shrink-0" aria-hidden />;
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <nav className="p-4 space-y-1" aria-label="Main">
          {navItems.map(({ to, end, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <NavIcon icon={icon} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-slate-900">Placement Prep</h1>
          <div
            className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium"
            aria-hidden
          >
            U
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
