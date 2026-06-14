import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Cart = () => {
  const { cart, updateCartQty, removeFromCart, getCartTotal } = useContext(AppContext);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 className="text-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Retail Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Explore our agricultural stand and add seeds, organic fertilizers, or tools to your card.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <h1 className="text-serif" style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>
        Shopping Cart (Retail Mode)
      </h1>

      <div className="cart-layout">
        <div className="cart-table-wrapper">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const { product, quantity } = item;
                return (
                  <tr key={product._id}>
                    <td>
                      <div className="cart-item-info">
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=100'}
                          alt={product.name}
                          className="cart-item-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                        <div>
                          <Link to={`/product/${product._id}`} style={{ fontWeight: '600', color: 'var(--primary-green)' }}>
                            {product.name}
                          </Link>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Category: {product.category?.name || 'Category'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <div className="cart-qty-control">
                        <button
                          onClick={() => updateCartQty(product._id, quantity - 1)}
                          className="cart-qty-btn"
                        >
                          -
                        </button>
                        <span className="cart-qty-val">{quantity}</span>
                        <button
                          onClick={() => updateCartQty(product._id, Math.min(product.stock, quantity + 1))}
                          className="cart-qty-btn"
                        >
                          +
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center' }}>
                        Stock: {product.stock}
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>
                      ${(product.price * quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="cart-item-remove"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h3 className="text-serif" style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary-green)' }}>
            Order Summary
          </h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            Proceed to Checkout
          </Link>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/products" style={{ fontSize: '0.9rem', color: 'var(--accent-brown)', textDecoration: 'underline' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
