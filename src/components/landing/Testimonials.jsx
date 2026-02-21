import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { contentAPI } from '../../services/api';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    contentAPI.getTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  const next = () => setActive((prev) => (prev + 1) % (testimonials.length || 1));
  const prev = () => setActive((prev) => (prev - 1 + (testimonials.length || 1)) % (testimonials.length || 1));

  if (testimonials.length === 0) return null;

  const t = testimonials[active];
  if (!t) return null;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ice-500/3 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-ice-400 mb-3"
          >
            Community Voices
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            What People Say
          </motion.h2>
        </div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative glass rounded-3xl p-8 sm:p-12">
            <Quote className="absolute top-6 left-6 w-10 h-10 text-ice-500/10" />

            <div className="relative">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-fire-400 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed mb-8 min-h-[100px]">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-mixed flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-slate-400">{t.role}</p>
                  </div>
                </div>
                <span className="hidden sm:block text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg">
                  {t.event}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-2.5 rounded-xl glass-light text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'w-8 bg-ice-400' : 'w-2 bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2.5 rounded-xl glass-light text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
