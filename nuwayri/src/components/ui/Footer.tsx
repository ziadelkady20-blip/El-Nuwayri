'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { subscribeToSiteContent } from '@/lib/firestore';

export default function Footer() {
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    const unsub = subscribeToSiteContent((data) => setContent(data || {}));
    return unsub;
  }, []);

  const phone = content?.contact?.phone || '01000000000';
  const email = content?.contact?.email || 'info@nuwayri.com';
  const address = content?.contact?.address || 'شارع النصر، الفيوم، مصر';
  const about = content?.footer?.about || 'نطبع أفكارك بجودة تليق بعلامتك التجارية. خبرة أكثر من 10 سنوات في مجال الطباعة والتغليف بمصر.';

  return (
    <footer className="bg-[#060f1e] text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                </svg>
              </div>
              <span className="text-white font-bold text-base">مطبعة النويري</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">{about}</p>
            <div className="flex gap-2">
              {['📸','👍','🎵','💬'].map((ic, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-sm hover:bg-amber-400 hover:border-amber-400 hover:text-white transition-all">{ic}</button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">روابط سريعة</h4>
            <ul className="flex flex-col gap-2.5">
              {[['#','الرئيسية'],['#services','الخدمات'],['#products','المنتجات'],['#portfolio','أعمالنا'],['#contact','تواصل معنا']].map(([href,label]) => (
                <li key={label}><a href={href} className="text-white/50 hover:text-amber-400 text-sm transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">خدماتنا</h4>
            <ul className="flex flex-col gap-2.5">
              {['الطباعة الرقمية','الاستيكرات','بوكسات التغليف','الكروت الشخصية','البنرات واللوحات'].map(s => (
                <li key={s}><a href="#services" className="text-white/50 hover:text-amber-400 text-sm transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">تواصل معنا</h4>
            <ul className="flex flex-col gap-2.5">
              <li><span className="text-white/50 text-sm">📱 {phone}</span></li>
              <li><span className="text-white/50 text-sm">📧 {email}</span></li>
              <li><span className="text-white/50 text-sm">📍 {address}</span></li>
              <li>
                <Link href="/admin" className="text-amber-400/70 hover:text-amber-400 text-sm transition-colors">
                  🔐 لوحة التحكم
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© {new Date().getFullYear()} مطبعة النويري. جميع الحقوق محفوظة.</span>
          <span>صُنع بـ ❤️ في مصر</span>
        </div>
      </div>
    </footer>
  );
}
