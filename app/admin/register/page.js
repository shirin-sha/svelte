'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to register admin user');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Create Admin Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ width: '100%', marginBottom: 12, padding: 8 }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ width: '100%', marginBottom: 12, padding: 8 }} 
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2563eb', color: 'white', border: 'none', borderRadius: 4 }}>
          Create Admin
        </button>
        {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <a href="/admin/login" style={{ color: '#2563eb' }}>Already have an account? Login</a>
      </div>
    </div>
  );
} 