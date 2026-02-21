import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { contentAPI } from '../../services/api';

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [lightbox, setLightbox] = useState(null);
  const [scrollPos, setScrollPos] = useState(0);
  const scrollRef = useRef(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    contentAPI.getGallery().then(setGalleryImages).catch(() => {});
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 320;
    const newPos = scrollPos + (dir === 'left' ? -amount : amount);
    scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' });
    setScrollPos(newPos);
  };

  return (
    <section id="gallery" className="relative py-24 sm:py-32 overflow-hidden" ref={ref}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-ice-400 mb-3"
            >
              The Vibe
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            >
              Gallery
            </motion.h2>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl glass-light text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl glass-light text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable gallery */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={(e) => setScrollPos(e.target.scrollLeft)}
      >
        {galleryImages.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            onClick={() => setLightbox(img)}
            className="shrink-0 w-72 h-48 sm:w-80 sm:h-56 rounded-2xl overflow-hidden cursor-pointer group relative"
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/30 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightbox.url.replace('w=600', 'w=1200')}
            alt={lightbox.alt}
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
