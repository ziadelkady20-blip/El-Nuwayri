'use client';

const SERVICES = [
  { icon: '🖥️', name: 'الطباعة الرقمية', desc: 'جودة فائقة وألوان زاهية بأسرع وقت ممكن' },
  { icon: '🏷️', name: 'الاستيكرات', desc: 'استيكرات لاصقة بأشكال وقصات حسب الطلب' },
  { icon: '📦', name: 'البوكسات والتغليف', desc: 'تغليف فاخر يعكس قيمة علامتك التجارية' },
  { icon: '🪧', name: 'البنرات واللوحات', desc: 'لوحات إعلانية ضخمة بدقة طباعة عالية' },
  { icon: '💳', name: 'الكروت الشخصية', desc: 'بطاقات أعمال أنيقة تترك انطباعاً لا يُنسى' },
  { icon: '📄', name: 'الفلايرات والبروشورات', desc: 'مطبوعات ترويجية احترافية لحملاتك' },
  { icon: '🎁', name: 'الهدايا الدعائية', desc: 'هدايا مخصصة بشعار شركتك لترسيخ علامتك' },
  { icon: '🎨', name: 'تصميم الجرافيك', desc: 'فريق مبدع لتحويل أفكارك إلى تصاميم مميزة' },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-wide">خدماتنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">كل ما تحتاجه من <span className="text-[#1D4ED8]">طباعة واحترافية</span></h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">نقدم مجموعة شاملة من خدمات الطباعة والتصميم لتلبية احتياجات عملك بأعلى المعايير.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {SERVICES.map((s) => (
            <div key={s.name} className="group bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:border-transparent transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B2E63] to-[#1D4ED8] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"/>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#0B2E63]/8 group-hover:bg-white/15 rounded-2xl flex items-center justify-center mb-4 text-2xl transition-colors">
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-white mb-2 transition-colors text-sm sm:text-base">{s.name}</h3>
                <p className="text-gray-400 group-hover:text-white/75 text-xs sm:text-sm leading-relaxed transition-colors">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
