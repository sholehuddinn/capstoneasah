
# 🚀 Project Setup (Docker + Bun + PostgreSQL + Redis)

Project ini menggunakan **Docker Compose**, **Bun**, **PostgreSQL**, dan **Redis**.  
Ikuti langkah berikut untuk menjalankannya dari awal hingga siap digunakan.

---

## 📌 1. Persyaratan

Pastikan sudah menginstall:

- Docker
- Docker Compose
- Bun (opsional jika ingin menjalankan tanpa Docker)
- cari di owner / buat sendiri .env, Dockerfile dan docker-compose.yml nya

---

## 📌 2. Menjalankan Semua Service

Untuk menjalankan seluruh container (app, PostgreSQL, Redis):

```sh
docker compose up -d
````

Perintah ini akan menjalankan container dalam mode background.

Cek apakah container sudah berjalan:

```sh
docker ps
```

---

## 📌 3. Masuk ke Dalam Container `bun_app`

Setelah container berjalan, masuk ke terminal aplikasi:

```sh
docker exec -it bun_app sh
```

Atau jika kontainernya menggunakan bash:

```sh
docker exec -it bun_app bash
```

---

## 📌 4. Jalankan Migration Database

Setelah berada di dalam container, jalankan migration:

```sh
bun migrate_up
```


Atau hanya menurunkan migration:

```sh
bun migrate_down
```

---

## 📌 5. Melihat Log Aplikasi

Jika ingin melihat log container:

```sh
docker logs -f bun_app
```

---

## 📌 6. Menghentikan Semua Container

Jika ingin menghentikan project:

```sh
docker compose down
```

---

## 📁 Struktur Project (Ringkas)

```
.
├── src/
├── migrations/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 🧪 Testing Lokal (Opsional)

Jika kamu ingin menjalankan project tanpa Docker:

```sh
bun install
bun dev
```

---
