import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Upload, CheckCircle, QrCode, AlertCircle,
  User, Mail, Phone, MapPin, DollarSign, FileText, Image
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { createBooking, addToWaitlistAsync } from '../store/slices/bookingSlice';
import { fetchAdminSettings } from '../store/slices/adminSlice';
import { fetchEvent } from '../store/slices/eventsSlice';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const isWaitlist = searchParams.get('waitlist') === 'true';

  const { events } = useSelector(state => state.events);
  const { qrCodeUrl, paymentInstructions } = useSelector(state => state.admin);
  const event = events.find(e => e.id === id);

  useEffect(() => {
    dispatch(fetchAdminSettings());
    if (!event) dispatch(fetchEvent(id));
  }, [dispatch, id, event]);

  const [step, setStep] = useState(1); // 1: form, 2: payment, 3: confirmation
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    paidAmount: event?.price || 0,
    transactionId: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [errors, setErrors] = useState({});

  if (!event) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-xl text-slate-500">Event not found.</p>
        <Link to="/events" className="text-ice-400 hover:underline mt-4 block">Back to Events</Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isWaitlist) {
      try {
        await dispatch(addToWaitlistAsync({
          eventId: event.id,
          eventName: event.name,
          ...form,
        })).unwrap();
        setStep(3);
        toast.success('Added to waitlist!');
      } catch (err) {
        toast.error(err || 'Failed to join waitlist');
      }
      return;
    }

    if (event.price === 0) {
      try {
        const formData = new FormData();
        formData.append('eventId', event.id);
        formData.append('eventName', event.name);
        formData.append('fullName', form.fullName);
        formData.append('email', form.email);
        formData.append('phone', form.phone);
        formData.append('address', form.address);
        formData.append('paidAmount', '0');
        await dispatch(createBooking(formData)).unwrap();
        setStep(3);
        toast.success('Booking submitted!');
      } catch (err) {
        toast.error(err || 'Booking failed');
      }
      return;
    }

    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      toast.error('Please upload payment screenshot');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('eventId', event.id);
      formData.append('eventName', event.name);
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('paidAmount', form.paidAmount);
      formData.append('transactionId', form.transactionId);
      formData.append('paymentScreenshot', screenshot);
      await dispatch(createBooking(formData)).unwrap();
      setStep(3);
      toast.success('Booking submitted successfully!');
    } catch (err) {
      toast.error(err || 'Booking failed');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF files allowed');
      return;
    }
    setScreenshot(file);
    setScreenshotName(file.name);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${
      errors[field] ? 'border-ember-500/50' : 'border-white/10'
    } text-white placeholder-slate-500 focus:border-ice-500/50 focus:ring-1 focus:ring-ice-500/20 focus:outline-none transition-all text-sm`;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="py-4">
          <button
            onClick={() => step > 1 && !isWaitlist ? setStep(step - 1) : navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 ? 'Back' : 'Back to Event'}
          </button>
        </div>

        {/* Progress */}
        {!isWaitlist && (
          <div className="flex items-center gap-2 mb-8">
            {[
              { n: 1, label: 'Details' },
              ...(event.price > 0 ? [{ n: 2, label: 'Payment' }] : []),
              { n: event.price > 0 ? 3 : 2, label: 'Confirmed' },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  step >= s.n ? 'gradient-ice text-white' : 'bg-white/5 text-slate-500'
                }`}>
                  {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.n ? 'text-white' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {i < arr.length - 1 && (
                  <div className={`flex-1 h-px ${step > s.n ? 'bg-ice-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Event summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 flex gap-4 items-center mb-8"
        >
          <img src={event.images[0]} alt={event.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white truncate">{event.name}</h3>
            <p className="text-sm text-slate-400">{format(parseISO(event.date), 'EEE, MMM d')} · {event.startTime}</p>
            <p className="text-sm text-slate-500 truncate">{event.location}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-white">
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </span>
          </div>
        </motion.div>

        {/* STEP 1: Guest Form */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {isWaitlist ? 'Join Waitlist' : 'Your Details'}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {isWaitlist
                ? 'We\'ll notify you if a spot opens up.'
                : 'No account needed. Fill in your details to book.'}
            </p>

            <form onSubmit={handleStep1Submit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    className={inputClass('fullName')}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-ember-400 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className={inputClass('phone')}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <p className="text-xs text-ember-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputClass('email')}
                  placeholder="you@email.com"
                />
                {errors.email && <p className="text-xs text-ember-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className={inputClass('address')}
                  placeholder="Your full address"
                />
                {errors.address && <p className="text-xs text-ember-400 mt-1">{errors.address}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all duration-300"
              >
                {isWaitlist ? 'Join Waitlist' : event.price === 0 ? 'Confirm Booking' : 'Continue to Payment'}
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 2: Payment */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Payment</h2>
            <p className="text-sm text-slate-400 mb-6">Scan QR, pay exact amount, upload screenshot.</p>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* QR Section */}
              <div className="glass rounded-2xl p-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <QrCode className="w-5 h-5 text-ice-400" />
                  <span className="text-sm font-semibold text-white">Scan to Pay</span>
                </div>

                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Payment QR" className="w-48 h-48 mx-auto rounded-xl bg-white p-2" />
                ) : (
                  <div className="w-48 h-48 mx-auto rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">QR code not set</p>
                      <p className="text-xs text-slate-600">Contact admin</p>
                    </div>
                  </div>
                )}

                <div className="glass-light rounded-xl p-4">
                  <p className="text-2xl font-bold text-white mb-1">${event.price}.00</p>
                  <p className="text-xs text-slate-400">{paymentInstructions}</p>
                </div>
              </div>

              {/* Payment fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Amount Paid
                  </label>
                  <input
                    type="number"
                    value={form.paidAmount}
                    onChange={e => setForm({ ...form, paidAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:ring-1 focus:ring-ice-500/20 focus:outline-none transition-all text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> Transaction ID
                    <span className="text-xs text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.transactionId}
                    onChange={e => setForm({ ...form, transactionId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:ring-1 focus:ring-ice-500/20 focus:outline-none transition-all text-sm"
                    placeholder="TXN-XXXX-XXXX"
                  />
                </div>
              </div>

              {/* Screenshot upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Image className="w-3.5 h-3.5 text-slate-500" /> Payment Screenshot
                </label>
                <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-ice-500/30 hover:bg-white/[0.04] transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {screenshot ? (
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-mint-400 mx-auto mb-2" />
                      <p className="text-sm text-white font-medium">{screenshotName}</p>
                      <p className="text-xs text-slate-500 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Click to upload screenshot</p>
                      <p className="text-xs text-slate-600 mt-1">JPG, PNG, or PDF · Max 5MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-fire-500/5 border border-fire-500/10">
                <AlertCircle className="w-4 h-4 text-fire-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your booking will be in <strong className="text-fire-300">Pending Verification</strong> status until an admin reviews your payment.
                  You'll receive an email confirmation once approved. Seats are held only after approval.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all duration-300"
              >
                Submit Booking
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 3: Confirmation */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-mint-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-mint-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {isWaitlist ? 'You\'re on the Waitlist!' : 'Booking Submitted!'}
            </h2>
            <p className="text-slate-400 mb-2 max-w-md mx-auto">
              {isWaitlist
                ? `We'll email you at ${form.email} if a spot opens up for ${event.name}.`
                : `A confirmation has been sent to ${form.email}. Your booking is pending verification.`}
            </p>
            {!isWaitlist && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire-500/10 text-fire-300 text-sm font-medium mt-4 mb-8">
                <AlertCircle className="w-4 h-4" />
                Status: Pending Verification
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link
                to="/events"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all"
              >
                Browse More Events
              </Link>
              <Link
                to="/"
                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white glass-light transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
