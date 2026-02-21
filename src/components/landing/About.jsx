import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Snowflake, Flame, Heart, Users, Zap, Shield } from 'lucide-react';

const values = [
  {
    icon: Snowflake,
    title: 'Cold Exposure',
    description: 'Science-backed cold therapy to boost immunity, reduce inflammation, and build unshakeable mental resilience.',
    color: 'ice',
  },
  {
    icon: Flame,
    title: 'Physical Intensity',
    description: 'From boxing to HIIT, we push boundaries in a supportive environment where sweat equals growth.',
    color: 'fire',
  },
  {
    icon: Heart,
    title: 'Mindful Recovery',
    description: 'Breathwork, yoga, and mobility sessions that restore your body and quiet your mind.',
    color: 'ice',
  },
  {
    icon: Users,
    title: 'Real Community',
    description: 'Not just a gym. A tribe. People who show up for each other, on and off the mat.',
    color: 'fire',
  },
  {
    icon: Zap,
    title: 'Peak Performance',
    description: 'Expert-led sessions designed to optimize your physical and mental performance daily.',
    color: 'ice',
  },
  {
    icon: Shield,
    title: 'Safe Space',
    description: 'Inclusive, judgment-free environment. Challenge yourself at your pace, your way.',
    color: 'fire',
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Accent glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-ice-500/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-fire-500/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-ice-400 mb-4"
          >
            Who We Are
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            Forged in <span className="gradient-text-ice">ice</span>,
            built by <span className="gradient-text-fire">fire</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed"
          >
            We created Forge & Flow because we believe wellness shouldn't be boring, 
            exclusive, or complicated. It should be raw, honest, challenging, and deeply human.
            Every event we host is designed to push your edges while honoring your journey.
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="group relative p-6 rounded-2xl glass-light hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  item.color === 'ice' ? 'bg-ice-500/10' : 'bg-fire-500/10'
                }`}>
                  <Icon className={`w-5 h-5 ${item.color === 'ice' ? 'text-ice-400' : 'text-fire-400'}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Big quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-light text-slate-300 italic max-w-3xl mx-auto leading-relaxed">
            "The cold doesn't build character —{' '}
            <span className="text-white font-normal not-italic">it reveals it.</span>"
          </blockquote>
          <p className="mt-4 text-sm text-slate-500">— The Forge & Flow Manifesto</p>
        </motion.div>
      </div>
    </section>
  );
}
