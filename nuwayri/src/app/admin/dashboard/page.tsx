'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats, subscribeToOrders } from '@/lib/firestore';
import { ORDER_STATUSES } from '@/lib/firestore';
import Link from 'next/link';

function AdminHeader({ title }: { title: string }) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-lg font-extrabold text-gray-900">{title}</h1>
    </div>
  );
}

export { AdminHeader };

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({});
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(s => { setStats(s); setLoading(false); }).catch(() => setLoading(false));
    const unsub = subscribeToOrders((orders) => {
      setRecentOrders(orders.slice(0, 7));
    });
    return unsub;
  }, []);

  const STAT_CARDS = [
    { label: 'إجمالي الطلبات', value: stats.totalOrders || 0, icon: '🛒', color: 'bg-blue-50 text-blue-700', change: '+12%' },
    { label: 'الإيرادات (ج.م)', value: (stats.totalRevenue || 0).toLocaleString('ar-EG'), icon: '💰', color: 'bg-amber-50 text-amber-700', change: '+8%' },
    { label: 'المنتجات', value: stats.totalProducts || 0, icon: '📦', color: 'bg-green-50 text-green-700', change: '' },
    { label: 'في الانتظار', value: stats.pendingOrders || 0, icon: '⏳', color: 'bg-red-50 text-red-600', change: 'جارية' },
  ];

  const STATUS_DIST = Object.entries(ORDER_STATUSES).map(([key, val]) => ({
    key, label: val.label,
    count: stats.statusCounts?.[key] || 0,
  }));

  return (
    <div>
      <AdminHeader title="لوحة التحكم" />
      <div className="p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
              <div>
                <div className="text-2xl font-black text-gray-900">{loading ? '—' : s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                {s.change && <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">{s.change}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent orders table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">آخر الطلبات</h2>
              <Link href="/admin/orders" className="text-xs text-[#0B2E63] font-semibold hover:underline">عرض الكل ←</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-400 text-xs font-bold">
                  <th className="text-right px-5 py-3">العميل</th>
                  <th className="text-right px-5 py-3">الخدمة</th>
                  <th className="text-right px-5 py-3">المبلغ</th>
                  <th className="text-right px-5 py-3">الحالة</th>
                </tr></thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-300 text-sm">لا توجد طلبات بعد</td></tr>
                  ) : recentOrders.map((o: any) => (
                    <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-gray-800">{o.customerName}</td>
                      <td className="px-5 py-3 text-gray-500">{o.service || o.productName || '—'}</td>
                      <td className="px-5 py-3 font-bold text-[#0B2E63]">{o.amount ? `${o.amount} ج.م` : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ORDER_STATUSES[o.status as keyof typeof ORDER_STATUSES]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {ORDER_STATUSES[o.status as keyof typeof ORDER_STATUSES]?.label || o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">توزيع الطلبات</h2>
            <div className="flex flex-col gap-3">
              {STATUS_DIST.map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ORDER_STATUSES[s.key as keyof typeof ORDER_STATUSES]?.color}`}>{s.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0B2E63] rounded-full transition-all" style={{width: `${Math.min((s.count/(stats.totalOrders||1))*100, 100)}%`}}/>
                  </div>
                  <span className="text-xs font-bold text-gray-600 w-5 text-left">{s.count}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-6 pt-5 border-t border-gray-50">
              <h3 className="font-bold text-gray-700 text-sm mb-3">إجراءات سريعة</h3>
              <div className="flex flex-col gap-2">
                <Link href="/admin/products" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0B2E63] font-semibold transition-colors">📦 إضافة منتج جديد</Link>
                <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0B2E63] font-semibold transition-colors">🛒 إدارة الطلبات</Link>
                <Link href="/admin/content" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0B2E63] font-semibold transition-colors">📝 تعديل المحتوى</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
