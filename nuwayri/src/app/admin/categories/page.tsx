'use client';
import { useEffect, useState } from 'react';
import { subscribeToCategories, addCategory, updateCategory, deleteCategory } from '@/lib/firestore';
import { logActivity } from '@/lib/firestore';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', emoji:'📦', order:0, active:true };

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);

  useEffect(() => {
    return subscribeToCategories(setCats);
  }, []);

  function openAdd() { setEditing(null); setForm({...EMPTY, order: cats.length}); setShowForm(true); }
  function openEdit(c: any) { setEditing(c); setForm({...EMPTY,...c}); setShowForm(true); }

  async function handleSave() {
    if (!form.name) { toast.error('اسم الفئة مطلوب'); return; }
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        await logActivity('update_category', `تعديل فئة: ${form.name}`);
        toast.success('تم تحديث الفئة');
      } else {
        await addCategory(form);
        await logActivity('add_category', `إضافة فئة: ${form.name}`);
        toast.success('تم إضافة الفئة');
      }
      setShowForm(false);
    } catch { toast.error('حدث خطأ'); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`حذف فئة "${name}"؟`)) return;
    try {
      await deleteCategory(id);
      await logActivity('delete_category', `حذف فئة: ${name}`);
      toast.success('تم حذف الفئة');
    } catch { toast.error('حدث خطأ'); }
  }

  async function toggleActive(id: string, val: boolean, name: string) {
    await updateCategory(id, { active: !val });
    toast.success(`تم ${!val ? 'تفعيل' : 'إيقاف'} "${name}"`);
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">إدارة الفئات</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          ＋ فئة جديدة
        </button>
      </div>
      <div className="p-6">
        {cats.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <div className="text-5xl mb-4">🗂️</div>
            <p className="font-semibold">لا توجد فئات بعد</p>
            <button onClick={openAdd} className="mt-4 bg-[#0B2E63] text-white font-bold px-6 py-2.5 rounded-xl text-sm">إضافة أول فئة</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {cats.map((c: any, i: number) => (
              <div key={c.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
                <div className="text-2xl w-10 text-center">{c.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{c.description || 'لا يوجد وصف'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleActive(c.id, c.active, c.name)}
                    className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${c.active !== false ? 'bg-[#0B2E63]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${c.active !== false ? 'right-1' : 'right-5'}`}/>
                  </button>
                  <button onClick={() => openEdit(c)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">تعديل</button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900">{editing ? 'تعديل الفئة' : 'إضافة فئة'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {[['name','اسم الفئة'],['emoji','الإيموجي'],['description','الوصف (اختياري)'],['order','الترتيب']].map(([key,label]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={form[key]||''} onChange={e => setForm((f:any)=>({...f,[key]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} className="flex-1 bg-[#0B2E63] hover:bg-[#1D4ED8] text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                {editing ? 'حفظ' : 'إضافة'}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
