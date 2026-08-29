# Panduan Deployment - Website Aspacindo Kedaton Motor (Hostinger Shared / Business Hosting)

Panduan ini berisi langkah-langkah deployment end-to-end untuk mendeploy website **Yamaha Aspacindo Kedaton Motor** dari lingkungan development lokal ke hosting **Hostinger Shared / Business Hosting**.

---

## Prerequisites & Spesifikasi Hosting Target
- **PHP**: 8.2 atau 8.3 (Aktifkan ekstensi: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `curl`, `gd`, `fileinfo`)
- **Database**: MySQL 8.0+
- **Domain**: Domain utama (misal: `aspacindo.com` atau `yamaha.aspacindo.com`)
- **Note Penting**: Shared hosting tidak menjalankan Node.js runtime secara persistent. Karena itu, **proses kompilasi Vite (npm run build) WAJIB dilakukan di komputer lokal sebelum upload**.

---

## Langkah 1: Kompilasi Production Assets di Lokal

Di direktori project lokal (komputer Anda), jalankan perintah berikut untuk mengompilasi CSS/JS:

```bash
cmd /c "npm run build"
```

Pastikan folder `public/build/` dan file `public/build/manifest.json` telah terbentuk dengan sempurna.

---

## Langkah 2: Persiapan File Upload

Buat arsip `.zip` berisi seluruh file project **KECUALI** folder/file berikut:
- ❌ `node_modules/` (HAPUS / JANGAN DI-UPLOAD)
- ❌ `.env` (Lokal dev env, jangan di-upload)
- ❌ `.git/` & `.github/`
- ❌ `tests/` (Optional, tidak dibutuhkan di production)

**File & Folder Wajib Di-Upload:**
- ✅ `app/`, `bootstrap/`, `config/`, `database/`, `public/` (termasuk `public/build`), `resources/`, `routes/`, `storage/`, `vendor/` (atau jalankan `composer install` via SSH Hostinger), `composer.json`, `artisan`.

---

## Langkah 3: Upload ke Hostinger File Manager / FTP

1. Login ke **Hostinger hPanel** &rarr; Buka **File Manager**.
2. Masuk ke folder root domain Anda (misalnya `/public_html` atau `/domains/aspacindo.com/public_html`).
3. Upload file `.zip` project Anda dan **Extract** di direktori tersebut.
4. Buat Symlink Storage:
   - Jika Anda memiliki akses SSH di Hostinger, jalankan:
     ```bash
     php artisan storage:link
     ```
   - Jika tidak ada SSH, Anda bisa membuat symlink via skrip PHP sederhana atau Cron Job sementara.

---

## Langkah 4: Buat Database MySQL di Hostinger hPanel

1. Di hPanel, buka **Databases** &rarr; **Management**.
2. Buat database baru, contoh:
   - **Nama Database**: `u123456789_aspacindo`
   - **Username**: `u123456789_user`
   - **Password**: `PasswordKuat123!`
3. Catat info database tersebut untuk konfigurasi `.env`.

---

## Langkah 5: Konfigurasi File `.env` Production

Buat file `.env` di direktori root project Hostinger Anda dan isikan konfigurasi berikut:

```ini
APP_NAME="Aspacindo Kedaton Motor"
APP_ENV=production
APP_KEY=base64:... (Salin dari APP_KEY lokal atau jalankan php artisan key:generate)
APP_DEBUG=false
APP_URL=https://aspacindo.com

LOG_CHANNEL=daily
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u123456789_aspacindo
DB_USERNAME=u123456789_user
DB_PASSWORD=PasswordKuat123!

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
SESSION_DRIVER=file
SESSION_LIFETIME=120

# GOOGLE OAUTH SOCIALITE (LOYALTY PORTAL)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://aspacindo.com/auth/google/callback
```

---

## Langkah 6: Jalankan Database Migration & Seed

Via SSH Hostinger:
```bash
php artisan migrate --force --seed
```

Atau jika tidak ada SSH, impor file `database.sql` awal via phpMyAdmin Hostinger.

---

## Langkah 7: Setting Cron Job (Laravel Scheduler) di Hostinger hPanel

Untuk menjalankan otomatisasi **Rekalkulasi Tier Loyalty** dan **Poin Kadaluarsa**, daftarkan Cron Job di Hostinger:

1. Di hPanel, cari menu **Cron Jobs**.
2. Pilih **Custom Cron Job**.
3. Atur jadwal ke: `* * * * *` (Setiap Menit).
4. Masukkan perintah command:
   ```bash
   cd /home/u123456789/domains/aspacindo.com/public_html && php artisan schedule:run >> /dev/null 2>&1
   ```
   *(Sesuaikan path direktori `/home/u123456789/...` dengan path sebenarnya di Hostinger Anda)*.

---

## Langkah 8: Verifikasi Deployment

1. Akses `https://aspacindo.com` di browser:
   - Verifikasi Homepage, Katalog Motor, Booking Service, Lokasi Dealer.
2. Akses `https://aspacindo.com/sitemap.xml`:
   - Verifikasi output XML Sitemap.
3. Akses `https://aspacindo.com/robots.txt`:
   - Verifikasi aturan robots crawler.
4. Uji Login Google OAuth di `/loyalty`:
   - Pastikan OAuth Callback terdaftar di Google Cloud Console.
5. Akses Admin Panel di `https://aspacindo.com/admin`:
   - Login dengan akun Admin/Staff.
