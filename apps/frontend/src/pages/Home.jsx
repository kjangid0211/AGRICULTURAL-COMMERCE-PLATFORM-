import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import EnquiryModal from '../components/EnquiryModal';

const Home = () => {
  const { mode, toggleMode, showToast } = useContext(AppContext);
  const [homepageCms, setHomepageCms] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const homeCmsData = await api.cms.getByKey('homepage');
        setHomepageCms(homeCmsData.content);

        const cats = await api.categories.getAll();
        setCategories(cats.slice(0, 4));

        const prods = await api.products.getAll({ mode });
        setFeaturedProducts(prods.slice(0, 4));
      } catch (error) {
        console.error('Error loading homepage data', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [mode]);

  const handleEnquireClick = (product) => {
    setSelectedProduct(product);
    setIsEnquiryOpen(true);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Loading Greenfield Farms...</h2>
      </div>
    );
  }

  const { heroTitle, heroSubtitle, heroBgImage, whyChooseUs, featuredHeading, promoBanner } = homepageCms || {
    heroTitle: 'AgriCommerce Marketplace',
    heroSubtitle: 'Certified Seeds, Organic Composts, and Agricultural Tools.',
    heroBgImage: '',
    whyChooseUs: [],
    featuredHeading: 'Featured Categories',
    promoBanner: null,
  };

  return (
    <div>
      <section className="hero" style={{ backgroundImage: heroBgImage ? `url(${heroBgImage})` : 'none' }}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-subtitle">{heroSubtitle}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Browse Catalog
              </Link>
              {mode === 'B2C' ? (
                <button onClick={() => toggleMode('B2B')} className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
                  Switch to Wholesale (B2B)
                </button>
              ) : (
                <button onClick={() => toggleMode('B2C')} className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
                  Switch to Retail (B2C)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {whyChooseUs && whyChooseUs.length > 0 && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <h2 className="text-serif text-center" style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>
            Why GreenFields Co.
          </h2>
          <div className="grid grid-3">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">
                  {idx === 0 ? '🌾' : idx === 1 ? '🍃' : '🚛'}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <h2 className="text-serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
            {featuredHeading}
          </h2>
          <div className="grid grid-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat._id}`)}
              >
                <img src={cat.image} alt={cat.name} />
                <h3 className="category-title">{cat.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {promoBanner && (
        <section className="container" style={{ marginBottom: '4rem' }}>
          <div className="promo-banner">
            <div>
              <h3 className="text-serif promo-title">{promoBanner.title}</h3>
              <p className="promo-desc">{promoBanner.description}</p>
            </div>
            {mode === 'B2C' ? (
              <button onClick={() => toggleMode('B2B')} className="btn btn-secondary">
                {promoBanner.ctaText || 'Enquire Now'}
              </button>
            ) : (
              <button onClick={() => setIsEnquiryOpen(true)} className="btn btn-secondary">
                💼 Quick Enquiry
              </button>
            )}
          </div>
        </section>
      )}

      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 className="text-serif" style={{ fontSize: '1.8rem' }}>
              {mode === 'B2B' ? 'Wholesale Offerings' : 'Popular Retail Products'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              High-purity agricultural batch supplies currently in-stock.
            </p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            View All Products
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEnquireClick={handleEnquireClick}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No products found matching active storefront settings.</p>
        )}
      </section>

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

export default Home;
