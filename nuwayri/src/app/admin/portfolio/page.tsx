'use client';
import { useEffect, useState, useRef } from 'react';
import { subscribeToPortfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/lib/firestore';
import { uploadFile } from '@/lib/storage';
import { logActivity } from '@/lib/firestore';
import toast from 'react-hot-toast';

const CATS = ['تغليف','استيكرات','لوحات','هويات بصرية','مطبوعات تجارية'];
const EMPTY = { title:'', category:'تغليف', emoji:'📦', bg:'from-gray-700 to-gray-900' };

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { return subscribeToPortfolio(setItems); }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setImageFile(null); setShowForm(true); }
  function openEdit(it: any) { setEditing(it); setForm({...EMPTY,...it}); setImageFile(null); setShowForm(true); }

  async function handleSave() {
    if (!form.title) { toast.error('العنوان مطلوب'); return; }
    setUploading(true);
    try {
      let imageUrl = form.imageUrl || '';
      if (imageFile) imageUrl = await uploadFile(imageFile, `portfolio/${Date.now()}_${imageFile.name}`);
      const data = { ...form, imageUrl };
      if (editing) { await updatePortfolioItem(editing.id, data); toast.success('تم التحديث'); }
      else { await addPortfolioItem(data); toast.success('تمت الإضافة'); }
      await logActivity('portfolio', editing ? `تعديل: ${form.title}` : `إضافة: ${form.title}`);
      setShowForm(false);
    } catch { toast.error('حدث خطأ'); }
    finally { setUploading(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`حذف "${title}"؟`)) return;
    await deletePortfolioItem(id);
    toast.success('تم الحذف');
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">معرض الأعمال</h1>
        <button onClick={openAdd} className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm">＋ مشروع جديد</button>
      </div>
      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-300"><div className="text-5xl mb-4">🖼️</div><p>لا توجد أعمال بعد</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((it:any) => (
              <div key={it.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${it.bg||'from-gray-700 to-gray-900'} flex items-center justify-center text-4xl`}>
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover"/> : it.emoji}
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900 text-sm truncate">{it.title}</div>
                  <div className="text-xs text-gray-400 mb-3">{it.category}</div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(it)} className="flex-1 bg-blue-50 text-blue-700 font-bold py-1.5 rounded-lg text-xs hover:bg-blue-100 transition-colors">تعديل</button>
                    <button onClick={() => handleDelete(it.id, it.title)} className="flex-1 bg-red-50 text-red-600 font-bold py-1.5 rounded-lg text-xs hover:bg-red-100 transition-colors">حذف</button>
                  </div>
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
              <h2 className="font-extrabold">{editing ? 'تعديل' : 'إضافة مشروع'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl h-28 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors overflow-hidden"
                onClick={() => fileRef.current?.click()}>
                {imageFile ? <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover"/> : form.imageUrl ? <img src={form.imageUrl} className="w-full h-full object-cover"/> : <span className="text-gray-400 text-sm">📸 رفع صورة</span>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])}/>
              {[['title','العنوان'],['emoji','الإيموجي']].map(([key,label]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={form[key]||''} onChange={e => setForm((f:any)=>({...f,[key]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الفئة</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  value={form.category||''} onChange={e => setForm((f:any)=>({...f,category:e.target.value}))}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={uploading} className="flex-1 bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                {uploading ? 'جارٍ الحفظ...' : 'حفظ'}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
