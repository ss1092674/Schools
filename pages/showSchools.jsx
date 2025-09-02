import Image from 'next/image';
import { getPool } from '../lib/db';

export default function ShowSchools({ schools }) {
  return (
    <main style={{maxWidth: 1200, margin: '0 auto', padding: '1rem', fontFamily: 'system-ui, Arial'}}>
      <h1>Schools</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
        {schools.map((s) => (
          <article key={s.id} style={{border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden'}}>
            <div style={{position:'relative', width: '100%', height: 160, background:'#f9fafb'}}>
              {s.image && (
                <Image 
                  src={s.image} 
                  alt={s.name} 
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              )}
            </div>
            <div style={{padding: '0.75rem'}}>
              <h3 style={{margin: 0, fontSize: '1.05rem'}}>{s.name}</h3>
              <p style={{margin: '0.25rem 0', color:'#374151'}}>{s.address}</p>
              <p style={{margin: 0, color:'#6b7280'}}>{s.city}</p>
            </div>
          </article>
        ))}
      </div>
      <div style={{marginTop:'1rem'}}>
        <a href="/addSchool" style={{textDecoration:'underline'}}>+ Add another school</a>
      </div>
      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*='grid-template-columns'] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          div[style*='grid-template-columns'] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          div[style*='grid-template-columns'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

export async function getServerSideProps() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT id, name, address, city, image FROM schools ORDER BY id DESC');
  return { props: { schools: JSON.parse(JSON.stringify(rows)) } };
}
