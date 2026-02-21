import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { QrCode, Upload, DollarSign, Image as ImageIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchAdminSettings, updateAdminSettings } from '../../store/slices/adminSlice';
import { fetchAllBookings } from '../../store/slices/bookingSlice';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const dispatch = useDispatch();
  const { qrCodeUrl, paymentInstructions } = useSelector(state => state.admin);
  const { bookings } = useSelector(state => state.booking);
  const [instructions, setInstructions] = useState(paymentInstructions);
  const [qrPreview, setQrPreview] = useState(qrCodeUrl);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdminSettings());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  useEffect(() => {
    setInstructions(paymentInstructions);
    setQrPreview(qrCodeUrl);
  }, [paymentInstructions, qrCodeUrl]);

  const approved = bookings.filter(b => b.status === 'approved');
  const totalVerified = approved.reduce((sum, b) => sum + Number(b.paidAmount || 0), 0);
  const totalPending = bookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + Number(b.paidAmount || 0), 0);

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setQrPreview(reader.result);
      dispatch(updateAdminSettings({ qrCodeUrl: reader.result }));
      toast.success('QR code updated!');
    };
    reader.readAsDataURL(file);
  };

  const saveInstructions = () => {
    dispatch(updateAdminSettings({ paymentInstructions: instructions }));
    toast.success('Payment instructions saved!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-sm text-slate-400 mt-1">Manage QR codes, verify payments, track revenue</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-light rounded-2xl p-5">
          <DollarSign className="w-5 h-5 text-mint-400 mb-3" />
          <p className="text-2xl font-bold text-white">${totalVerified.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Verified Revenue</p>
        </div>
        <div className="glass-light rounded-2xl p-5">
          <AlertCircle className="w-5 h-5 text-fire-400 mb-3" />
          <p className="text-2xl font-bold text-white">${totalPending.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Pending Verification</p>
        </div>
        <div className="glass-light rounded-2xl p-5">
          <CheckCircle className="w-5 h-5 text-ice-400 mb-3" />
          <p className="text-2xl font-bold text-white">{approved.length}</p>
          <p className="text-xs text-slate-500 mt-1">Verified Payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Management */}
        <div className="glass-light rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-ice-400" />
            <h3 className="text-lg font-semibold text-white">Payment QR Code</h3>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 rounded-xl bg-white/[0.03] border-2 border-dashed border-white/10 hover:border-ice-500/30 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-center"
          >
            {qrPreview ? (
              <div className="text-center">
                <img src={qrPreview} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg bg-white p-2 object-contain" />
                <p className="text-xs text-slate-500 mt-2">Click to replace</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Upload QR Code Image</p>
                <p className="text-xs text-slate-600 mt-1">JPG, PNG — Click to upload</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
            className="hidden"
          />
        </div>

        {/* Payment Instructions */}
        <div className="glass-light rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-white">Payment Instructions</h3>
          <p className="text-xs text-slate-500">Displayed to users on the booking page</p>
          <textarea
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:outline-none text-sm resize-none"
            placeholder="Enter payment instructions..."
          />
          <button
            onClick={saveInstructions}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Instructions
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-light rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase">Guest</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Event</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">TXN ID</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{b.fullName}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[200px] hidden md:table-cell">{b.eventName}</td>
                  <td className="px-4 py-3 text-center text-white font-medium">${b.paidAmount}</td>
                  <td className="px-4 py-3 text-center text-slate-400 font-mono text-xs hidden sm:table-cell">{b.transactionId || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      b.status === 'approved' ? 'bg-mint-500/10 text-mint-400' :
                      b.status === 'pending' ? 'bg-fire-500/10 text-fire-300' :
                      'bg-ember-500/10 text-ember-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
