'use client';
import { useEffect, useState, useRef } from 'react';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct, getCategories } from '@/lib/firestore';
import { uploadFile } from '@/lib/storage';
import { logActivity } from '@/lib/firestore';
import toast from 'react-hot-toast';

const EMPTY = { name:'', description:'', price:'', discountPrice:'', categoryId:'', emoji:'📦', stock:true, specs:'', seoTitle:'', bg:'from-gray-50 to-gray-100' };

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeToProducts((data) => { setProducts(data); setLoading(false); });
    getCategories().then(setCategories);
    return unsub;
  }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setImageFile(null); setShowForm(true); }
  function openEdit(p: any) { setEditing(p); setForm({...EMPTY, ...p}); setImageFile(null); setShowForm(true); }

  async function handleSave() {
    if (!form.name) { toast.error('اسم المنتج مطلوب'); return; }
    setUploading(true);
    try {
      let imageUrl = form.imageUrl || '';
      if (imageFile) {
        const path = `products/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path, setProgress);
      }
      const data = { ...form, imageUrl, price: Number(form.price)||0, discountPrice: form.discountPrice ? Number(form.discountPrice) : null };
      if (editing) {
        await updateProduct(editing.id, data);
        await logActivity('update_product', `تحديث منتج: ${form.name}`);
        toast.success('تم تحديث المنتج');
      } else {
        await addProduct(data);
        await logActivity('add_product', `إضافة منتج جديد: ${form.name}`);
        toast.success('تم إضافة المنتج');
      }
      setShowForm(false);
    } catch (e) { toast.error('حدث خطأ'); }
    finally { setUploading(false); setProgress(0); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`هل تريد حذف "${name}"؟`)) return;
    try {
      await deleteProduct(id);
      await logActivity('delete_product', `حذف منتج: ${name}`);
      toast.success('تم حذف المنتج');
    } catch { toast.error('حدث خطأ'); }
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">إدارة المنتجات</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          ＋ منتج جديد
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => <div key={i} className="bg-white rounded-2xl h-52 animate-pulse border border-gray-100"/>)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <div className="text-5xl mb-4">📦</div>
            <p className="font-semibold">لا توجد منتجات بعد</p>
            <button onClick={openAdd} className="mt-4 bg-[#0B2E63] text-white font-bold px-6 py-2.5 rounded-xl text-sm">إضافة أول منتج</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                <div className={`h-32 bg-gradient-to-br ${p.bg||'from-gray-50 to-gray-100'} flex items-center justify-center text-4xl relative`}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"/> : p.emoji||'📦'}
                  {!p.stock && <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center text-white text-xs font-bold">نفد المخزون</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#0B2E63] font-extrabold text-base">{p.discountPrice||p.price} ج.م</span>
                    {p.discountPrice && <span className="text-gray-300 line-through text-xs">{p.price}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-1.5 rounded-lg text-xs transition-colors">تعديل</button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 rounded-lg text-xs transition-colors">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900">{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">صورة المنتج</label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden"
                  onClick={() => fileRef.current?.click()}
                >
                  {imageFile ? (
                    <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover rounded-xl"/>
                  ) : form.imageUrl ? (
                    <img src={form.imageUrl} className="w-full h-full object-cover rounded-xl"/>
                  ) : (
                    <><div className="text-3xl mb-1">📸</div><p className="text-xs text-gray-400">انقر لرفع صورة</p></>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setImageFile(e.target.files[0])}/>
              </div>
              {/* Fields */}
              {[['name','اسم المنتج','text'],['emoji','ايموجي (بديل الصورة)','text'],['price','السعر (ج.م)','number'],['discountPrice','سعر الخصم (اختياري)','number']].map(([key,label,type]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input type={type} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    value={form[key]||''} onChange={e => setForm((f:any)=>({...f,[key]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الوصف</label>
                <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" rows={3}
                  value={form.description||''} onChange={e => setForm((f:any)=>({...f,description:e.target.value}))}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الفئة</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  value={form.categoryId||''} onChange={e => setForm((f:any)=>({...f,categoryId:e.target.value}))}>
                  <option value="">اختر فئة</option>
                  {categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">متاح في المخزون</label>
                <button type="button" onClick={() => setForm((f:any)=>({...f,stock:!f.stock}))}
                  className={`w-10 h-6 rounded-full relative transition-colors ${form.stock ? 'bg-[#0B2E63]' : 'bg-gray-200'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${form.stock ? 'right-1' : 'right-5'}`}/>
                </button>
              </div>
              {progress > 0 && progress < 100 && (
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0B2E63] transition-all" style={{width:`${progress}%`}}/>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={uploading}
                className="flex-1 bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                {uploading ? 'جارٍ الحفظ...' : editing ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
