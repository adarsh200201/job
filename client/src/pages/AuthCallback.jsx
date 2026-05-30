import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get('token');
    const name  = params.get('name') || 'User';
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=1', { replace: true });
      return;
    }

    login(token, name, false);
    navigate('/dashboard', { replace: true });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ fontSize: '1.1rem', color: '#555' }}>Signing you in…</p>
    </div>
  );
}
