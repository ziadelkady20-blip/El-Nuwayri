'use client';
import { useEffect, useState } from 'react';
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  logActivity,
} from '@/lib/firestore';
import toast from 'react-hot-toast';

const EMPTY = { name: '', role: '', text: '', rating: 5, active: true };

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      // get all including inactive for admin
      const { getDocs, collection, orderBy, query } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      const data = await getTestimonials();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(it: any) { setEditing(it); setForm({ ...EMPTY, ...it }); setShowForm(true); }

  async function handleSave() {
    if (!form.name || !form.text) { toast.error('الاسم والنص مطلوبان'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateTestimonial(editing.id, form);
        await logActivity('update_testimonial', `تعديل رأي: ${form.name}`);
        toast.success('تم التحديث');
      } else {
        await addTestimonial(form);
        await logActivity('add_testimonial', `إضافة رأي: ${form.name}`);
        toast.success('تمت الإضافة');
      }
      setShowForm(false);
      await load();
    } catch { toast.error('حدث خطأ'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`حذف رأي "${name}"؟`)) return;
    try {
      await deleteTestimonial(id);
      await logActivity('delete_testimonial', `حذف رأي: ${name}`);
      toast.success('تم الحذف');
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch { toast.error('حدث خطأ'); }
  }

  async function toggleActive(id: string, current: boolean, name: string) {
    await updateTestimonial(id, { active: !current });
    toast.success(`تم ${!current ? 'تفعيل' : 'إخفاء'} رأي "${name}"`);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, active: !current } : i));
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900">آراء العملاء</h1>
          <p className="text-xs text-gray-400 mt-0.5">تُعرض على الموقع تلقائياً عند تفعيلها</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          ＋ رأي جديد
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <div className="text-5xl mb-4">⭐</div>
            <p className="font-semibold">لا توجد آراء بعد</p>
            <button
              onClick={openAdd}
              className="mt-4 bg-[#0B2E63] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              إضافة أول رأي
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((it: any) => (
              <div
                key={it.id}
                className={`bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all ${
                  it.active === false ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-blue-100 hover:shadow-sm'
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0B2E63] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {it.name?.charAt(0) || 'ع'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{it.name}</span>
                    <span className="text-gray-400 text-xs">·</span>
                    <span className="text-gray-400 text-xs">{it.role}</span>
                    <span className="text-amber-400 text-xs">{'★'.repeat(it.rating || 5)}</span>
                    {it.active === false && (
                      <span className="bg-gray-100 text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">مخفي</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">"{it.text}"</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(it.id, it.active !== false, it.name)}
                    className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${
                      it.active !== false ? 'bg-[#0B2E63]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${
                        it.active !== false ? 'right-1' : 'right-5'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => openEdit(it)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(it.id, it.name)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900">
                {editing ? 'تعديل الرأي' : 'إضافة رأي جديد'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    الاسم <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="أحمد محمد"
                    value={form.name}
                    onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">الوظيفة / الدور</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="صاحب متجر"
                    value={form.role}
                    onChange={(e) => setForm((f: any) => ({ ...f, role: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  نص الرأي <span className="text-red-400">*</span>
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                  rows={4}
                  placeholder="اكتب رأي العميل هنا..."
                  value={form.text}
                  onChange={(e) => setForm((f: any) => ({ ...f, text: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">التقييم</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((f: any) => ({ ...f, rating: n }))}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        n <= (form.rating || 5) ? 'text-amber-400' : 'text-gray-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-400 self-center mr-2">{form.rating || 5}/5</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-gray-700">عرض على الموقع</span>
                <button
                  type="button"
                  onClick={() => setForm((f: any) => ({ ...f, active: !f.active }))}
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    form.active ? 'bg-[#0B2E63]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${
                      form.active ? 'right-1' : 'right-5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                {saving ? 'جارٍ الحفظ...' : editing ? 'حفظ التعديلات' : 'إضافة الرأي'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
