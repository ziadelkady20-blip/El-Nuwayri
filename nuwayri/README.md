# 🖨️ مطبعة النويري — موقع احترافي + لوحة تحكم Firebase

## ✅ ما تم بناؤه
- الموقع الرئيسي: Next.js 15 + Tailwind CSS + RTL كامل
- لوحة تحكم إدارية محمية بـ Firebase Auth
- Firebase Realtime: أي تغيير في الأدمن يظهر فوراً على الموقع
- Firebase Storage: رفع صور المنتجات والمعرض

---

## 🚀 خطوات الإعداد

### 1. إنشاء مشروع Firebase
1. اذهب إلى https://console.firebase.google.com
2. انقر Add project → اسم: nuwayri-print

### 2. إعداد الخدمات
- Firestore Database → Create database → production mode → europe-west1
- Storage → Get started
- Authentication → Get started → فعّل Email/Password

### 3. نسخ Rules
- Firestore Rules: انسخ محتوى firestore.rules
- Storage Rules: انسخ محتوى storage.rules

### 4. إنشاء حساب الأدمن
Authentication → Add user → admin@nuwayri.com + كلمة مرور
ثم Firestore → أضف وثيقة:
  Collection: admins
  Document ID: (UID المستخدم)
  Fields: role: "superadmin"

### 5. ملف البيئة
cp .env.example .env.local
واملأ القيم من Firebase Console → Project Settings

### 6. التشغيل
npm install
npm run dev

### 7. النشر
vercel  (أضف env variables في Vercel Dashboard)

---

## 📁 هيكل المشروع
src/app/ → الصفحات
src/app/admin/ → لوحة التحكم
src/components/ → المكونات
src/lib/ → Firebase helpers

## 🔥 Firestore Collections
site, categories, products, portfolio, orders, testimonials, admins, activity
