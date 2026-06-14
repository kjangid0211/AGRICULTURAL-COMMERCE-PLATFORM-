import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProductCard = ({ product, onEnquireClick }) => {
  const { mode, addToCart } = useContext(AppContext);
  const { _id, name, image, category, price, shortDescription, stock } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const categoryName = category?.name || 'Category';

  return (
    <div className="product-card">
      <Link to={`/product/${_id}`}>
        <img
          src={image || 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300'}
          alt={name}
          className="product-card-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300';
          }}
        />
      </Link>
      <div className="product-card-body">
        <span className="product-card-category">{categoryName}</span>
        <Link to={`/product/${_id}`}>
          <h3 className="product-card-title">{name}</h3>
        </Link>
        <p className="product-card-description">{shortDescription || 'No description available.'}</p>
        
        <div className="product-card-footer">
          {mode === 'B2C' ? (
            <>
              <span className="product-card-price">${price.toFixed(2)}</span>
              {stock > 0 ? (
                <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
                  Add to Cart
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" disabled>
                  Out of Stock
                </button>
              )}
            </>
          ) : (
            <>
              <span className="product-card-quote">Request Quote</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEnquireClick(product);
                }}
                className="btn btn-secondary btn-sm"
              >
                Enquire
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
