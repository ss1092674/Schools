import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [serverMsg, setServerMsg] = useState(null);

  const onSubmit = async (data) => {
    try {
      setServerMsg(null);
      const formData = new FormData();
      Object.keys(data).forEach((k) => {
        if (k === 'image') {
          if (data.image && data.image[0]) formData.append('image', data.image[0]);
        } else {
          formData.append(k, data[k]);
        }
      });

      const res = await fetch('/api/schools', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to save.');
      setServerMsg({ type: 'success', text: 'School saved successfully!' });
      reset();
    } catch (e) {
      setServerMsg({ type: 'error', text: e.message });
    }
  };

  return (
    <main style={{maxWidth: 900, margin: '0 auto', padding: '1rem', fontFamily: 'system-ui, Arial'}}>
      <h1>Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
        <div style={{gridColumn: '1 / -1'}}>
          <label>School Name</label><br/>
          <input placeholder="e.g., Green Valley High" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })} style={{width:'100%', padding: '0.6rem'}}/>
          {errors.name && <span style={{color:'crimson'}}>{errors.name.message}</span>}
        </div>

        <div style={{gridColumn: '1 / -1'}}>
          <label>Address</label><br/>
          <input placeholder="Street, Area" {...register('address', { required: 'Address is required' })} style={{width:'100%', padding: '0.6rem'}}/>
          {errors.address && <span style={{color:'crimson'}}>{errors.address.message}</span>}
        </div>

        <div>
          <label>City</label><br/>
          <input placeholder="City" {...register('city', { required: 'City is required' })} style={{width:'100%', padding: '0.6rem'}}/>
          {errors.city && <span style={{color:'crimson'}}>{errors.city.message}</span>}
        </div>

        <div>
          <label>State</label><br/>
          <input placeholder="State" {...register('state', { required: 'State is required' })} style={{width:'100%', padding: '0.6rem'}}/>
          {errors.state && <span style={{color:'crimson'}}>{errors.state.message}</span>}
        </div>

        <div>
          <label>Contact (7-15 digits)</label><br/>
          <input placeholder="e.g., 9876543210" {...register('contact', { required: 'Contact is required', pattern: { value: /^[0-9]{7,15}$/, message: 'Invalid contact number' } })} style={{width:'100%', padding: '0.6rem'}}/>
          {errors.contact && <span style={{color:'crimson'}}>{errors.contact.message}</span>}
        </div>

        <div>
          <label>Email</label><br/>
          <input type="email" placeholder="e.g., info@school.com" {...register('email_id', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} style={{width:'100%', padding: '0.6rem'}}/>
          {errors.email_id && <span style={{color:'crimson'}}>{errors.email_id.message}</span>}
        </div>

        <div style={{gridColumn: '1 / -1'}}>
          <label>School Image</label><br/>
          <input type="file" accept="image/*" {...register('image', { required: 'Image is required' })} />
          {errors.image && <span style={{color:'crimson', display:'block'}}>{errors.image.message}</span>}
          <small>Accepted: jpg, png, webp up to ~5MB .</small>
        </div>

        <div style={{gridColumn: '1 / -1', display:'flex', gap:'1rem', alignItems:'center'}}>
          <button type="submit" disabled={isSubmitting} style={{padding: '0.7rem 1.2rem', border: 0, background: '#0ea5e9', color:'#fff', borderRadius: 8}}>
            {isSubmitting ? 'Saving...' : 'Save School'}
          </button>
          <a href="/showSchools" style={{textDecoration:'underline'}}>Go to School List</a>
        </div>
      </form>

      {serverMsg && (
        <p role="alert" style={{marginTop:'1rem', color: serverMsg.type === 'success' ? 'green' : 'crimson'}}>
          {serverMsg.text}
        </p>
      )}

      <style jsx>{`
        @media (max-width: 640px) {
          form { grid-template-columns: 1fr; }
        }
        label { font-weight: 600; }
        input { border: 1px solid #ddd; border-radius: 8px; }
      `}</style>
    </main>
  );
}
