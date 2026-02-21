import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Search, Filter, CheckCircle, XCircle, Clock, Eye, Download,
  Image as ImageIcon, MessageSquare, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { updateBookingStatusAsync, fetchAllBookings } from '../../store/slices/bookingSlice';
import { bookingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector(state => state.booking);
  const { events } = useSelector(state => state.events);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingBooking, setViewingBooking] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.fullName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.eventName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = async (booking) => {
    try {
      const result = await dispatch(updateBookingStatusAsync({
        bookingId: booking.id,
        body: {
          status: 'approved',
          adminNotes: adminNote || 'Payment verified.',
        },
      })).unwrap();
      toast.success(`Booking approved! Ticket: ${result.ticketId || 'N/A'}`);
      setViewingBooking(null);
      setAdminNote('');
      dispatch(fetchAllBookings());
    } catch (err) {
      toast.error(err || 'Approval failed');
    }
  };

  const handleReject = async (booking) => {
    try {
      await dispatch(updateBookingStatusAsync({
        bookingId: booking.id,
        body: {
          status: 'rejected',
          adminNotes: rejectReason || 'Payment could not be verified.',
        },
      })).unwrap();
      toast.error(`Booking ${booking.id} rejected.`);
      setViewingBooking(null);
      setRejectReason('');
      dispatch(fetchAllBookings());
    } catch (err) {
      toast.error(err || 'Rejection failed');
    }
  };

  const exportCSV = async () => {
    try {
      const res = await bookingsAPI.exportCSV();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported!');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  // Booking detail modal
  if (viewingBooking) {
    const b = viewingBooking;
    const event = events.find(e => e.id === b.eventId);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Booking Details</h1>
          <button onClick={() => setViewingBooking(null)} className="text-sm text-slate-400 hover:text-white">
            ← Back to list
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info */}
          <div className="space-y-4">
            <div className="glass-light rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Guest Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name</span><p className="text-white mt-0.5">{b.fullName}</p></div>
                <div><span className="text-slate-500">Email</span><p className="text-white mt-0.5">{b.email}</p></div>
                <div><span className="text-slate-500">Phone</span><p className="text-white mt-0.5">{b.phone}</p></div>
                <div><span className="text-slate-500">Address</span><p className="text-white mt-0.5">{b.address}</p></div>
              </div>
            </div>

            <div className="glass-light rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Booking Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Booking ID</span><p className="text-white font-mono mt-0.5">{b.id}</p></div>
                <div><span className="text-slate-500">Event</span><p className="text-white mt-0.5">{b.eventName}</p></div>
                <div><span className="text-slate-500">Amount Paid</span><p className="text-white font-semibold mt-0.5">${b.paidAmount}</p></div>
                <div><span className="text-slate-500">Transaction ID</span><p className="text-white font-mono mt-0.5">{b.transactionId || 'N/A'}</p></div>
                <div><span className="text-slate-500">Booking Date</span><p className="text-white mt-0.5">{b.bookingDate}</p></div>
                <div>
                  <span className="text-slate-500">Status</span>
                  <p className={`mt-0.5 font-medium ${
                    b.status === 'approved' ? 'text-mint-400' : b.status === 'pending' ? 'text-fire-300' : 'text-ember-400'
                  }`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </p>
                </div>
              </div>
              {b.ticketId && (
                <div className="pt-3 border-t border-white/5">
                  <span className="text-slate-500 text-sm">Ticket ID</span>
                  <p className="text-ice-400 font-mono mt-0.5">{b.ticketId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment screenshot & actions */}
          <div className="space-y-4">
            <div className="glass-light rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Payment Screenshot</h3>
              <div className="w-full h-64 rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">{b.paymentScreenshot || 'No screenshot uploaded'}</p>
                </div>
              </div>
            </div>

            {b.status === 'pending' && (
              <div className="glass-light rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Admin Actions</h3>

                {/* Approve */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Admin Note (on approval)</label>
                  <input
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-ice-500/50"
                    placeholder="e.g., Payment verified"
                  />
                  <button
                    onClick={() => handleApprove(b)}
                    className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-mint-500 hover:bg-mint-400 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve Booking
                  </button>
                </div>

                {/* Reject */}
                <div className="pt-3 border-t border-white/5">
                  <label className="text-xs text-slate-400 mb-1.5 block">Rejection Reason</label>
                  <input
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-ember-500/50"
                    placeholder="e.g., Amount mismatch"
                  />
                  <button
                    onClick={() => handleReject(b)}
                    className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-ember-500 hover:bg-ember-400 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Reject Booking
                  </button>
                </div>
              </div>
            )}

            {b.adminNotes && (
              <div className="glass-light rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-ice-400" /> Admin Notes
                </h3>
                <p className="text-sm text-slate-400">{b.adminNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-slate-400 mt-1">{bookings.length} total · {bookings.filter(b => b.status === 'pending').length} pending</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 glass-light hover:text-white hover:bg-white/10 transition-all"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, event, ID..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-ice-500/10 text-ice-300 border border-ice-500/20'
                  : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-light rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Event</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-mixed flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {booking.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{booking.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{booking.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-slate-300 truncate max-w-[200px]">{booking.eventName}</p>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-medium text-white">${booking.paidAmount}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${
                      booking.status === 'approved' ? 'bg-mint-500/10 text-mint-400' :
                      booking.status === 'pending' ? 'bg-fire-500/10 text-fire-300' :
                      'bg-ember-500/10 text-ember-400'
                    }`}>
                      {booking.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                      {booking.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center hidden sm:table-cell">
                    <span className="text-xs text-slate-500">{booking.bookingDate}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setViewingBooking(booking)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-ice-400 hover:bg-ice-500/10 transition-all"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No bookings found</div>
        )}
      </div>
    </div>
  );
}
