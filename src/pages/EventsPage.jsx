import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import { EVENT_TYPES } from '../constants/eventTypes';
import { fetchEvents } from '../store/slices/eventsSlice';

export default function EventsPage() {
  const dispatch = useDispatch();
  const { events, loading } = useSelector(state => state.events);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (e.status !== 'active') return false;
      if (selectedType !== 'all' && e.type !== selectedType) return false;
      if (selectedDifficulty !== 'all' && e.difficulty !== selectedDifficulty) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.instructor.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedType, selectedDifficulty, search]);

  const typeOptions = [
    { value: 'all', label: 'All Categories', icon: '✨' },
    ...Object.entries(EVENT_TYPES).map(([key, val]) => ({
      value: key, label: val.label, icon: val.icon,
    })),
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            All Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Find your next experience. Book with or without an account.
          </motion.p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, instructors, locations..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:ring-1 focus:ring-ice-500/20 focus:outline-none transition-all text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                showFilters
                  ? 'bg-ice-500/10 border-ice-500/30 text-ice-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 glass rounded-2xl p-5"
            >
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedType(opt.value);
                        if (opt.value === 'all') {
                          searchParams.delete('type');
                        } else {
                          searchParams.set('type', opt.value);
                        }
                        setSearchParams(searchParams);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedType === opt.value
                          ? 'bg-ice-500/20 text-ice-300 border border-ice-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedDifficulty === level
                          ? 'bg-fire-500/20 text-fire-300 border border-fire-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {level === 'all' ? 'All Levels' : level}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-slate-500 mb-2">No events found</p>
            <p className="text-sm text-slate-600">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
