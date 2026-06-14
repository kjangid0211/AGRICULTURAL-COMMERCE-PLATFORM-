import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';

const Products = () => {
  const { mode } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryFilter = searchParams.get('category') || '';
  const [searchText, setSearchText] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('enquire') === 'general') {
      setSelectedProduct(null);
      setIsEnquiryOpen(true);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('enquire');
      setSearchParams(newParams);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const cats = await api.categories.getAll();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories list', error);
      }
    };
    fetchFiltersData();
  }, []);

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const data = await api.products.getAll({
          category: categoryFilter,
          search: activeSearch,
          mode: mode,
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products catalog', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, [categoryFilter, activeSearch, mode]);

  const handleCategorySelect = (id) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('category', id);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchText);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setActiveSearch('');
    setSearchParams({});
  };

  const handleEnquireClick = (product) => {
    setSelectedProduct(product);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-serif" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
          {mode === 'B2B' ? 'Wholesale Marketplace' : 'Retail Farm Stand'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {mode === 'B2B'
            ? 'Browse our bulk offerings and submit your request for custom quotes.'
            : 'Buy high quality organic produce, tools, and seeds directly online.'}
        </p>
      </div>

      <div className="filters-container">
        <div className="categories-pills">
          <span
            className={`category-pill ${!categoryFilter ? 'active' : ''}`}
            onClick={() => handleCategorySelect('')}
          >
            All Products
          </span>
          {categories.map((cat) => (
            <span
              key={cat._id}
              className={`category-pill ${categoryFilter === cat._id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat._id)}
            >
              {cat.name}
            </span>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="search-box">
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem 1rem' }}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          {(activeSearch || categoryFilter) && (
            <button type="button" onClick={handleClearFilters} className="btn btn-outline-brown btn-sm">
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h3>Fetching Catalog Products...</h3>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEnquireClick={handleEnquireClick}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            We couldn't find any items matching your selected criteria.
          </p>
          <button onClick={handleClearFilters} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      )}

      {mode === 'B2B' && (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--accent-brown-soft)', borderRadius: 'var(--border-radius)', marginBottom: '3rem', border: '1px dashed var(--accent-brown)' }}>
          <h3 className="text-serif" style={{ color: 'var(--accent-brown)', marginBottom: '0.5rem' }}>
            Looking for something else in bulk?
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            If you need a custom wholesale order or have a general trade partnership inquiry, contact our office.
          </p>
          <button onClick={() => { setSelectedProduct(null); setIsEnquiryOpen(true); }} className="btn btn-secondary">
            💼 Submit General Trade Enquiry
          </button>
        </div>
      )}

      <EnquiryModal
        product={selectedProduct}
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Products;
