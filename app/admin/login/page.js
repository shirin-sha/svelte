'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/cms/home');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 40, maxWidth: 420, width: '100%' }}>
        <div className="sec-title text-center" style={{ marginBottom: 24 }}>
          <div className="sub-title">
            <h5>ADMIN PANEL</h5>
          </div>
          <h2>Sign In</h2>
          <div className="icon" style={{ marginTop: 8 }}>
            <span className="icon-user-2"></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151', fontSize: 14 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 40px 12px 14px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280'
                }}
              >
                <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} style={{ fontSize: 16 }}></i>
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: 8, fontSize: 14, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="thm-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <span className="txt">{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
          Secure access to website administration
        </div>
      </div>
    </div>
  );
} 