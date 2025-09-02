import formidable from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getPool } from '../../lib/db';

export const config = {
  api: {
    bodyParser: false, // file upload के लिए bodyParser disable करना जरूरी है
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: 'Form parsing error' });

        const { name, address, city, state, contact, email_id } = fields;
        const imageFile = files.image?.[0];

        if (!imageFile) {
          return res.status(400).json({ message: 'Image is required' });
        }

        // Upload image to S3
        const fileContent = fs.readFileSync(imageFile.filepath);
        const fileName = `${Date.now()}-${imageFile.originalFilename}`;

        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileName,
          Body: fileContent,
          ContentType: imageFile.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        // Save to MySQL
        const pool = getPool();
        const [result] = await pool.query(
          'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, address, city, state, contact, email_id, imageUrl]
        );

        return res.status(200).json({ message: 'School saved successfully', id: result.insertId });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM schools ORDER BY id DESC');
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: 'DB fetch error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
