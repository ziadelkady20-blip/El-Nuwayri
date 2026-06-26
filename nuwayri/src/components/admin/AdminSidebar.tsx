'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

const NAV = [
  { group: 'الرئيسية', items: [
    { href: '/admin/dashboard', icon: '📊', label: 'لوحة التحكم' },
  ]},
  { group: 'المحتوى', items: [
    { href: '/admin/categories', icon: '🗂️', label: 'الفئات' },
    { href: '/admin/products', icon: '📦', label: 'المنتجات' },
    { href: '/admin/portfolio', icon: '🖼️', label: 'معرض الأعمال' },
    { href: '/admin/testimonials', icon: '⭐', label: 'آراء العملاء' },
    { href: '/admin/content', icon: '📝', label: 'محتوى الموقع' },
    { href: '/admin/media', icon: '📁', label: 'مكتبة الوسائط' },
  ]},
  { group: 'المبيعات', items: [
    { href: '/admin/orders', icon: '🛒', label: 'الطلبات' },
    { href: '/admin/analytics', icon: '📈', label: 'الإحصائيات' },
  ]},
  { group: 'النظام', items: [
    { href: '/admin/users', icon: '👥', label: 'المستخدمون' },
    { href: '/admin/activity', icon: '📋', label: 'سجل النشاط' },
  ]},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();

  async function handleSignOut() {
    await signOut();
    toast.success('تم تسجيل الخروج');
    router.push('/admin');
  }

  return (
    <aside className="w-[240px] min-h-screen bg-[#0B2E63] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base">النويري</span>
        </div>
        <p className="text-white/30 text-xs mr-12">لوحة التحكم v2.0</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV.map(group => (
          <div key={group.group} className="mb-4">
            <div className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">{group.group}</div>
            {group.items.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-0.5 transition-all
                    ${active ? 'bg-amber-400/20 text-amber-300' : 'text-white/55 hover:text-white hover:bg-white/8'}`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'أ'}
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-xs font-bold truncate">{user?.email || 'admin'}</div>
            <div className="text-white/30 text-[10px]">Super Admin</div>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/8 transition-all mb-1">
          🌐 عرض الموقع
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all">
          🚪 تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
