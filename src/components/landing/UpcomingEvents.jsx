import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import EventCard from '../events/EventCard';

export default function UpcomingEvents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { events } = useSelector(state => state.events);

  const upcoming = [...events]
    .filter(e => e.status === 'active' && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  return (
    <section className="relative py-24 sm:py-32" ref={ref}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-fire-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-fire-400 mb-3"
            >
              Don't Miss Out
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            >
              Upcoming Events
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/events"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ice-400 hover:text-ice-300 transition-colors"
            >
              View all events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcoming.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        {upcoming.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No upcoming events right now. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
