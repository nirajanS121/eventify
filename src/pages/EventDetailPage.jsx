import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, User, Award, AlertTriangle,
  Package, ChevronLeft, ChevronRight, ArrowLeft, Share2, Heart, Timer
} from 'lucide-react';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { EVENT_TYPES } from '../constants/eventTypes';
import { fetchEvent } from '../store/slices/eventsSlice';

function CountdownTimer({ targetDate, targetTime }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const target = new Date(`${targetDate}T${targetTime}:00`);
    const timer = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(target, now);
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3">
      {blocks.map(b => (
        <div key={b.label} className="text-center">
          <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-2xl font-bold gradient-text-mixed">
              {String(b.value || 0).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, loading } = useSelector(state => state.events);
  const event = events.find(e => e.id === id);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!event) {
      dispatch(fetchEvent(id));
    }
  }, [id, event, dispatch]);

  if (!event && loading) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-xl text-slate-400">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-xl text-slate-500">Event not found.</p>
        <Link to="/events" className="text-ice-400 hover:underline mt-4 block">Back to Events</Link>
      </div>
    );
  }

  const eventType = EVENT_TYPES[event.type] || { label: event.type, icon: '📌', color: 'ice' };
  const isFull = event.booked >= event.capacity;
  const spotsLeft = event.capacity - event.booked;
  const capacityPerc = Math.min((event.booked / event.capacity) * 100, 100);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="aspect-[16/9] relative">
                <img
                  src={event.images[currentImage]}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />

                {/* Image nav */}
                {event.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(i => (i - 1 + event.images.length) % event.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(i => (i + 1) % event.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md ${
                    eventType.color === 'ice' ? 'bg-ice-500/20 text-ice-200' : 'bg-fire-500/20 text-fire-200'
                  }`}>
                    {eventType.icon} {eventType.label}
                  </span>
                  {event.difficulty && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white backdrop-blur-md">
                      {event.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {event.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-dark-800">
                  {event.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-20 h-14 rounded-lg overflow-hidden transition-all ${
                        i === currentImage ? 'ring-2 ring-ice-400 opacity-100' : 'opacity-50 hover:opacity-75'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{event.name}</h1>
                <p className="text-slate-400 leading-relaxed">{event.description}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Calendar, label: 'Date', value: format(parseISO(event.date), 'EEE, MMM d, yyyy'), color: 'ice' },
                  { icon: Clock, label: 'Time', value: `${event.startTime} — ${event.endTime}`, color: 'ice' },
                  { icon: MapPin, label: 'Location', value: event.location, color: 'fire' },
                  { icon: User, label: 'Instructor', value: event.instructor, color: 'fire' },
                  { icon: Award, label: 'Difficulty', value: event.difficulty, color: 'ice' },
                  { icon: Users, label: 'Capacity', value: `${event.booked}/${event.capacity}`, color: isFull ? 'ember' : 'mint' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="glass-light rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${
                          item.color === 'ice' ? 'text-ice-400' : item.color === 'fire' ? 'text-fire-400' : item.color === 'ember' ? 'text-ember-400' : 'text-mint-400'
                        }`} />
                        <span className="text-[10px] uppercase tracking-wider text-slate-500">{item.label}</span>
                      </div>
                      <p className="text-sm font-medium text-white truncate">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Venue */}
              <div className="glass-light rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-1">Venue</h3>
                <p className="text-sm text-slate-400">{event.venue}</p>
              </div>

              {/* Required Equipment */}
              {event.equipment?.length > 0 && (
                <div className="glass-light rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-ice-400" />
                    <h3 className="text-sm font-semibold text-white">What to Bring</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.equipment.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-slate-300 border border-white/5">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Notes */}
              {event.safetyNotes && (
                <div className="glass-light rounded-xl p-5 border-l-2 border-fire-500/50">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-fire-400" />
                    <h3 className="text-sm font-semibold text-white">Safety Notes</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{event.safetyNotes}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column — Booking sidebar */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-5"
            >
              {/* Price card */}
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-white">
                      {event.price === 0 ? 'FREE' : `$${event.price}`}
                    </span>
                    <span className="text-sm text-slate-500 ml-2">per person</span>
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Capacity */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">
                      {isFull ? (
                        <span className="text-ember-400 font-medium">Fully Booked</span>
                      ) : (
                        <><span className="text-mint-400 font-semibold">{spotsLeft}</span> spots remaining</>
                      )}
                    </span>
                    <span className="text-slate-500">{event.booked}/{event.capacity}</span>
                  </div>
                  <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isFull ? 'bg-ember-500' : spotsLeft <= 5 ? 'bg-fire-400' : 'bg-ice-500'
                      }`}
                      style={{ width: `${capacityPerc}%` }}
                    />
                  </div>
                </div>

                {/* Countdown */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-4 h-4 text-fire-400" />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Starts In</span>
                  </div>
                  <CountdownTimer targetDate={event.date} targetTime={event.startTime} />
                </div>

                {/* Booking CTA */}
                {isFull ? (
                  <Link
                    to={`/booking/${event.id}?waitlist=true`}
                    className="block w-full text-center py-3.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                  >
                    Join Waitlist
                  </Link>
                ) : (
                  <Link
                    to={`/booking/${event.id}`}
                    className="block w-full text-center py-3.5 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all duration-300"
                  >
                    Book Now
                  </Link>
                )}

                <p className="text-[11px] text-slate-600 text-center">
                  No account required. Booking deadline: {format(parseISO(event.bookingDeadline), 'MMM d, yyyy')}
                </p>
              </div>

              {/* Instructor card */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-mixed flex items-center justify-center text-sm font-bold text-white">
                    {event.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{event.instructor}</p>
                    <p className="text-xs text-slate-500">Event Host</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
