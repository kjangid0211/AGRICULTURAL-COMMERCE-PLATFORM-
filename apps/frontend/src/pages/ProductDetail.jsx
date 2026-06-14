import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';

const ProductDetail = () => {
  const { id } = useParams();
  const { mode, addToCart } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const prod = await api.products.getById(id);
        setProduct(prod);
        if (prod.category) {
          const catId = prod.category._id || prod.category;
          const related = await api.products.getAll({ category: catId, mode });
          setRelatedProducts(related.filter((p) => p._id !== prod._id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, mode]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Loading Product Details...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The item you are trying to view does not exist in our catalog.</p>
        <Link to="/products" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const categoryName = product.category?.name || 'Category';

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <Link to="/products" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        &larr; Back to Catalog
      </Link>

      <div className="product-detail-layout">
        <div>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600'}
            alt={product.name}
            className="detail-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600';
            }}
          />
        </div>

        <div className="detail-info">
          <span className="detail-category">{categoryName}</span>
          <h1 className="text-serif detail-title">{product.name}</h1>

          {mode === 'B2C' ? (
            <div className="detail-price">${product.price.toFixed(2)}</div>
          ) : (
            <div>
              <span className="detail-quote" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>🌾 Bulk Quote Required</span>
            </div>
          )}

          <p className="detail-desc">{product.description}</p>

          <div style={{ margin: '1rem 0', fontSize: '0.95rem' }}>
            <strong>Availability:</strong>{' '}
            {product.stock > 0 ? (
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>In Stock ({product.stock} units)</span>
            ) : (
              <span style={{ color: 'var(--danger)', fontWeight: '600' }}>Out of Stock</span>
            )}
          </div>

          {mode === 'B2B' && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <strong>Minimum wholesale purchase:</strong> {product.minOrderQty} units.
            </div>
          )}

          <div className="detail-actions">
            {mode === 'B2C' ? (
              <>
                {product.stock > 0 ? (
                  <>
                    <div className="cart-qty-control" style={{ padding: '0.4rem' }}>
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="cart-qty-btn"
                      >
                        -
                      </button>
                      <span className="cart-qty-val">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="cart-qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <button onClick={handleAddToCart} className="btn btn-primary">
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Out of Stock
                  </button>
                )}
              </>
            ) : (
              <button onClick={() => setIsEnquiryOpen(true)} className="btn btn-secondary" style={{ width: '100%' }}>
                💼 Submit B2B Wholesale Quote Request
              </button>
            )}
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="detail-specs">
              <h3 className="text-serif" style={{ fontSize: '1.25rem' }}>Technical Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <td>{spec.label}</td>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
          <h2 className="text-serif" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>
            Related Products
          </h2>
          <div className="grid grid-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onEnquireClick={() => {
                  setProduct(p);
                  setIsEnquiryOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <EnquiryModal
        product={product}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
