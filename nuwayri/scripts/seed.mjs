/**
 * سكريبت تهيئة Firebase بالبيانات الأولية
 * ============================================
 * الاستخدام:
 *   1. ضع ملف serviceAccount.json في نفس المجلد
 *   2. npm install firebase-admin (إذا لم يكن مثبتاً)
 *   3. node scripts/seed.mjs
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(join(__dirname, 'serviceAccount.json'), 'utf8'));
} catch {
  console.error('❌ لم يتم العثور على serviceAccount.json');
  console.error('   قم بتنزيله من Firebase Console → Project Settings → Service accounts');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const now = Timestamp.now();

// ─── DATA ──────────────────────────────────────────────────────────────────

const siteContent = {
  hero: {
    headline: 'نطبع أفكارك بجودة تليق بعلامتك التجارية',
    subheadline: 'حلول متكاملة للطباعة والتغليف والإعلانات بأحدث التقنيات وأعلى معايير الجودة.',
    btn1: 'اطلب الآن',
    btn2: 'تصفح المنتجات',
  },
  stats: {
    orders: '5000+',
    satisfaction: '98%',
    execution: '48',
    experience: '10+',
  },
  contact: {
    phone: '01000000000',
    whatsapp: '201000000000',
    email: 'info@nuwayri.com',
    address: 'شارع النصر، الفيوم، مصر',
    hours: 'السبت–الخميس: 9ص – 10م',
  },
  footer: {
    about: 'نطبع أفكارك بجودة تليق بعلامتك التجارية. خبرة أكثر من 10 سنوات في مجال الطباعة والتغليف بمصر.',
  },
  updatedAt: now,
};

const categories = [
  { name: 'بوكسات وتغليف', description: 'صناديق وأكياس وتغليف فاخر', emoji: '📦', order: 0, active: true, createdAt: now },
  { name: 'استيكرات', description: 'استيكرات رول وشيت وقصات مخصصة', emoji: '🏷️', order: 1, active: true, createdAt: now },
  { name: 'كروت شخصية', description: 'بطاقات أعمال بتشطيبات متنوعة', emoji: '💳', order: 2, active: true, createdAt: now },
  { name: 'بنرات ولوحات', description: 'لوحات إعلانية وبنرات بأحجام مختلفة', emoji: '🪧', order: 3, active: true, createdAt: now },
  { name: 'فلايرات وبروشورات', description: 'مطبوعات ترويجية متنوعة', emoji: '📄', order: 4, active: true, createdAt: now },
  { name: 'هدايا دعائية', description: 'هدايا مخصصة بشعار شركتك', emoji: '🎁', order: 5, active: true, createdAt: now },
];

const products = [
  { name: 'استيكر رول', description: 'لفات استيكر بأشكال متنوعة للمنتجات والعبوات - ورق لاصق عالي الجودة', price: 50, emoji: '🏷️', bg: 'from-sky-50 to-sky-100', stock: true, createdAt: now },
  { name: 'استيكر شيت', description: 'شيتات استيكر ملونة بقصات متعددة وطباعة زاهية', price: 30, emoji: '🗒️', bg: 'from-yellow-50 to-yellow-100', stock: true, createdAt: now },
  { name: 'بوكس هدايا', description: 'صناديق هدايا فاخرة بتشطيبات ذهبية وفضية مع طباعة ليزر', price: 120, discountPrice: 99, emoji: '📦', bg: 'from-purple-50 to-purple-100', stock: true, createdAt: now },
  { name: 'أكياس ورقية', description: 'أكياس ورقية فاخرة مطبوعة بشعارك بأحجام متنوعة', price: 15, emoji: '🛍️', bg: 'from-green-50 to-green-100', stock: true, createdAt: now },
  { name: 'رول أب', description: 'ستاندات لفافة للمعارض والفعاليات والمؤتمرات', price: 280, emoji: '🪧', bg: 'from-rose-50 to-rose-100', stock: true, createdAt: now },
  { name: 'كانفاس', description: 'طباعة كانفاس بدقة عالية للصور والأعمال الفنية والمساحات التجارية', price: 95, emoji: '🖼️', bg: 'from-orange-50 to-orange-100', stock: true, createdAt: now },
  { name: 'لوحات فوركس', description: 'لوحات إعلانية خفيفة الوزن وعالية الجودة للداخل والخارج', price: 75, emoji: '📋', bg: 'from-teal-50 to-teal-100', stock: true, createdAt: now },
  { name: 'كروت شخصية', description: 'بطاقات أعمال فاخرة بتشطيبات متنوعة: لامع، مطفي، تذهيب، نقر', price: 45, discountPrice: 35, emoji: '💳', bg: 'from-blue-50 to-blue-100', stock: true, createdAt: now },
];

const portfolio = [
  { title: 'بوكسات عطور فاخرة', category: 'تغليف', emoji: '📦', bg: 'from-[#1e3a5f] to-[#0B2E63]', span: 2, createdAt: now },
  { title: 'استيكرات منتجات طبيعية', category: 'استيكرات', emoji: '🏷️', bg: 'from-emerald-800 to-emerald-900', span: 1, createdAt: now },
  { title: 'أكياس ورقية بوتيك ملابس', category: 'تغليف', emoji: '🛍️', bg: 'from-red-800 to-red-900', span: 1, createdAt: now },
  { title: 'هوية مكاتب قانونية', category: 'هويات بصرية', emoji: '💳', bg: 'from-indigo-800 to-indigo-900', span: 1, createdAt: now },
  { title: 'رول أب فعاليات - شركة عقارات', category: 'لوحات', emoji: '🪧', bg: 'from-amber-800 to-amber-900', span: 2, createdAt: now },
  { title: 'لوحات جدارية كافيه الفردوس', category: 'لوحات', emoji: '🖼️', bg: 'from-teal-800 to-teal-900', span: 1, createdAt: now },
];

const testimonials = [
  { name: 'أحمد محمد السيد', role: 'صاحب متجر إلكتروني', text: 'جودة استثنائية في طباعة بوكسات المنتجات. فريق محترف وأسعار منافسة. بالتأكيد سأكرر التعامل مع النويري في جميع طلباتي القادمة.', rating: 5, active: true, createdAt: now },
  { name: 'نور الدين كامل', role: 'مدير تسويق', text: 'طلبت كروت شخصية وبروشورات لشركتي، والنتيجة فاقت توقعاتي. الألوان حية والورق فاخر. الاستيكرات تركت أثراً رائعاً على عملائي.', rating: 5, active: true, createdAt: now },
  { name: 'منة الله فوزي', role: 'صاحبة بوتيك', text: 'سرعة التسليم كانت مفاجأة جميلة. طلبت ١٠٠٠ كيس ورقي مطبوع وتسلمتها في يومين. الجودة ممتازة وسعر معقول جداً.', rating: 5, active: true, createdAt: now },
];

// ─── SEED ──────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🚀 بدء تهيئة Firebase...\n');

  // Site content
  await db.doc('site/content').set(siteContent);
  console.log('✅ محتوى الموقع');

  // Categories
  const batch1 = db.batch();
  categories.forEach((cat) => batch1.set(db.collection('categories').doc(), cat));
  await batch1.commit();
  console.log(`✅ ${categories.length} فئات`);

  // Products
  const batch2 = db.batch();
  products.forEach((p) => batch2.set(db.collection('products').doc(), p));
  await batch2.commit();
  console.log(`✅ ${products.length} منتجات`);

  // Portfolio
  const batch3 = db.batch();
  portfolio.forEach((p) => batch3.set(db.collection('portfolio').doc(), p));
  await batch3.commit();
  console.log(`✅ ${portfolio.length} أعمال في المعرض`);

  // Testimonials
  const batch4 = db.batch();
  testimonials.forEach((t) => batch4.set(db.collection('testimonials').doc(), t));
  await batch4.commit();
  console.log(`✅ ${testimonials.length} آراء عملاء`);

  // Sample order
  await db.collection('orders').add({
    customerName: 'أحمد محمد',
    customerPhone: '01000000000',
    service: 'كروت شخصية',
    notes: '٥٠٠ كرت، تشطيب مطفي، ورق ٣٥٠ جرام',
    amount: 225,
    status: 'pending',
    source: 'website',
    createdAt: now,
  });
  console.log('✅ طلب تجريبي');

  // Activity log
  await db.collection('activity').add({
    action: 'seed',
    details: 'تهيئة قاعدة البيانات بالبيانات الأولية',
    user: 'system',
    createdAt: now,
  });

  console.log('\n🎉 تمت التهيئة بنجاح!\n');
  console.log('الخطوات التالية:');
  console.log('  1. افتح http://localhost:3000 للموقع');
  console.log('  2. افتح http://localhost:3000/admin لوحة التحكم');
  console.log('  3. سجّل الدخول بالبريد والكلمة اللي أنشأتها في Firebase Auth\n');
}

seed().catch((err) => {
  console.error('❌ خطأ:', err.message);
  process.exit(1);
});
