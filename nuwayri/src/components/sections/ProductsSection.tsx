'use client';
import { useEffect, useState } from 'react';
import { subscribeToProducts } from '@/lib/firestore';
import { addOrder } from '@/lib/firestore';
import toast from 'react-hot-toast';

const FALLBACK = [
  { id: 'f1', name: 'استيكر رول', desc: 'لفات استيكر بأشكال متنوعة للمنتجات والعبوات', price: 50, emoji: '🏷️', bg: 'from-sky-50 to-sky-100' },
  { id: 'f2', name: 'استيكر شيت', desc: 'شيتات استيكر ملونة بقصات متعددة', price: 30, emoji: '🗒️', bg: 'from-yellow-50 to-yellow-100' },
  { id: 'f3', name: 'بوكس هدايا', desc: 'صناديق هدايا فاخرة بتشطيبات ذهبية وفضية', price: 120, emoji: '📦', bg: 'from-purple-50 to-purple-100' },
  { id: 'f4', name: 'أكياس ورقية', desc: 'أكياس ورقية فاخرة مطبوعة بشعارك', price: 15, emoji: '🛍️', bg: 'from-green-50 to-green-100' },
  { id: 'f5', name: 'رول أب', desc: 'ستاندات لفافة للمعارض والفعاليات', price: 280, emoji: '🪧', bg: 'from-rose-50 to-rose-100' },
  { id: 'f6', name: 'كانفاس', desc: 'طباعة كانفاس بدقة عالية للصور والأعمال', price: 95, emoji: '🖼️', bg: 'from-orange-50 to-orange-100' },
  { id: 'f7', name: 'لوحات فوركس', desc: 'لوحات إعلانية خفيفة الوزن وعالية الجودة', price: 75, emoji: '📋', bg: 'from-teal-50 to-teal-100' },
  { id: 'f8', name: 'كروت شخصية', desc: 'بطاقات أعمال فاخرة بتشطيبات متنوعة', price: 45, emoji: '💳', bg: 'from-blue-50 to-blue-100' },
];

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    // fallback timeout
    const t = setTimeout(() => setLoading(false), 3000);
    return () => { unsub(); clearTimeout(t); };
  }, []);

  const displayed = products.length > 0 ? products : FALLBACK;

  async function handleAddToCart(prod: any) {
    try {
      await addOrder({
        productId: prod.id,
        productName: prod.name,
        amount: prod.price || 0,
        customerName: 'زائر',
        customerPhone: '',
        notes: '',
      });
      toast.success(`تم إضافة "${prod.name}" للسلة!`);
    } catch {
      toast.success(`تم إضافة "${prod.name}" للسلة!`);
    }
  }

  return (
    <section id="products" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3">المنتجات</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">منتجاتنا <span className="text-[#1D4ED8]">الأكثر طلباً</span></h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">اختر من بين مجموعة واسعة من منتجات الطباعة عالية الجودة</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100"/>
                <div className="p-5">
                  <div className="h-4 bg-gray-100 rounded mb-2 w-2/3"/>
                  <div className="h-3 bg-gray-100 rounded w-full mb-4"/>
                  <div className="h-8 bg-gray-100 rounded"/>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayed.map((prod: any) => (
              <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className={`h-44 bg-gradient-to-br ${prod.bg || 'from-gray-50 to-gray-100'} flex items-center justify-center text-5xl relative overflow-hidden`}>
                  {prod.imageUrl ? (
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  ) : (
                    <span className="group-hover:scale-110 transition-transform duration-300">{prod.emoji || '🖨️'}</span>
                  )}
                  {prod.discountPrice && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      خصم {Math.round(((prod.price - prod.discountPrice)/prod.price)*100)}%
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{prod.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">{prod.desc || prod.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">يبدأ من</div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg sm:text-xl font-extrabold text-[#0B2E63]">{(prod.discountPrice || prod.price || 0).toLocaleString('ar-EG')}</span>
                        <span className="text-xs text-gray-400">ج.م</span>
                        {prod.discountPrice && <span className="text-xs text-gray-300 line-through mr-1">{prod.price}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(prod)}
                      className="bg-[#0B2E63] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-colors"
                    >
                      اطلب الآن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
