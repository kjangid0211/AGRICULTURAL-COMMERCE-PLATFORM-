import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AppContext } from '../context/AppContext';

const Checkout = () => {
  const { cart, clearCart, getCartTotal, showToast } = useContext(AppContext);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const payload = {
        orderItems,
        customerDetails,
        paymentMethod: 'COD',
        totalAmount: getCartTotal(),
      };

      const response = await api.orders.create(payload);
      setOrderId(response._id);
      clearCart();
      showToast('Order placed successfully! Thank you.', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 className="text-serif" style={{ fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
          Your order has been recorded. Reference ID: <strong>{orderId}</strong>
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          A confirmation email has been dispatched. Our delivery team will contact you shortly for verification.
        </p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>No Items to Checkout</h2>
        <p style={{ margin: '1rem 0' }}>Add products in Retail Mode to place an order.</p>
        <Link to="/products" className="btn btn-primary">Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <h1 className="text-serif" style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>
        Checkout (Retail Mode)
      </h1>

      <div className="cart-layout">
        <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>
            Shipping & Billing Details
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Johnathan Miller"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+1 (555) 019-9988"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input
                type="text"
                name="address"
                value={customerDetails.address}
                onChange={handleChange}
                className="form-control"
                placeholder="Street address, apartment or suite number"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={customerDetails.city}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Arlington"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={customerDetails.zipCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="22201"
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 className="text-serif" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Payment Method
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-green-soft)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--primary-green)' }}>
                <input type="radio" checked readOnly />
                <strong>Cash on Delivery (COD)</strong>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} disabled={loading}>
              {loading ? 'Processing Order...' : `Place Order ($${getCartTotal().toFixed(2)})`}
            </button>
          </form>
        </div>

        <div className="cart-summary" style={{ height: 'fit-content' }}>
          <h3 className="text-serif" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
            Your Items
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
            {cart.map((item) => (
              <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>{item.product.name}</span>
                  <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                </div>
                <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success)' }}>FREE</span>
          </div>
          <div className="summary-row total" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span>Grand Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
