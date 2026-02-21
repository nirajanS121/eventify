import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Snowflake, Flame, Play } from 'lucide-react';
import { contentAPI } from '../../services/api';

export default function Hero() {
  const [stats, setStats] = useState([
    { value: '—', label: 'Community Members' },
    { value: '—', label: 'Events Hosted' },
    { value: '—', label: 'Event Categories' },
    { value: '—', label: 'Average Rating' },
  ]);

  useEffect(() => {
    contentAPI.getStats().then((data) => {
      setStats([
        { value: `${data.communityMembers.toLocaleString()}+`, label: 'Community Members' },
        { value: `${data.eventsHosted}+`, label: 'Events Hosted' },
        { value: String(data.categories), label: 'Event Categories' },
        { value: data.avgRating, label: 'Average Rating' },
      ]);
    }).catch(() => {});
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dark-950" />
      <div className="absolute inset-0 hero-gradient" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-ice-500/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-fire-500/4 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ice-500/3 rounded-full blur-[100px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-ice-300">
              <Snowflake className="w-3.5 h-3.5" />
              Ice
            </span>
            <span className="text-slate-600">×</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-fire-300">
              <Flame className="w-3.5 h-3.5" />
              Fire
            </span>
            <span className="text-slate-600">—</span>
            <span className="text-xs text-slate-400">Portland's Premier Wellness Community</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6"
          >
            <span className="text-white">Where </span>
            <span className="gradient-text-ice">Cold</span>
            <br />
            <span className="text-white">Meets </span>
            <span className="gradient-text-fire">Courage</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Ice baths. Boxing. Yoga. Run club. Breathwork.
            <br className="hidden sm:block" />
            One community. Unlimited transformation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/events"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white gradient-ice shadow-lg shadow-ice-500/20 hover:shadow-xl hover:shadow-ice-500/30 transition-all duration-300"
            >
              Explore Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-2xl gradient-ice opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            </Link>
            <a
              href="#about"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 glass-light hover:text-white hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <Play className="w-3.5 h-3.5 ml-0.5" />
              </div>
              Our Story
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text-mixed">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
    </section>
  );
}
