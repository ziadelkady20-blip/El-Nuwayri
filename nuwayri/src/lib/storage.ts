import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        onProgress?.(Math.round(pct));
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function deleteFile(url: string) {
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
}

export async function listMediaFiles(folder: string = 'media') {
  const folderRef = ref(storage, folder);
  const result = await listAll(folderRef);
  const files = await Promise.all(
    result.items.map(async (item) => ({
      name: item.name,
      path: item.fullPath,
      url: await getDownloadURL(item),
    }))
  );
  return files;
}
