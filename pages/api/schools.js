import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import { getPool } from '../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    uploadDir, 
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files, uploadDir });
    });
  });
}

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, name, address, city, image FROM schools ORDER BY id DESC');
      return res.status(200).json({ success: true, data: rows });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: 'Database error fetching schools.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { fields, files, uploadDir } = await parseForm(req);

      const name = (fields.name || '').toString().trim();
      const address = (fields.address || '').toString().trim();
      const city = (fields.city || '').toString().trim();
      const state = (fields.state || '').toString().trim();
      const contact = (fields.contact || '').toString().trim();
      const email_id = (fields.email_id || '').toString().trim();

      if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_id)) {
        return res.status(400).json({ success: false, message: 'Invalid email.' });
      }
      const contactRegex = /^[0-9]{7,15}$/;
      if (!contactRegex.test(contact)) {
        return res.status(400).json({ success: false, message: 'Invalid contact number.' });
      }

      let imagePath = null;
      if (files && files.image) {
        const img = Array.isArray(files.image) ? files.image[0] : files.image;
        const ext = path.extname(img.originalFilename || img.newFilename || '.jpg').toLowerCase() || '.jpg';
        const safeBase = path.basename((img.originalFilename || 'school').replace(/[^a-z0-9-_\.]/gi, '_'), ext);
        const filename = `${Date.now()}_${safeBase}${ext}`.replace('__', '_');
        const finalPath = path.join(uploadDir, filename);


        try {
          fs.renameSync(img.filepath || img.filepath === '' ? img.filepath : img._writeStream?.path, finalPath);
        } catch (err) {
          // fallback: copy then unlink
          fs.copyFileSync(img.filepath || img._writeStream?.path, finalPath);
          fs.unlinkSync(img.filepath || img._writeStream?.path);
        }

        imagePath = `/schoolImages/${filename}`;
      } else {
        return res.status(400).json({ success: false, message: 'Image is required.' });
      }

      const [result] = await pool.query(
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, imagePath, email_id]
      );

      return res.status(201).json({ success: true, id: result.insertId, image: imagePath });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: 'Error processing request.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
