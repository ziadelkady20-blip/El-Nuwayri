import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, onSnapshot, serverTimestamp, setDoc, where
} from 'firebase/firestore';
import { db } from './firebase';

// ─── SITE CONTENT ────────────────────────────────────────────────────────────
export async function getSiteContent() {
  const snap = await getDoc(doc(db, 'site', 'content'));
  return snap.exists() ? snap.data() : getDefaultContent();
}

export async function updateSiteContent(data: Record<string, any>) {
  await setDoc(doc(db, 'site', 'content'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

function getDefaultContent() {
  return {
    hero: {
      headline: 'نطبع أفكارك بجودة تليق بعلامتك التجارية',
      subheadline: 'حلول متكاملة للطباعة والتغليف والإعلانات بأحدث التقنيات وأعلى معايير الجودة.',
      btn1: 'اطلب الآن',
      btn2: 'تصفح المنتجات',
    },
    stats: { orders: '5000+', satisfaction: '98%', execution: '48', experience: '10+' },
    contact: {
      phone: '01000000000',
      email: 'info@nuwayri.com',
      address: 'شارع النصر، الفيوم، مصر',
      hours: 'السبت–الخميس: 9ص – 10م',
      whatsapp: '201000000000',
    },
    footer: { about: 'نطبع أفكارك بجودة تليق بعلامتك التجارية. خبرة أكثر من 10 سنوات.' },
  };
}

export function subscribeToSiteContent(cb: (data: any) => void) {
  return onSnapshot(doc(db, 'site', 'content'), (snap) => {
    cb(snap.exists() ? snap.data() : getDefaultContent());
  });
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export async function getCategories() {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addCategory(data: any) {
  return addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() });
}

export async function updateCategory(id: string, data: any) {
  await updateDoc(doc(db, 'categories', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, 'categories', id));
}

export function subscribeToCategories(cb: (data: any[]) => void) {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export async function getProducts(categoryId?: string) {
  const q = categoryId
    ? query(collection(db, 'products'), where('categoryId', '==', categoryId), orderBy('createdAt', 'desc'))
    : query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getProduct(id: string) {
  const snap = await getDoc(doc(db, 'products', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addProduct(data: any) {
  return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id: string, data: any) {
  await updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

export function subscribeToProducts(cb: (data: any[]) => void) {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────
export async function getPortfolio(category?: string) {
  const q = category
    ? query(collection(db, 'portfolio'), where('category', '==', category), orderBy('createdAt', 'desc'))
    : query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addPortfolioItem(data: any) {
  return addDoc(collection(db, 'portfolio'), { ...data, createdAt: serverTimestamp() });
}

export async function updatePortfolioItem(id: string, data: any) {
  await updateDoc(doc(db, 'portfolio', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePortfolioItem(id: string) {
  await deleteDoc(doc(db, 'portfolio', id));
}

export function subscribeToPortfolio(cb: (data: any[]) => void) {
  const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────
export const ORDER_STATUSES = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  review: { label: 'تحت المراجعة', color: 'bg-blue-100 text-blue-800' },
  production: { label: 'في الطباعة', color: 'bg-purple-100 text-purple-800' },
  ready: { label: 'جاهز للشحن', color: 'bg-green-100 text-green-700' },
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-900' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' },
};

export async function getOrders() {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addOrder(data: any) {
  return addDoc(collection(db, 'orders'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function updateOrderStatus(id: string, status: string) {
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() });
}

export async function updateOrder(id: string, data: any) {
  await updateDoc(doc(db, 'orders', id), { ...data, updatedAt: serverTimestamp() });
}

export function subscribeToOrders(cb: (data: any[]) => void) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export async function getTestimonials() {
  const q = query(collection(db, 'testimonials'), where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addTestimonial(data: any) {
  return addDoc(collection(db, 'testimonials'), { ...data, active: true, createdAt: serverTimestamp() });
}

export async function updateTestimonial(id: string, data: any) {
  await updateDoc(doc(db, 'testimonials', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTestimonial(id: string) {
  await deleteDoc(doc(db, 'testimonials', id));
}

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────
export async function logActivity(action: string, details: string, user: string = 'admin') {
  await addDoc(collection(db, 'activity'), {
    action, details, user,
    createdAt: serverTimestamp(),
  });
}

export async function getActivityLog() {
  const q = query(collection(db, 'activity'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── STATS ────────────────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [ordersSnap, productsSnap] = await Promise.all([
    getDocs(collection(db, 'orders')),
    getDocs(collection(db, 'products')),
  ]);
  const orders = ordersSnap.docs.map(d => d.data());
  const totalRevenue = orders.filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  return {
    totalOrders: orders.length,
    totalRevenue,
    totalProducts: productsSnap.size,
    statusCounts,
    pendingOrders: statusCounts['pending'] || 0,
    inProduction: statusCounts['production'] || 0,
  };
}
