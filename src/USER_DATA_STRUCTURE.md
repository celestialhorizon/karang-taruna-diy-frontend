# Struktur Data Pengguna

## Overview
Dokumen ini menjelaskan struktur data lengkap untuk pengguna dalam aplikasi DIY Tutorial Karang Taruna.

## Struktur Data User

```typescript
{
  // Field Wajib
  name: string,              // Nama lengkap
  username: string,          // Username (unique)
  email: string,             // Email (unique)
  password: string,          // Password (minimal 6 karakter)
  karangTarunaName: string,  // Nama karang taruna
  address: {
    provinsi: string,        // Provinsi
    kabupatenKota: string,   // Kabupaten/Kota
    kecamatan: string,       // Kecamatan
    jalan: string            // Jalan/alamat detail
  },
  
  // Field Opsional
  phone?: string,            // Nomor telepon
  interests?: string[],      // Array minat DIY (bisa lebih dari satu)
  skillLevel?: string,       // Tingkat keahlian
  role?: string,             // Peran anggota dalam karang taruna
  
  // Field Otomatis
  createdAt: string          // ISO timestamp registrasi
}
```

## Kategori Minat DIY

Pengguna dapat memilih lebih dari satu kategori:
- Pertukangan Kayu
- Pengecatan
- Listrik
- Plambing
- Perawatan

## Tingkat Keahlian

Pilihan tingkat keahlian:
- Pemula
- Menengah
- Mahir

## Contoh Data User Lengkap

```json
{
  "name": "Ahmad Wijaya",
  "username": "ahmadw",
  "email": "ahmad@mail.com",
  "password": "password123",
  "karangTarunaName": "Karang Taruna Mekar Jaya",
  "address": {
    "provinsi": "Jawa Barat",
    "kabupatenKota": "Bandung",
    "kecamatan": "Cibiru",
    "jalan": "Jl. Raya Cibiru No. 123"
  },
  "phone": "081234567890",
  "interests": ["Pertukangan Kayu", "Pengecatan"],
  "skillLevel": "Pemula",
  "role": "Ketua",
  "createdAt": "2026-02-09T10:30:00.000Z"
}
```

## Fitur Pendukung

### Halaman Registrasi
- Form dengan validasi lengkap untuk semua field wajib
- Checkboxes untuk minat DIY (multi-select)
- Select dropdown untuk tingkat keahlian
- Validasi email dan username yang unik
- Validasi password minimal 6 karakter dan konfirmasi password

### Halaman Admin - User Management
- Tampilan tabel dengan kolom: Nama, Username, Email, Karang Taruna, Tutorial, Tanggal Registrasi
- Fungsi search yang mencari di: nama, email, username, karang taruna
- Dialog detail yang menampilkan semua informasi user termasuk:
  - Data pribadi lengkap
  - Informasi karang taruna
  - Wilayah domisili lengkap
  - Minat DIY dalam bentuk badge
  - Tingkat keahlian
  - Progress belajar
- Form tambah/edit user dengan semua field
- Export data ke CSV dengan semua field user

## Storage

Data disimpan di localStorage dengan key:
- `diy_users`: Array semua user
- `diy_current_user`: User yang sedang login
- `learning_{email}`: Progress belajar per user

## Backward Compatibility

Sistem dapat menangani user lama yang belum memiliki field baru dengan menggunakan optional chaining (?.) dan nilai default (-) pada tampilan.
