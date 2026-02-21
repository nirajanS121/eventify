import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar, BookOpen, DollarSign, Users, TrendingUp, Clock,
  CheckCircle, XCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchEvents } from '../../store/slices/eventsSlice';
import { fetchAllBookings } from '../../store/slices/bookingSlice';
import { fetchDashboardStats } from '../../store/slices/adminSlice';

const CHART_COLORS = ['#06b6d4', '#f97316', '#10b981', '#ef4444', '#a855f7'];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { events } = useSelector(state => state.events);
  const { bookings } = useSelector(state => state.booking);
  const { dashboardStats } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchAllBookings());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const totalEvents = dashboardStats?.totalEvents ?? events.length;
  const activeEvents = dashboardStats?.activeEvents ?? events.filter(e => e.status === 'active').length;
  const totalBookings = dashboardStats?.totalBookings ?? bookings.length;
  const pendingBookings = dashboardStats?.pendingBookings ?? bookings.filter(b => b.status === 'pending').length;
  const approvedBookings = dashboardStats?.approvedBookings ?? bookings.filter(b => b.status === 'approved').length;
  const rejectedBookings = dashboardStats?.rejectedBookings ?? bookings.filter(b => b.status === 'rejected').length;
  const totalRevenue = dashboardStats?.totalRevenue ?? bookings
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + Number(b.paidAmount || 0), 0);
  const uniqueCustomers = dashboardStats?.uniqueCustomers ?? new Set(bookings.map(b => b.email)).size;
  const repeatCustomers = bookings.reduce((acc, b) => {
    acc[b.email] = (acc[b.email] || 0) + 1;
    return acc;
  }, {});
  const repeatRate = uniqueCustomers > 0
    ? Math.round((Object.values(repeatCustomers).filter(c => c > 1).length / uniqueCustomers) * 100)
    : 0;

  // Chart data — use real monthly revenue from API or derive from bookings
  const revenueData = dashboardStats?.revenueOverTime?.length
    ? dashboardStats.revenueOverTime
    : (() => {
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const buckets = {};
        bookings.filter(b => b.status === 'approved').forEach(b => {
          const d = new Date(b.createdAt || b.bookingDate);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
          const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
          if (!buckets[key]) buckets[key] = { month: label, revenue: 0 };
          buckets[key].revenue += Number(b.paidAmount || 0);
        });
        return Object.keys(buckets).sort().map(k => buckets[k]);
      })();

  const bookingsByEvent = events.slice(0, 5).map(e => ({
    name: e.name.length > 15 ? e.name.slice(0, 15) + '...' : e.name,
    bookings: e.booked,
    capacity: e.capacity,
  }));

  const statusData = [
    { name: 'Approved', value: approvedBookings },
    { name: 'Pending', value: pendingBookings },
    { name: 'Rejected', value: rejectedBookings },
  ];

  const stats = [
    { label: 'Total Events', value: totalEvents, sub: `${activeEvents} active`, icon: Calendar, color: 'ice' },
    { label: 'Total Bookings', value: totalBookings, sub: `${pendingBookings} pending`, icon: BookOpen, color: 'fire' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'Verified payments', icon: DollarSign, color: 'mint' },
    { label: 'Repeat Rate', value: `${repeatRate}%`, sub: `${uniqueCustomers} unique`, icon: Users, color: 'fire' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-light rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'ice' ? 'bg-ice-500/10' : stat.color === 'mint' ? 'bg-mint-500/10' : 'bg-fire-500/10'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    stat.color === 'ice' ? 'text-ice-400' : stat.color === 'mint' ? 'text-mint-400' : 'text-fire-400'
                  }`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-light rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2236',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by Event */}
        <div className="glass-light rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Bookings by Event</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByEvent}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2236',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="bookings" fill="#f97316" radius={[6, 6, 0, 0]} />
              <Bar dataKey="capacity" fill="rgba(255,255,255,0.05)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Pie */}
        <div className="glass-light rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Booking Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {statusData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a2236',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                {item.name}: {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 glass-light rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full gradient-mixed flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {booking.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{booking.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{booking.eventName}</p>
                </div>
                <span className="text-sm font-medium text-white">${booking.paidAmount}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  booking.status === 'approved' ? 'bg-mint-500/10 text-mint-400' :
                  booking.status === 'pending' ? 'bg-fire-500/10 text-fire-300' :
                  'bg-ember-500/10 text-ember-400'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
