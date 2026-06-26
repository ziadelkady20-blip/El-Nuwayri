'use client';
import { useEffect, useState } from 'react';
import { subscribeToPortfolio } from '@/lib/firestore';

const WHY = [
  { icon: '⚡', title: 'سرعة التنفيذ', desc: 'ننجز طلبك في أسرع وقت ممكن مع الحفاظ على أعلى معايير الجودة وعدم التسرع في التشطيب.' },
  { icon: '🎨', title: 'جودة طباعة عالية', desc: 'نستخدم أحدث آلات الطباعة وأجود أنواع الأحبار لضمان ألوان زاهية وحادة في كل طلب.' },
  { icon: '🚚', title: 'شحن سريع', desc: 'خدمة توصيل سريعة وموثوقة لجميع محافظات مصر مع إمكانية التتبع المباشر.' },
  { icon: '💎', title: 'تشطيبات احترافية', desc: 'مجموعة متنوعة من التشطيبات الفاخرة: بطاقات ناعمة، تذهيب، نقر، لامع وغير لامع.' },
];

const PORT_CATS = ['الكل', 'تغليف', 'استيكرات', 'لوحات', 'هويات بصرية', 'مطبوعات تجارية'];

const FALLBACK_PORT = [
  { id:'p1', title:'بوكسات عطور فاخرة', category:'تغليف', emoji:'📦', bg:'from-[#1e3a5f] to-[#0B2E63]', span: 2 },
  { id:'p2', title:'استيكرات منتجات طبيعية', category:'استيكرات', emoji:'🏷️', bg:'from-emerald-800 to-emerald-900', span: 1 },
  { id:'p3', title:'أكياس ورقية بوتيك', category:'تغليف', emoji:'🛍️', bg:'from-red-800 to-red-900', span: 1 },
  { id:'p4', title:'كروت مكاتب قانونية', category:'هويات بصرية', emoji:'💳', bg:'from-indigo-800 to-indigo-900', span: 1 },
  { id:'p5', title:'رول أب فعاليات - شركة عقارات', category:'لوحات', emoji:'🪧', bg:'from-amber-800 to-amber-900', span: 2 },
  { id:'p6', title:'لوحات جدارية كافيه', category:'لوحات', emoji:'🖼️', bg:'from-teal-800 to-teal-900', span: 1 },
];

export default function WhyAndPortfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('الكل');

  useEffect(() => {
    const unsub = subscribeToPortfolio(setPortfolio);
    return unsub;
  }, []);

  const displayed = portfolio.length > 0 ? portfolio : FALLBACK_PORT;
  const filtered = activeTab === 'الكل' ? displayed : displayed.filter((p:any) => p.category === activeTab);

  return (
    <>
      {/* WHY US */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3">لماذا النويري؟</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">مزايا تجعلنا <span className="text-[#1D4ED8]">الخيار الأول</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map(w => (
              <div key={w.title} className="bg-white border border-gray-100 rounded-2xl p-7 text-center hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0B2E63]/8 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl group-hover:scale-110 transition-transform">
                  {w.icon}
                </div>
                <h3 className="font-extrabold text-gray-900 mb-3 text-base">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3">أعمالنا</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">معرض <span className="text-[#1D4ED8]">أعمالنا المميزة</span></h2>
            <p className="text-gray-500 text-base">نماذج من أفضل مشاريعنا في الطباعة والتغليف</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-2 flex-wrap mb-8">
            {PORT_CATS.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === cat ? 'bg-[#0B2E63] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
                {cat}
              </button>
            ))}
          </div>
          {/* Masonry-like grid */}
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((item: any, i: number) => (
              <div key={item.id}
                className={`rounded-2xl overflow-hidden group cursor-pointer relative ${item.span === 2 ? 'col-span-2' : 'col-span-1'}`}
                style={{ aspectRatio: item.span === 2 ? '16/7' : '4/3' }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${item.bg || 'from-gray-700 to-gray-900'} flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500`}>
                    {item.emoji || '🖨️'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E63]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <div>
                    <div className="text-white font-bold text-base">{item.title}</div>
                    <div className="text-white/60 text-sm">{item.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
