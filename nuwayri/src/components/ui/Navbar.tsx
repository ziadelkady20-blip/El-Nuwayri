'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B2E63]/98 shadow-2xl' : 'bg-[#0B2E63]/95'} backdrop-blur-md border-b border-white/8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-[70px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">مطبعة النويري</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {[['#services','الخدمات'],['#products','المنتجات'],['#portfolio','أعمالنا'],['#testimonials','العملاء'],['#contact','تواصل معنا']].map(([href,label]) => (
            <a key={href} href={href} className="text-white/75 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-semibold transition-all">
              {label}
            </a>
          ))}
          <Link href="/admin" className="mr-2 bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            لوحة التحكم
          </Link>
          <a href="#contact" className="mr-1 bg-[#F59E0B] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-all">
            اطلب الآن
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B2E63] border-t border-white/10 px-4 py-4 flex flex-col gap-2">
          {[['#services','الخدمات'],['#products','المنتجات'],['#portfolio','أعمالنا'],['#testimonials','العملاء'],['#contact','تواصل معنا']].map(([href,label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-2 text-sm font-semibold border-b border-white/8">
              {label}
            </a>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-amber-400 py-2 text-sm font-bold">🔐 لوحة التحكم</Link>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="bg-[#F59E0B] text-white text-center py-3 rounded-xl font-bold mt-2">اطلب الآن</a>
        </div>
      )}
    </nav>
  );
}
