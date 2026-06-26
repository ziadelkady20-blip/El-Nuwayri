'use client';
import { useEffect, useState, useRef } from 'react';
import { listMediaFiles, uploadFile, deleteFile } from '@/lib/storage';
import toast from 'react-hot-toast';

export default function MediaPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadFiles() {
    try {
      const data = await listMediaFiles('media');
      setFiles(data);
    } catch { setFiles([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadFiles(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setUploading(true);
    try {
      for (const file of selected) {
        await uploadFile(file, `media/${Date.now()}_${file.name}`, setProgress);
      }
      toast.success(`تم رفع ${selected.length} ملف بنجاح`);
      await loadFiles();
    } catch { toast.error('حدث خطأ أثناء الرفع'); }
    finally { setUploading(false); setProgress(0); if(fileRef.current) fileRef.current.value=''; }
  }

  async function handleDelete(url: string, name: string) {
    if (!confirm(`حذف "${name}"؟`)) return;
    try {
      await deleteFile(url);
      setFiles(f => f.filter(fi => fi.url !== url));
      toast.success('تم الحذف');
    } catch { toast.error('لا يمكن حذف الملف'); }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success('تم نسخ الرابط!');
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-extrabold text-gray-900">مكتبة الوسائط</h1>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          ↑ رفع صور
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload}/>

      <div className="p-6">
        {/* Upload zone */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all mb-6"
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-4xl mb-3">☁️</div>
          <p className="font-semibold text-gray-600 text-sm">اسحب الصور هنا أو انقر للاختيار</p>
          <p className="text-xs text-gray-400 mt-1">PNG، JPG، WebP — حتى 10MB لكل ملف</p>
          {uploading && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0B2E63] transition-all" style={{width:`${progress}%`}}/>
              </div>
              <p className="text-xs text-gray-400 mt-1">{progress}% جارٍ الرفع...</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(12)].map((_,i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"/>)}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <div className="text-5xl mb-3">📁</div>
            <p className="font-semibold text-sm">لا توجد ملفات بعد</p>
          </div>
        ) : (
          <>
            <div className="text-xs text-gray-400 font-semibold mb-3">{files.length} ملف</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {files.map(f => (
                <div key={f.url} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <button onClick={() => copyUrl(f.url)} className="bg-white text-gray-800 font-bold text-xs px-2 py-1 rounded-lg w-full text-center hover:bg-gray-100">
                      نسخ الرابط
                    </button>
                    <button onClick={() => handleDelete(f.url, f.name)} className="bg-red-500 text-white font-bold text-xs px-2 py-1 rounded-lg w-full text-center hover:bg-red-600">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
