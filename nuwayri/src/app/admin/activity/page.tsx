'use client';
import { useEffect, useState } from 'react';
import { getActivityLog } from '@/lib/firestore';

const ACTION_ICONS: Record<string, string> = {
  add_product:'📦', update_product:'✏️', delete_product:'🗑️',
  add_category:'🗂️', update_category:'✏️', delete_category:'🗑️',
  new_order:'🛒', update_order:'🔄',
  update_content:'📝', portfolio:'🖼️',
  default:'📋',
};

const ACTION_COLORS: Record<string, string> = {
  add_product:'bg-green-50 text-green-600', update_product:'bg-blue-50 text-blue-600',
  delete_product:'bg-red-50 text-red-600', new_order:'bg-amber-50 text-amber-600',
  update_order:'bg-purple-50 text-purple-600', update_content:'bg-teal-50 text-teal-600',
  default:'bg-gray-50 text-gray-600',
};

export default function ActivityPage() {
  const [log, setLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLog().then(data => { setLog(data); setLoading(false); });
  }, []);

  function formatDate(ts: any) {
    if (!ts?.toDate) return '—';
    const d = ts.toDate();
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'منذ لحظات';
    if (diff < 3600000) return `منذ ${Math.round(diff/60000)} دقيقة`;
    if (diff < 86400000) return `منذ ${Math.round(diff/3600000)} ساعة`;
    return d.toLocaleDateString('ar-EG');
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">سجل النشاط</h1>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#0B2E63] border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : log.length === 0 ? (
            <div className="text-center py-16 text-gray-300">
              <div className="text-4xl mb-3">📋</div>
              <p>لا توجد أنشطة بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {log.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${ACTION_COLORS[item.action]||ACTION_COLORS.default}`}>
                    {ACTION_ICONS[item.action]||ACTION_ICONS.default}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-semibold">{item.details}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{item.user}</span>
                      <span className="text-gray-200">•</span>
                      <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
