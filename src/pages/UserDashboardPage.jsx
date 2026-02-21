import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, BookOpen, Ticket, Heart, User, Star, Award,
  Clock, CheckCircle, XCircle, AlertCircle, Download, ChevronRight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toggleFavoriteAsync, fetchBookings, fetchFavorites } from '../store/slices/bookingSlice';
import { updateProfileAsync } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Calendar },
  { id: 'bookings', label: 'My Bookings', icon: BookOpen },
  { id: 'tickets', label: 'Tickets', icon: Ticket },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
];

function StatusBadge({ status }) {
  const config = {
    approved: { label: 'Approved', icon: CheckCircle, cls: 'bg-mint-500/10 text-mint-400' },
    pending: { label: 'Pending', icon: Clock, cls: 'bg-fire-500/10 text-fire-300' },
    rejected: { label: 'Rejected', icon: XCircle, cls: 'bg-ember-500/10 text-ember-400' },
  };
  const c = config[status] || config.pending;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.cls}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { bookings, favorites } = useSelector(state => state.booking);
  const { events } = useSelector(state => state.events);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const userBookings = bookings.filter(b => b.email === user?.email);
  const approvedBookings = userBookings.filter(b => b.status === 'approved');
  const pendingBookings = userBookings.filter(b => b.status === 'pending');
  const favoriteEvents = events.filter(e => favorites.includes(e.id));

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileAsync(profile)).unwrap();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: userBookings.length, icon: BookOpen, color: 'ice' },
          { label: 'Approved', value: approvedBookings.length, icon: CheckCircle, color: 'mint' },
          { label: 'Pending', value: pendingBookings.length, icon: Clock, color: 'fire' },
          { label: 'Loyalty Points', value: approvedBookings.length * 50, icon: Star, color: 'fire' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-light rounded-2xl p-5">
              <Icon className={`w-5 h-5 mb-3 ${
                stat.color === 'ice' ? 'text-ice-400' : stat.color === 'mint' ? 'text-mint-400' : 'text-fire-400'
              }`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming bookings */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Bookings</h3>
        {approvedBookings.length === 0 ? (
          <div className="glass-light rounded-2xl p-8 text-center">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 mb-2">No upcoming bookings</p>
            <Link to="/events" className="text-sm text-ice-400 hover:underline">Browse events →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {approvedBookings.slice(0, 3).map(booking => {
              const event = events.find(e => e.id === booking.eventId);
              return (
                <div key={booking.id} className="glass-light rounded-xl p-4 flex items-center gap-4">
                  {event && (
                    <img src={event.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{booking.eventName}</p>
                    {event && (
                      <p className="text-xs text-slate-400">{format(parseISO(event.date), 'MMM d, yyyy')} · {event.startTime}</p>
                    )}
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Favorites */}
      {favoriteEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Saved Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favoriteEvents.slice(0, 4).map(event => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="glass-light rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-all group"
              >
                <img src={event.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-ice-300 transition-colors">
                    {event.name}
                  </p>
                  <p className="text-xs text-slate-400">{event.price === 0 ? 'Free' : `$${event.price}`}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Booking History</h3>
      {userBookings.length === 0 ? (
        <div className="glass-light rounded-2xl p-8 text-center">
          <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userBookings.map(booking => {
            const event = events.find(e => e.id === booking.eventId);
            return (
              <div key={booking.id} className="glass-light rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {event && (
                      <img src={event.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{booking.eventName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Booking: {booking.id}</p>
                      <p className="text-xs text-slate-500">Booked: {booking.bookingDate}</p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-sm font-medium text-white">${booking.paidAmount}</span>
                  {booking.ticketId && (
                    <span className="text-xs text-ice-400">Ticket: {booking.ticketId}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">My Tickets</h3>
      {approvedBookings.filter(b => b.ticketId).length === 0 ? (
        <div className="glass-light rounded-2xl p-8 text-center">
          <Ticket className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No tickets yet. Approved bookings will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {approvedBookings.filter(b => b.ticketId).map(booking => {
            const event = events.find(e => e.id === booking.eventId);
            return (
              <div key={booking.id} className="glass rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="gradient-ice p-4">
                  <p className="text-sm font-bold text-white">{booking.eventName}</p>
                  {event && (
                    <p className="text-xs text-white/70">{format(parseISO(event.date), 'EEE, MMM d, yyyy')} · {event.startTime}</p>
                  )}
                </div>
                {/* QR / Body */}
                <div className="p-5 space-y-4">
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Ticket className="w-8 h-8 text-dark-900 mx-auto mb-1" />
                      <p className="text-[9px] text-dark-700 font-mono">{booking.ticketId}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Ticket ID</p>
                    <p className="text-sm font-mono text-white">{booking.ticketId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center text-xs">
                    <div className="bg-white/5 rounded-lg py-2">
                      <p className="text-slate-500">Guest</p>
                      <p className="text-white font-medium mt-0.5">{booking.fullName}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg py-2">
                      <p className="text-slate-500">Paid</p>
                      <p className="text-white font-medium mt-0.5">${booking.paidAmount}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('Ticket PDF download simulated!')}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white glass-light hover:bg-white/10 flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF Ticket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Saved Events</h3>
      {favoriteEvents.length === 0 ? (
        <div className="glass-light rounded-2xl p-8 text-center">
          <Heart className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No saved events yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteEvents.map(event => (
            <div key={event.id} className="glass-light rounded-xl p-4 flex items-center gap-4">
              <img src={event.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{event.name}</p>
                <p className="text-xs text-slate-400 mt-1">{format(parseISO(event.date), 'MMM d, yyyy')}</p>
                <p className="text-xs text-slate-500">{event.price === 0 ? 'Free' : `$${event.price}`}</p>
                <div className="flex gap-2 mt-2">
                  <Link to={`/events/${event.id}`} className="text-xs text-ice-400 hover:underline">View</Link>
                  <button
                    onClick={() => dispatch(toggleFavoriteAsync(event.id))}
                    className="text-xs text-ember-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
      <form onSubmit={handleProfileSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
          <input
            type="text"
            value={profile.address}
            onChange={e => setProfile({ ...profile, address: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none transition-all text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all"
        >
          Save Changes
        </button>
      </form>

      {/* Loyalty */}
      <div className="mt-8 glass-light rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-fire-400" />
          <h4 className="text-base font-semibold text-white">Loyalty Points</h4>
        </div>
        <p className="text-3xl font-bold gradient-text-fire mb-1">{approvedBookings.length * 50}</p>
        <p className="text-xs text-slate-500">Earn 50 points per approved booking. Redeem for discounts!</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'bookings': return renderBookings();
      case 'tickets': return renderTickets();
      case 'favorites': return renderFavorites();
      case 'profile': return renderProfile();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="gradient-text-ice">{user?.name?.split(' ')[0] || 'Member'}</span>
          </h1>
          <p className="text-slate-400">Manage your bookings, tickets, and profile.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-ice-500/10 text-ice-300 border border-ice-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
