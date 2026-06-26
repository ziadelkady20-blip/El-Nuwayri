#!/bin/bash
# تشغيل سكريبت تهيئة Firebase
# ضع ملف serviceAccount.json في مجلد scripts/ أولاً

cd "$(dirname "$0")/.."
node scripts/seed.mjs
