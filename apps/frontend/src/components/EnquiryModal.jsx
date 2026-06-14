import React, { useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { AppContext } from '../context/AppContext';

const EnquiryModal = ({ product, isOpen, onClose }) => {
  const { showToast } = useContext(AppContext);
  const [formData, setFormData] = useState({
    enquiryType: 'product',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    quantity: 1,
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData((prev) => ({
        ...prev,
        enquiryType: 'product',
        quantity: product.minOrderQty || 1,
        message: `Hello, we would like to request a wholesale price quote for the product: "${product.name}".`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        enquiryType: 'general',
        quantity: 1,
        message: '',
      }));
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        product: product?._id || undefined,
      };
      await api.enquiries.create(payload);
      showToast('Enquiry submitted successfully! Our sales team will contact you soon.', 'success');
      onClose();
      setFormData({
        enquiryType: 'general',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        quantity: 1,
        message: '',
      });
    } catch (error) {
      showToast(error.message || 'Failed to submit enquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">
          {product ? '💼 Wholesale Quote Request' : '💼 General B2B Business Enquiry'}
        </h2>
        
        {product && (
          <div style={{ backgroundColor: 'var(--primary-green-soft)', padding: '0.75rem', borderRadius: 'var(--border-radius)', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--primary-green)' }}>
            <strong>Selected Product:</strong> {product.name} <br/>
            <strong>Wholesale Minimum Quantity:</strong> {product.minOrderQty} units
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!product && (
            <div className="form-group">
              <label className="form-label">Enquiry Type</label>
              <select
                name="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="general">General Business Query</option>
                <option value="bulk">Bulk Supply Cooperation</option>
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. AgriTrade LLC"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Sarah Connor"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Corporate Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="sarah@company.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="+1 (555) 012-3456"
                required
              />
            </div>
          </div>

          {formData.enquiryType !== 'general' && (
            <div className="form-group">
              <label className="form-label">Target Quantity (Units/Kg)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min={product?.minOrderQty || 1}
                className="form-control"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Requirement Details</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              placeholder="Outline your shipping requirements, target timelines, and packaging needs..."
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting Request...' : 'Send Enquiry Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
