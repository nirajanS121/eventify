import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Heart } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteAsync } from '../../store/slices/bookingSlice';
import { EVENT_TYPES } from '../../constants/eventTypes';

export default function EventCard({ event, index = 0, featured = false }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.booking);
  const { isAuthenticated } = useSelector(state => state.auth);
  const isFav = favorites.includes(event.id);
  const isFull = event.booked >= event.capacity;
  const spotsLeft = event.capacity - event.booked;
  const eventType = EVENT_TYPES[event.type] || { label: event.type, icon: '📌', color: 'ice' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative rounded-2xl overflow-hidden glass-light hover:bg-white/[0.05] transition-all duration-500 ${
        featured ? 'lg:col-span-2 lg:grid lg:grid-cols-2' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'lg:h-full h-56' : 'h-52'}`}>
        <img
          src={event.images[0]}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${
            eventType.color === 'ice'
              ? 'bg-ice-500/20 text-ice-200'
              : 'bg-fire-500/20 text-fire-200'
          }`}>
            <span>{eventType.icon}</span>
            {eventType.label}
          </span>
          {isAuthenticated && (
            <button
              onClick={(e) => { e.preventDefault(); dispatch(toggleFavoriteAsync(event.id)); }}
              className={`p-2 rounded-lg backdrop-blur-md transition-all ${
                isFav
                  ? 'bg-ember-500/20 text-ember-400'
                  : 'bg-black/30 text-white/60 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Status badges */}
        {isFull && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-ember-500/90 text-white backdrop-blur-md">
              SOLD OUT
            </span>
          </div>
        )}
        {event.featured && !featured && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider gradient-fire text-white">
              Featured
            </span>
          </div>
        )}

        {/* Price tag */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-lg text-sm font-bold text-white backdrop-blur-md bg-black/40">
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ice-300 transition-colors line-clamp-2">
          {event.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-ice-400 shrink-0" />
            <span>{format(parseISO(event.date), 'EEE, MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-3.5 h-3.5 text-ice-400 shrink-0" />
            <span>{event.startTime} — {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-fire-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            {isFull ? (
              <span className="text-ember-400 font-medium">Fully Booked</span>
            ) : (
              <span className="text-slate-400">
                <span className="text-mint-400 font-medium">{spotsLeft}</span> spots left
              </span>
            )}
          </div>
        </div>

        {featured && (
          <p className="text-sm text-slate-400 line-clamp-3 mb-4 hidden lg:block">
            {event.description}
          </p>
        )}

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isFull ? 'bg-ember-500' : spotsLeft <= 5 ? 'bg-fire-400' : 'bg-ice-500'
              }`}
              style={{ width: `${Math.min((event.booked / event.capacity) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className={`inline-flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            isFull
              ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              : 'gradient-ice text-white hover:shadow-lg hover:shadow-ice-500/20'
          }`}
        >
          {isFull ? 'Join Waitlist' : 'View Details'}
        </Link>
      </div>
    </motion.div>
  );
}
