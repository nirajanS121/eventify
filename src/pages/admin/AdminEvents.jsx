import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Copy, Star, Search, Filter,
  Calendar, MapPin, Users, Eye, MoreVertical
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fetchEvents, createEvent, updateEventAsync, deleteEventAsync } from '../../store/slices/eventsSlice';
import { EVENT_TYPES, DIFFICULTY_LEVELS } from '../../constants/eventTypes';
import ImageUploader from '../../components/ui/ImageUploader';
import toast from 'react-hot-toast';

const emptyEvent = {
  name: '', type: 'ICE_BATH', location: '', venue: '', date: '', startTime: '', endTime: '',
  price: 0, capacity: 20, booked: 0, bookingDeadline: '', description: '',
  images: [],
  instructor: '', difficulty: 'All Levels', equipment: [], safetyNotes: '',
  status: 'active', featured: false,
};

export default function AdminEvents() {
  const dispatch = useDispatch();
  const { events } = useSelector(state => state.events);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [equipmentInput, setEquipmentInput] = useState('');

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filtered = events.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase()) ||
    e.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingEvent(null);
    setForm(emptyEvent);
    setEquipmentInput('');
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setForm({ ...event });
    setEquipmentInput(event.equipment?.join(', ') || '');
    setShowForm(true);
  };

  const handleDuplicate = async (event) => {
    const duplicated = {
      ...event,
      name: `${event.name} (Copy)`,
      booked: 0,
    };
    delete duplicated.id;
    delete duplicated._id;
    try {
      await dispatch(createEvent(duplicated)).unwrap();
      toast.success('Event duplicated!');
    } catch (err) {
      toast.error(err || 'Duplication failed');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      try {
        await dispatch(deleteEventAsync(id)).unwrap();
        toast.success('Event deleted');
      } catch (err) {
        toast.error(err || 'Delete failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      ...form,
      equipment: equipmentInput.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      if (editingEvent) {
        await dispatch(updateEventAsync({ id: editingEvent.id, body: eventData })).unwrap();
        toast.success('Event updated!');
      } else {
        delete eventData.id;
        delete eventData._id;
        await dispatch(createEvent(eventData)).unwrap();
        toast.success('Event created!');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err || 'Operation failed');
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:outline-none transition-all text-sm";

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </h1>
          <button onClick={() => setShowForm(false)} className="text-sm text-slate-400 hover:text-white">
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Event Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Event name" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Event Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls}>
                  {Object.entries(EVENT_TYPES).map(([key, val]) => (
                    <option key={key} value={key}>{val.icon} {val.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className={inputCls}>
                  {DIFFICULTY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Location" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Venue</label>
              <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} className={inputCls} placeholder="Venue details" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Start</label>
                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">End</label>
                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className={inputCls} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Price ($)</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} min="0" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} className={inputCls} min="1" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Deadline</label>
                <input type="date" value={form.bookingDeadline} onChange={e => setForm({ ...form, bookingDeadline: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} rows={5} placeholder="Event description..." required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Instructor</label>
              <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} className={inputCls} placeholder="Instructor name" required />
            </div>
            <ImageUploader
              images={form.images || []}
              onChange={(urls) => setForm({ ...form, images: urls })}
              maxImages={5}
            />
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Equipment — comma separated</label>
              <input value={equipmentInput} onChange={e => setEquipmentInput(e.target.value)} className={inputCls} placeholder="Towel, Water bottle, ..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Safety Notes</label>
              <textarea value={form.safetyNotes} onChange={e => setForm({ ...form, safetyNotes: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Safety information..." />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls} style={{ width: 'auto' }}>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-white/20 bg-white/5 text-ice-500 focus:ring-ice-500/30" />
                <span className="text-sm text-slate-300">Featured</span>
              </label>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all">
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-sm text-slate-400 mt-1">{events.length} total events</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-ice-500/50 focus:outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="glass-light rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Event</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Type</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(event => {
                const eventType = EVENT_TYPES[event.type];
                return (
                  <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={event.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">{event.name}</p>
                          <p className="text-xs text-slate-500 truncate">{event.instructor}</p>
                        </div>
                        {event.featured && <Star className="w-3.5 h-3.5 text-fire-400 fill-current shrink-0" />}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-slate-300">{format(parseISO(event.date), 'MMM d, yyyy')}</p>
                      <p className="text-xs text-slate-500">{event.startTime}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs">{eventType?.icon} {eventType?.label}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-sm font-medium ${event.booked >= event.capacity ? 'text-ember-400' : 'text-white'}`}>
                        {event.booked}/{event.capacity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center hidden sm:table-cell">
                      <span className="text-sm text-white">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        event.status === 'active' ? 'bg-mint-500/10 text-mint-400' :
                        event.status === 'cancelled' ? 'bg-ember-500/10 text-ember-400' :
                        'bg-white/5 text-slate-400'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(event)} className="p-1.5 rounded-lg text-slate-400 hover:text-ice-400 hover:bg-ice-500/10 transition-all" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDuplicate(event)} className="p-1.5 rounded-lg text-slate-400 hover:text-fire-400 hover:bg-fire-500/10 transition-all" title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-ember-400 hover:bg-ember-500/10 transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No events found</div>
        )}
      </div>
    </div>
  );
}
