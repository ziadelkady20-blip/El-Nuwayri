'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats, subscribeToOrders, ORDER_STATUSES } from '@/lib/firestore';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    return subscribeToOrders(setOrders);
  }, []);

  // Top services
  const serviceCounts: Record<string, number> = {};
  orders.forEach(o => { const s = o.service||o.productName||'أخرى'; serviceCounts[s] = (serviceCounts[s]||0)+1; });
  const topServices = Object.entries(serviceCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const totalOrders = orders.length || 1;

  const CARDS = [
    { label:'إجمالي الطلبات', val: stats.totalOrders||0, icon:'🛒', color:'bg-blue-50 text-blue-700' },
    { label:'الإيرادات (ج.م)', val: (stats.totalRevenue||0).toLocaleString(), icon:'💰', color:'bg-amber-50 text-amber-700' },
    { label:'المنتجات', val: stats.totalProducts||0, icon:'📦', color:'bg-green-50 text-green-700' },
    { label:'في الانتظار', val: stats.pendingOrders||0, icon:'⏳', color:'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">الإحصائيات والتقارير</h1>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map(c => (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${c.color} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>{c.icon}</div>
              <div>
                <div className="text-2xl font-black text-gray-900">{c.val}</div>
                <div className="text-xs text-gray-400">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top services */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-5">الخدمات الأكثر طلباً</h2>
            <div className="flex flex-col gap-4">
              {topServices.length === 0 ? (
                <p className="text-gray-300 text-sm text-center py-6">لا توجد بيانات بعد</p>
              ) : topServices.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700">{name}</span>
                    <span className="font-bold text-[#0B2E63]">{count} طلب</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-[#0B2E63] to-[#1D4ED8] rounded-full transition-all"
                      style={{width:`${(count/totalOrders)*100}%`}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-5">توزيع حالات الطلبات</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(ORDER_STATUSES).map(([key, val]) => {
                const count = stats.statusCounts?.[key] || 0;
                const pct = totalOrders > 0 ? Math.round((count/totalOrders)*100) : 0;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-28 text-center flex-shrink-0 ${val.color}`}>{val.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0B2E63] rounded-full" style={{width:`${pct}%`}}/>
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-8 text-left">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-50 grid grid-cols-2 gap-3">
              {[
                { label:'متوسط قيمة الطلب', val: stats.totalRevenue && stats.totalOrders ? `${Math.round(stats.totalRevenue/stats.totalOrders)} ج.م` : '—' },
                { label:'نسبة الإكمال', val: stats.totalOrders ? `${Math.round(((stats.statusCounts?.completed||0)/stats.totalOrders)*100)}%` : '—' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-[#0B2E63]">{s.val}</div>
                  <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
