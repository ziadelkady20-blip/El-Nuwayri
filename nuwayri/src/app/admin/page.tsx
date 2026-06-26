'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error('يرجى إدخال البريد وكلمة المرور'); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('مرحباً بك في لوحة التحكم!');
      router.push('/admin/dashboard');
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential' ? 'بيانات الدخول غير صحيحة' : 'حدث خطأ، حاول مرة أخرى';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E63] to-[#1a2f5e] flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0B2E63] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0B2E63]/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900">مطبعة النويري</h1>
          <p className="text-gray-400 text-sm mt-1">لوحة التحكم الإدارية</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@nuwayri.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2E63] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0B2E63] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2E63] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : '🔐'}
            {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← العودة للموقع</a>
        </div>
      </div>
    </div>
  );
}
