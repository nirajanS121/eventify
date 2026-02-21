import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Calendar, BookOpen, CreditCard, Tag, LogOut,
  Menu, X, Snowflake, ChevronRight, Bell
} from 'lucide-react';
import { logoutAdmin } from '../../store/slices/authSlice';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Bookings', path: '/admin/bookings', icon: BookOpen },
  { label: 'Payments', path: '/admin/payments', icon: CreditCard },
  { label: 'Promos', path: '/admin/promos', icon: Tag },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector(state => state.auth);
  const { bookings } = useSelector(state => state.booking);

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-dark-900 border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-lg gradient-mixed flex items-center justify-center">
            <Snowflake className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white">Forge&Flow</span>
            <span className="block text-[9px] uppercase tracking-[0.15em] text-slate-500">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-ice-500/10 text-ice-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-ice-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {link.label}
                {link.label === 'Bookings' && pendingCount > 0 && (
                  <span className="ml-auto bg-fire-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
                {active && <ChevronRight className="w-4 h-4 ml-auto text-ice-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full gradient-fire flex items-center justify-center text-xs font-bold text-white">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email || 'admin@forgeandflow.co'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-ember-400 hover:bg-ember-500/10 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-dark-900 border-r border-white/5 z-50">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg gradient-mixed flex items-center justify-center">
                  <Snowflake className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-white">Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {sidebarLinks.map(link => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active ? 'bg-ice-500/10 text-ice-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {link.label}
                    {link.label === 'Bookings' && pendingCount > 0 && (
                      <span className="ml-auto bg-fire-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-ember-400 hover:bg-ember-500/10 transition-all"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass border-b border-white/5">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-ice-400 transition-colors"
              >
                View Site →
              </Link>
              <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-fire-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
