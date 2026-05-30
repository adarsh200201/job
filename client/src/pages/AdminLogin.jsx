import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/login', { username, password });
      login(data.token, data.username, true);
      navigate('/admin');
    } catch (e) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-5 admin-login">
        <div className="card p-4 shadow-sm">
          <h1 className="h4 mb-3 text-center">Admin Login</h1>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={onSubmit} className="d-grid gap-3">
            <div>
              <label className="form-label">Username</label>
              <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
