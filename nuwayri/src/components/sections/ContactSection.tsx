'use client';
import { useState, useEffect } from 'react';
import { subscribeToSiteContent, addOrder, logActivity } from '@/lib/firestore';
import toast from 'react-hot-toast';

const DEFAULT_CONTACT = {
  phone: '01000000000',
  email: 'info@nuwayri.com',
  address: 'شارع النصر، الفيوم، مصر',
  hours: 'السبت–الخميس: 9ص – 10م',
  whatsapp: '201000000000',
};

export default function ContactSection() {
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [form, setForm] = useState({ name:'', phone:'', service:'', notes:'' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsub = subscribeToSiteContent((data) => {
      if (data?.contact) setContact({ ...DEFAULT_CONTACT, ...data.contact });
    });
    return unsub;
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('يرجى إدخال الاسم ورقم الهاتف'); return; }
    setSending(true);
    try {
      await addOrder({
        customerName: form.name,
        customerPhone: form.phone,
        service: form.service,
        notes: form.notes,
        status: 'pending',
        amount: 0,
        source: 'website',
      });
      await logActivity('new_order', `طلب جديد من ${form.name} - ${form.service}`, 'زائر');
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً 🎉');
      setForm({ name:'', phone:'', service:'', notes:'' });
    } catch (err) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setSending(false);
    }
  }

  const INFO = [
    { icon:'📱', label:'واتساب / هاتف', val: contact.phone },
    { icon:'📧', label:'البريد الإلكتروني', val: contact.email },
    { icon:'📍', label:'العنوان', val: contact.address },
    { icon:'🕐', label:'ساعات العمل', val: contact.hours },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="inline-block bg-[#0B2E63]/8 text-[#0B2E63] text-xs font-bold px-4 py-1.5 rounded-full mb-3">تواصل معنا</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">هل أنت مستعد لتبدأ <span className="text-[#1D4ED8]">مشروعك؟</span></h2>
          <p className="text-gray-500">تواصل معنا الآن واحصل على عرض سعر مجاني لطلبك</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div className="flex flex-col gap-4">
            {INFO.map(item => (
              <div key={item.label} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold">{item.label}</div>
                  <div className="font-bold text-gray-800 text-sm mt-0.5">{item.val}</div>
                </div>
              </div>
            ))}
            {/* Social + WhatsApp CTA */}
            <div className="bg-gradient-to-br from-[#0B2E63] to-[#1D4ED8] rounded-2xl p-6 text-white">
              <div className="font-bold text-base mb-1">تابعنا على وسائل التواصل</div>
              <div className="text-white/60 text-sm mb-4">استوحِ أفكارك من أعمالنا الأخيرة</div>
              <div className="flex gap-2">
                {['📸', '👍', '🎵', '💬'].map((ic, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base hover:bg-white/20 transition-colors">{ic}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
            <h3 className="font-extrabold text-gray-900 text-lg mb-6">أرسل طلبك الآن</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="اسمك الكامل"
                  value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف <span className="text-red-400">*</span></label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="01xxxxxxxxx"
                  value={form.phone}
                  onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">الخدمة المطلوبة</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors bg-white"
                value={form.service}
                onChange={e => setForm(f => ({...f, service: e.target.value}))}
              >
                <option value="">اختر الخدمة</option>
                {['الطباعة الرقمية','استيكرات','بوكسات وتغليف','كروت شخصية','بنرات ولوحات','رول أب','أكياس ورقية','هدايا دعائية','تصميم جرافيك','أخرى'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">تفاصيل الطلب</label>
              <textarea
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors resize-none"
                rows={4}
                placeholder="اذكر تفاصيل طلبك: المنتج، الكمية، المقاس، التشطيب..."
                value={form.notes}
                onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {sending ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>جارٍ الإرسال...</>
              ) : (<>إرسال الطلب <span>←</span></>)}
            </button>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              className="mt-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              💬 تواصل عبر واتساب
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
