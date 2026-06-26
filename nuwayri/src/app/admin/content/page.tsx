'use client';
import { useEffect, useState } from 'react';
import { getSiteContent, updateSiteContent } from '@/lib/firestore';
import { logActivity } from '@/lib/firestore';
import toast from 'react-hot-toast';

export default function ContentPage() {
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('hero');

  useEffect(() => {
    getSiteContent().then(setContent);
  }, []);

  function setVal(section: string, key: string, val: string) {
    setContent((c: any) => ({ ...c, [section]: { ...c?.[section], [key]: val } }));
  }

  async function save(section: string, label: string) {
    setSaving(true);
    try {
      await updateSiteContent({ [section]: content[section] });
      await logActivity('update_content', `تحديث محتوى: ${label}`);
      toast.success(`تم حفظ ${label} بنجاح ✅`);
    } catch { toast.error('حدث خطأ'); }
    finally { setSaving(false); }
  }

  if (!content) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#0B2E63] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  const TABS = [
    { key:'hero', label:'قسم الهيرو' },
    { key:'stats', label:'الإحصائيات' },
    { key:'contact', label:'معلومات التواصل' },
    { key:'footer', label:'الفوتر' },
  ];

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">محتوى الموقع</h1>
        <p className="text-xs text-gray-400 mt-0.5">التغييرات تنعكس فوراً على الموقع بعد الحفظ</p>
      </div>
      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab===t.key ? 'bg-[#0B2E63] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* HERO */}
        {tab === 'hero' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-5 pb-4 border-b border-gray-50">قسم الهيرو الرئيسي</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان الرئيسي</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                  value={content.hero?.headline||''} onChange={e => setVal('hero','headline',e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان الفرعي</label>
                <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none" rows={3}
                  value={content.hero?.subheadline||''} onChange={e => setVal('hero','subheadline',e.target.value)}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">نص الزر الأول</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                    value={content.hero?.btn1||''} onChange={e => setVal('hero','btn1',e.target.value)}/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">نص الزر الثاني</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                    value={content.hero?.btn2||''} onChange={e => setVal('hero','btn2',e.target.value)}/>
                </div>
              </div>
              <button onClick={() => save('hero','الهيرو')} disabled={saving}
                className="self-start bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                💾 حفظ التغييرات
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-5 pb-4 border-b border-gray-50">قسم الإحصائيات</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['orders','الطلبات المكتملة'],['satisfaction','رضا العملاء'],['execution','متوسط التنفيذ (ساعة)'],['experience','سنوات الخبرة']].map(([key,label]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                    value={content.stats?.[key]||''} onChange={e => setVal('stats',key,e.target.value)}/>
                </div>
              ))}
            </div>
            <button onClick={() => save('stats','الإحصائيات')} disabled={saving}
              className="mt-5 bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              💾 حفظ التغييرات
            </button>
          </div>
        )}

        {/* CONTACT */}
        {tab === 'contact' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-5 pb-4 border-b border-gray-50">معلومات التواصل</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['phone','رقم الهاتف'],['whatsapp','رقم واتساب (مع كود الدولة)'],['email','البريد الإلكتروني'],['address','العنوان'],['hours','ساعات العمل']].map(([key,label]) => (
                <div key={key} className={key==='address'||key==='hours' ? 'col-span-2':''}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                    value={content.contact?.[key]||''} onChange={e => setVal('contact',key,e.target.value)}/>
                </div>
              ))}
            </div>
            <button onClick={() => save('contact','التواصل')} disabled={saving}
              className="mt-5 bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              💾 حفظ التغييرات
            </button>
          </div>
        )}

        {/* FOOTER */}
        {tab === 'footer' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-extrabold text-gray-900 mb-5 pb-4 border-b border-gray-50">نص الفوتر</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">نص الوصف</label>
              <textarea className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none" rows={4}
                value={content.footer?.about||''} onChange={e => setVal('footer','about',e.target.value)}/>
            </div>
            <button onClick={() => save('footer','الفوتر')} disabled={saving}
              className="mt-4 bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              💾 حفظ التغييرات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
