'use client';
import { useEffect, useState } from 'react';
import { subscribeToSiteContent } from '@/lib/firestore';
import { getTestimonials } from '@/lib/firestore';

const FALLBACK = [
  { id:'t1', name:'أحمد محمد السيد', role:'صاحب متجر إلكتروني', text:'جودة استثنائية في طباعة بوكسات المنتجات. فريق محترف وأسعار منافسة. بالتأكيد سأكرر التعامل مع النويري في جميع طلباتي القادمة.', rating:5 },
  { id:'t2', name:'نور الدين كامل', role:'مدير تسويق', text:'طلبت كروت شخصية وبروشورات لشركتي، والنتيجة فاقت توقعاتي. الألوان حية والورق فاخر. الاستيكرات تركت أثراً رائعاً على عملائي.', rating:5 },
  { id:'t3', name:'منة الله فوزي', role:'صاحبة بوتيك', text:'سرعة التسليم كانت مفاجأة جميلة. طلبت ١٠٠٠ كيس ورقي مطبوع وتسلمتها في يومين. الجودة ممتازة وسعر معقول جداً.', rating:5 },
];

const PROCESS_STEPS = [
  { num:'١', icon:'📤', title:'رفع الملف', desc:'ارفع ملف التصميم أو تواصل مع فريق التصميم لدينا' },
  { num:'٢', icon:'🔍', title:'مراجعة التصميم', desc:'يراجع فريقنا الملف ويتأكد من جاهزيته للطباعة' },
  { num:'٣', icon:'🖨️', title:'الطباعة', desc:'نطبع طلبك بأحدث الآلات وأعلى جودة تشطيب' },
  { num:'٤', icon:'🚚', title:'الشحن والاستلام', desc:'نشحن طلبك سريعاً لباب بيتك أو تستلمه من مقرنا' },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    getTestimonials().then(data => {
      if (data.length > 0) setTestimonials(data);
      else setTestimonials(FALLBACK);
    }).catch(() => setTestimonials(FALLBACK));
  }, []);

  const displayed = testimonials.length > 0 ? testimonials : FALLBACK;

  return (
    <>
      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3">آراء العملاء</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">ماذا يقول <span className="text-[#1D4ED8]">عملاؤنا</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((t: any) => (
              <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating || 5)].map((_,i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0B2E63] to-[#1D4ED8] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {t.name?.charAt(0) || 'ع'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3">طريقة العمل</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">كيف <span className="text-[#1D4ED8]">نُنجز طلبك؟</span></h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* connecting line desktop */}
            <div className="hidden lg:block absolute top-10 right-[12.5%] left-[12.5%] h-0.5 bg-gradient-to-l from-[#0B2E63] to-[#1D4ED8] z-0"/>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-[#0B2E63] text-white text-2xl font-black flex items-center justify-center mx-auto mb-5 border-4 border-white shadow-lg shadow-[#0B2E63]/20">
                  {step.num}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-extrabold text-gray-900 mb-2 text-base">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
