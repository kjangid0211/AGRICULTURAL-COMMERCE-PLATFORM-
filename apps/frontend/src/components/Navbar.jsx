import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { mode, toggleMode, getCartCount, settings } = useContext(AppContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const brandName = settings?.websiteName || 'AgriCommerce';
  const brandLogo = settings?.logoPlaceholder || '🌾';

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          <span style={{ marginRight: '0.25rem' }}>{brandLogo}</span>
          <span>{brandName}</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Catalog
            </Link>
          </li>
          <li>
            <Link to="/page/about_us" className={`nav-link ${isActive('/page/about_us') ? 'active' : ''}`}>
              About
            </Link>
          </li>
          {mode === 'B2C' ? (
            <li>
              <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'active' : ''}`}>
                Cart ({getCartCount()})
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/products?enquire=general" className="nav-link" style={{ color: 'var(--accent-brown)', fontWeight: '600' }}>
                💼 B2B Enquiry
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li>
                <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} style={{ color: 'var(--primary-green)', fontWeight: '600' }}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={logout} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/admin/login" className="nav-link" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        <div className="mode-switch-wrapper">
          <button
            className={`mode-btn b2c ${mode === 'B2C' ? 'active' : ''}`}
            onClick={() => toggleMode('B2C')}
          >
            🛒 Retail (B2C)
          </button>
          <button
            className={`mode-btn b2b ${mode === 'B2B' ? 'active' : ''}`}
            onClick={() => toggleMode('B2B')}
          >
            🌾 Wholesale (B2B)
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
