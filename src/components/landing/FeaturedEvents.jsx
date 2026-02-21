import { useSelector } from 'react-redux';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import EventCard from '../events/EventCard';

export default function FeaturedEvents() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { events } = useSelector(state => state.events);

  const featured = events.filter(e => e.featured && e.status === 'active').slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-dark-950/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ice-500/3 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-fire-400" />
            <span className="text-xs font-medium text-fire-300">Curated Picks</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            Featured Experiences
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
