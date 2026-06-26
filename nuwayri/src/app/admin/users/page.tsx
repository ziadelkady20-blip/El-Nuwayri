'use client';
import { useEffect, useState } from 'react';
import { getActivityLog } from '@/lib/firestore';

const ROLES = [
  { key:'superadmin', label:'Super Admin', color:'bg-amber-100 text-amber-800', desc:'صلاحيات كاملة بلا قيود', perms:['المنتجات','الطلبات','المستخدمين','المحتوى','الإعدادات'] },
  { key:'manager', label:'Manager', color:'bg-blue-100 text-blue-800', desc:'إدارة المنتجات والطلبات', perms:['المنتجات','الطلبات','المحتوى'] },
  { key:'editor', label:'Editor', color:'bg-purple-100 text-purple-800', desc:'إدارة المحتوى فقط', perms:['المحتوى','الوسائط'] },
];

export function UsersPage() {
  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">المستخدمون والأدوار</h1>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLES.map(r => (
            <div key={r.key} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.color}`}>{r.label}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{r.desc}</p>
              <div className="flex flex-col gap-2">
                {['المنتجات','الطلبات','المستخدمين','المحتوى','الوسائط','الإعدادات'].map(perm => (
                  <div key={perm} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{perm}</span>
                    <span className={r.perms.includes(perm) ? 'text-green-500 font-bold' : 'text-gray-300'}>
                      {r.perms.includes(perm) ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note about adding users */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-700">
          <strong>ملاحظة:</strong> لإضافة مستخدمين جدد، قم بإنشاء حساب في Firebase Authentication ثم أضف وثيقة في مجموعة{' '}
          <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">admins</code> بـ UID الخاص بهم وحقل <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">role</code>.
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
