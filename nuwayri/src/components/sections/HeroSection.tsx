'use client';
import { useEffect, useState } from 'react';
import { subscribeToSiteContent } from '@/lib/firestore';

const DEFAULT = {
  headline: 'نطبع أفكارك بجودة تليق بعلامتك التجارية',
  subheadline: 'حلول متكاملة للطباعة والتغليف والإعلانات بأحدث التقنيات وأعلى معايير الجودة.',
  btn1: 'اطلب الآن',
  btn2: 'تصفح المنتجات',
};

export default function HeroSection() {
  const [hero, setHero] = useState(DEFAULT);
  const [count, setCount] = useState({ orders: 0, satisfaction: 0, execution: 0, exp: 0 });

  useEffect(() => {
    const unsub = subscribeToSiteContent((data) => {
      if (data?.hero) setHero(data.hero);
    });
    // Animate counters
    const targets = { orders: 5000, satisfaction: 98, execution: 48, exp: 10 };
    const steps = 60;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const p = frame / steps;
      setCount({
        orders: Math.round(targets.orders * p),
        satisfaction: Math.round(targets.satisfaction * p),
        execution: Math.round(targets.execution * p),
        exp: Math.round(targets.exp * p),
      });
      if (frame >= steps) clearInterval(timer);
    }, 25);
    return () => { unsub(); clearInterval(timer); };
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0B2E63] via-[#0f3d7a] to-[#1a2f5e] flex items-center relative overflow-hidden pt-16 sm:pt-[70px]">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(rgba(255,255,255,0.055) 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border border-amber-400/10"/>
        <div className="absolute -bottom-20 left-20 w-72 h-72 rounded-full border border-white/5"/>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full border border-blue-400/10"/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
            مطبعة رائدة في مصر منذ 2015
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
            {hero.headline.split('بجودة').length > 1 ? (
              <>{hero.headline.split('بجودة')[0]}<span className="text-amber-400">بجودة</span>{hero.headline.split('بجودة')[1]}</>
            ) : hero.headline}
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-xl">{hero.subheadline}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-400/25 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {hero.btn1}
            </a>
            <a href="#products" className="border-2 border-white/30 hover:border-white text-white font-bold px-8 py-4 rounded-xl text-base transition-all hover:bg-white/8">
              {hero.btn2}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { val: count.orders.toLocaleString('ar-EG') + '+', label: 'طلب مكتمل' },
              { val: count.satisfaction + '%', label: 'رضا العملاء' },
              { val: count.execution + 'س', label: 'متوسط التنفيذ' },
              { val: count.exp + '+', label: 'سنوات خبرة' },
            ].map(s => (
              <div key={s.label} className="text-center bg-white/5 rounded-2xl py-4 px-2 border border-white/8">
                <div className="text-2xl font-black text-amber-400">{s.val}</div>
                <div className="text-xs text-white/50 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual card */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-[380px] h-[400px]">
            {/* Back card */}
            <div className="absolute top-14 right-10 w-[280px] bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
              <div className="text-white/50 text-xs font-bold mb-2">آخر طلب</div>
              <div className="text-white font-bold text-base mb-3">بوكسات هدايا فاخرة</div>
              <div className="flex gap-2">
                <span className="bg-white/15 text-white/80 text-xs px-3 py-1 rounded-full">500 قطعة</span>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-3 py-1 rounded-full">تشطيب ذهبي</span>
              </div>
            </div>
            {/* Main card */}
            <div className="absolute top-4 right-0 w-[320px] bg-white rounded-2xl p-6 shadow-2xl z-10">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">تقدم الطلب</div>
              <div className="text-lg font-extrabold text-gray-800 mb-4">استيكرات رول — ١٠٠٠ قطعة</div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-[#0B2E63] text-xs px-2.5 py-1 rounded-full font-semibold">ورق لاصق</span>
                <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">لمعة عالية</span>
                <span className="bg-gray-100 text-[#0B2E63] text-xs px-2.5 py-1 rounded-full font-semibold">قص دائري</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-[#0B2E63] to-[#1D4ED8] rounded-full w-[78%] transition-all"/>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[#0B2E63] text-xs font-bold">٧٨٪</span>
                <span className="text-gray-400 text-xs">في مرحلة الطباعة</span>
              </div>
            </div>
            {/* Stat badge */}
            <div className="absolute bottom-4 left-0 bg-[#0B2E63] rounded-2xl p-5 border border-white/15 shadow-xl">
              <div className="text-4xl font-black text-amber-400">٩٨٪</div>
              <div className="text-white/60 text-xs mt-1">رضا العملاء</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
