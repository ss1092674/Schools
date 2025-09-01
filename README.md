# Schools Directory (Next.js + MySQL)

Two pages:
- `pages/addSchool.jsx` – Add a school with validation (react-hook-form) and image upload to `public/schoolImages`.
- `pages/showSchools.jsx` – Display schools similar to an e‑commerce grid (name, address, city, image).

## Database

Create database and table (adjust DB name as needed):
```sql
CREATE DATABASE IF NOT EXISTS schooldb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE schooldb;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact BIGINT NOT NULL,
  image TEXT NOT NULL,
  email_id TEXT NOT NULL
);
```

## Setup

1. Copy `.env.local.example` to `.env.local` and set your MySQL credentials.
2. Install deps and run dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000`

## Notes on Hosting

- The API saves uploaded images to `public/schoolImages`. On serverless hosts like Vercel/Netlify, runtime file writes are **ephemeral** and not persisted across deployments or server restarts. For production hosting, use a VM/container with persistent storage, or swap image storage to S3/Cloudinary and store only the URL in MySQL.
- For local evaluation and grading, this project works as‑is.

## Tech

- Next.js 14
- react-hook-form for client validations
- MySQL (mysql2/promise)
- formidable for multipart form parsing on API route
