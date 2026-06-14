import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Footer = () => {
  const { settings } = useContext(AppContext);
  const websiteName = settings?.websiteName || 'AgriCommerce';
  const logo = settings?.logoPlaceholder || '🌾';
  const contactPhone = settings?.contactPhone || '+1 (555) 019-2834';
  const contactEmail = settings?.contactEmail || 'contact@agricommerce.com';
  const address = settings?.address || '100 Green Fields Way, Agriculture Valley, CA 90210';
  const social = settings?.socialLinks || {};

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <span style={{ marginRight: '0.25rem' }}>{logo}</span>
              <span>{websiteName}</span>
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1rem' }}>
              Premium agricultural commerce marketplace supplying verified high-yield seeds, bio-organic compost fertilizers, and commercial field gear.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Dashboard</Link></li>
              <li><Link to="/products">Product Catalog</Link></li>
              <li><Link to="/page/about_us">About Our Company</Link></li>
              <li><Link to="/admin/login">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Policies</h4>
            <ul className="footer-links">
              <li><Link to="/page/privacy_policy">Privacy & Security</Link></li>
              <li><Link to="/page/shipping_policy">Shipping & Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Support</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              <strong>Address:</strong> {address}
            </p>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              <strong>Phone:</strong> {contactPhone}
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              <strong>Email:</strong> {contactEmail}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {websiteName}. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
            {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
