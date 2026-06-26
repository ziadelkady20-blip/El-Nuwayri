'use client';
import { useEffect, useState } from 'react';
import { subscribeToOrders, updateOrderStatus, updateOrder, ORDER_STATUSES } from '@/lib/firestore';
import { logActivity } from '@/lib/firestore';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = subscribeToOrders((data) => { setOrders(data); setLoading(false); });
    return unsub;
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const matchSearch = !search || o.customerName?.includes(search) || o.customerPhone?.includes(search) || o.service?.includes(search);
    return matchStatus && matchSearch;
  });

  async function changeStatus(id: string, status: string, name: string) {
    try {
      await updateOrderStatus(id, status);
      await logActivity('update_order', `تحديث حالة طلب ${name} إلى ${ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.label}`);
      toast.success('تم تحديث حالة الطلب');
    } catch { toast.error('حدث خطأ'); }
  }

  function exportCSV() {
    const rows = [['العميل','الهاتف','الخدمة','المبلغ','الحالة','التاريخ']];
    filtered.forEach(o => rows.push([o.customerName, o.customerPhone, o.service||o.productName, o.amount, ORDER_STATUSES[o.status as keyof typeof ORDER_STATUSES]?.label||o.status, o.createdAt?.toDate?.()?.toLocaleDateString('ar-EG')||'']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);
    a.download = 'orders.csv'; a.click();
    toast.success('تم تصدير الطلبات');
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">إدارة الطلبات</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          📊 تصدير Excel
        </button>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
          <input
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400 w-48"
            placeholder="بحث بالاسم أو الهاتف..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter==='all' ? 'bg-[#0B2E63] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              الكل ({orders.length})
            </button>
            {Object.entries(ORDER_STATUSES).map(([key, val]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter===key ? 'bg-[#0B2E63] text-white' : val.color+' hover:opacity-80'}`}>
                {val.label} ({orders.filter(o=>o.status===key).length})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-400 text-xs font-bold border-b border-gray-100">
                <th className="text-right px-5 py-3">#</th>
                <th className="text-right px-5 py-3">العميل</th>
                <th className="text-right px-5 py-3">الهاتف</th>
                <th className="text-right px-5 py-3">الخدمة</th>
                <th className="text-right px-5 py-3">المبلغ</th>
                <th className="text-right px-5 py-3">الحالة</th>
                <th className="text-right px-5 py-3">التاريخ</th>
                <th className="text-right px-5 py-3">إجراء</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_,i) => (
                    <tr key={i} className="border-t border-gray-50 animate-pulse">
                      {[...Array(8)].map((_,j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-full"/></td>)}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-300">لا توجد طلبات</td></tr>
                ) : filtered.map((o: any, i: number) => (
                  <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs font-mono">{i+1}</td>
                    <td className="px-5 py-3 font-bold text-gray-800">{o.customerName || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{o.customerPhone || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{o.service || o.productName || '—'}</td>
                    <td className="px-5 py-3 font-bold text-[#0B2E63]">{o.amount ? `${Number(o.amount).toLocaleString()} ج.م` : '—'}</td>
                    <td className="px-5 py-3">
                      <select
                        value={o.status || 'pending'}
                        onChange={e => changeStatus(o.id, e.target.value, o.customerName)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${ORDER_STATUSES[o.status as keyof typeof ORDER_STATUSES]?.color || 'bg-gray-100'}`}
                      >
                        {Object.entries(ORDER_STATUSES).map(([key,val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {o.createdAt?.toDate?.()?.toLocaleDateString('ar-EG') || '—'}
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setSelected(o)} className="text-[#0B2E63] hover:text-blue-600 font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        عرض
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <h2 className="font-extrabold text-gray-900 text-lg">تفاصيل الطلب</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              {[
                ['العميل', selected.customerName],
                ['الهاتف', selected.customerPhone],
                ['الخدمة', selected.service || selected.productName],
                ['المبلغ', selected.amount ? `${selected.amount} ج.م` : '—'],
                ['الحالة', ORDER_STATUSES[selected.status as keyof typeof ORDER_STATUSES]?.label || selected.status],
                ['ملاحظات', selected.notes],
              ].map(([label, value]) => value ? (
                <div key={label} className="flex gap-3 border-b border-gray-50 pb-2">
                  <dt className="text-gray-400 font-semibold w-20 flex-shrink-0">{label}</dt>
                  <dd className="text-gray-800 font-medium">{value}</dd>
                </div>
              ) : null)}
            </dl>
            <div className="mt-5 flex gap-3">
              <a href={`https://wa.me/${selected.customerPhone?.replace(/^0/, '20')}`} target="_blank"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm text-center transition-colors">
                💬 واتساب
              </a>
              <button onClick={() => setSelected(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
