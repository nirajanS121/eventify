import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Pencil, Trash2, X, Gift, Percent, Calendar, Users, Copy } from 'lucide-react';
import { fetchPromos, createPromoAsync, updatePromoAsync, deletePromoAsync } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const empty = { code: '', discountPercent: 10, maxUses: 100, expiryDate: '', minimumAmount: 0, description: '' };

export default function AdminPromos() {
  const dispatch = useDispatch();
  const { promoCodes } = useSelector(state => state.admin);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchPromos());
  }, [dispatch]);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ code: p.code, discountPercent: p.discountPercent, maxUses: p.maxUses, expiryDate: p.expiryDate?.slice(0,10) || '', minimumAmount: p.minimumAmount || 0, description: p.description || '' }); setShowForm(true); };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return toast.error('Code is required');
    const payload = { ...form, discountPercent: Number(form.discountPercent), maxUses: Number(form.maxUses), minimumAmount: Number(form.minimumAmount), code: form.code.toUpperCase() };
    try {
      if (editing) {
        await dispatch(updatePromoAsync({ id: editing, body: payload })).unwrap();
        toast.success('Promo updated');
      } else {
        await dispatch(createPromoAsync(payload)).unwrap();
        toast.success('Promo created');
      }
      close();
    } catch (err) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this promo code?')) return;
    try {
      await dispatch(deletePromoAsync(id)).unwrap();
      toast.success('Promo deleted');
    } catch (err) {
      toast.error(err || 'Delete failed');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied!');
  };

  const totalRedemptions = promoCodes.reduce((s, p) => s + (p.currentUses || 0), 0);
  const active = promoCodes.filter(p => p.isActive !== false).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
          <p className="text-sm text-slate-400 mt-1">Create discount codes and track usage</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all">
          <Plus className="w-4 h-4" /> New Promo Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-light rounded-2xl p-5">
          <Tag className="w-5 h-5 text-ice-400 mb-2" />
          <p className="text-2xl font-bold text-white">{promoCodes.length}</p>
          <p className="text-xs text-slate-500">Total Codes</p>
        </div>
        <div className="glass-light rounded-2xl p-5">
          <Gift className="w-5 h-5 text-mint-400 mb-2" />
          <p className="text-2xl font-bold text-white">{active}</p>
          <p className="text-xs text-slate-500">Active</p>
        </div>
        <div className="glass-light rounded-2xl p-5">
          <Users className="w-5 h-5 text-fire-400 mb-2" />
          <p className="text-2xl font-bold text-white">{totalRedemptions}</p>
          <p className="text-xs text-slate-500">Total Redemptions</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promoCodes.map(p => (
          <motion.div key={p.id} layout className="glass-light rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <button onClick={() => copyCode(p.code)} className="flex items-center gap-2 group">
                <span className="font-mono text-lg font-bold text-white group-hover:text-ice-400 transition-colors">{p.code}</span>
                <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-ice-400 transition-colors" />
              </button>
              <span className={`text-xs px-2 py-0.5 rounded-lg ${p.isActive !== false ? 'bg-mint-500/10 text-mint-400' : 'bg-slate-500/10 text-slate-500'}`}>
                {p.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>

            {p.description && <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Percent className="w-3.5 h-3.5" />
                <span className="text-white font-semibold">{p.discountPercent}%</span> off
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-3.5 h-3.5" />
                <span className="text-white font-semibold">{p.currentUses || 0}</span>/{p.maxUses}
              </div>
              {p.expiryDate && (
                <div className="flex items-center gap-1.5 text-slate-400 col-span-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Expires {new Date(p.expiryDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Usage bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full gradient-ice rounded-full transition-all" style={{ width: `${Math.min(((p.currentUses||0)/p.maxUses)*100,100)}%` }} />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all text-xs">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'New'} Promo Code</h3>
                <button onClick={close} className="p-1 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Code</label>
                  <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none font-mono uppercase" placeholder="WELCOME20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Discount %</label>
                    <input type="number" min={1} max={100} value={form.discountPercent} onChange={e => setForm({...form, discountPercent: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Max Uses</label>
                    <input type="number" min={1} value={form.maxUses} onChange={e => setForm({...form, maxUses: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Min Amount ($)</label>
                    <input type="number" min={0} value={form.minimumAmount} onChange={e => setForm({...form, minimumAmount: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Expiry Date</label>
                    <input type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Description</label>
                  <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-ice-500/50 focus:outline-none" placeholder="Optional note" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-ice hover:shadow-lg hover:shadow-ice-500/20 transition-all">
                  {editing ? 'Update' : 'Create'} Promo Code
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
