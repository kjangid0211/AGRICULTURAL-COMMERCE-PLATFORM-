import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

const AdminLogin = () => {
  const { user, login } = useContext(AuthContext);
  const { showToast } = useContext(AppContext);
  const [email, setEmail] = useState('admin@agri.com');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      showToast('Admin logged in successfully!', 'success');
      navigate('/admin');
    } catch (error) {
      showToast(error.message || 'Login credentials invalid', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '450px' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-serif" style={{ fontSize: '2rem', color: 'var(--primary-green)' }}>
            🌾 Admin Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Enter your administrative credentials to manage settings.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="admin@agri.com"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Verifying Access...' : 'Authenticate Securely'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--bg-cream)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)' }}>
          <strong>Demo Credentials:</strong> <br/>
          Email: <code style={{ color: 'var(--primary-green)' }}>admin@agri.com</code> <br/>
          Password: <code style={{ color: 'var(--primary-green)' }}>admin123</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
