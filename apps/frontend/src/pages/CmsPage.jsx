import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const CmsPage = () => {
  const { key } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCmsData = async () => {
      setLoading(true);
      try {
        const data = await api.cms.getByKey(key);
        setPage(data);
      } catch (error) {
        console.error('Error fetching CMS content', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCmsData();
  }, [key]);

  const renderContent = (content) => {
    if (typeof content !== 'string') return '';
    
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-serif" style={{ fontSize: '2.2rem', margin: '1.5rem 0 1rem', color: 'var(--primary-green)' }}>{trimmed.slice(2)}</h1>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-serif" style={{ fontSize: '1.4rem', margin: '1.5rem 0 0.75rem', color: 'var(--primary-green)' }}>{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        return <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{trimmed.slice(2)}</li>;
      }
      if (trimmed === '') {
        return <div key={idx} style={{ height: '0.5rem' }}></div>;
      }
      return <p key={idx} style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>{trimmed}</p>;
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Loading Page...</h2>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Page Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The informational page you are searching for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '800px' }}>
      <div style={{ background: '#fff', padding: '3rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '3rem' }}>
        {renderContent(page.content)}
      </div>
    </div>
  );
};

export default CmsPage;
