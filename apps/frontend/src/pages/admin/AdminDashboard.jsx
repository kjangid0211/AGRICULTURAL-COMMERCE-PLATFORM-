import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { showToast } = useContext(AppContext);
  const navigate = useNavigate();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Master Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Form states (Create/Edit)
  const [productForm, setProductForm] = useState(null); // null means not editing/creating. Otherwise { isEdit: bool, data: {...} }
  const [categoryForm, setCategoryForm] = useState(null); // null or { isEdit: bool, data: {...} }
  
  // CMS edit states
  const [cmsKey, setCmsKey] = useState('homepage');
  const [cmsForm, setCmsForm] = useState({ title: '', content: '' });
  
  // Settings Form state
  const [settingsForm, setSettingsForm] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        showToast('Access Denied. Admin only.', 'error');
        navigate('/admin/login');
      }
    }
  }, [user, authLoading, navigate]);

  // Load all admin data
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const prodData = await api.products.getAll({ isAdmin: true });
      setProducts(prodData);

      const catData = await api.categories.getAll({ isAdmin: true });
      setCategories(catData);

      const enquiryData = await api.enquiries.getAll();
      setEnquiries(enquiryData);

      const orderData = await api.orders.getAll();
      setOrders(orderData);

      const settingsData = await api.settings.get();
      setSettings(settingsData);
      setSettingsForm(settingsData);

      // Load initial CMS content
      const homepageCms = await api.cms.getByKey('homepage');
      setCmsForm({ title: homepageCms.title, content: homepageCms.content });
    } catch (error) {
      console.error('Failed to load admin panel data', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  // Load CMS details when key changes
  const handleCmsKeyChange = async (key) => {
    setCmsKey(key);
    try {
      const cmsData = await api.cms.getByKey(key);
      setCmsForm({ title: cmsData.title, content: typeof cmsData.content === 'object' ? JSON.stringify(cmsData.content, null, 2) : cmsData.content });
    } catch (error) {
      showToast('Error fetching CMS page details', 'error');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Verifying Administrator Session...</h2>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalB2CSales = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const outOfStockProds = products.filter((p) => p.stock === 0).length;

  // PRODUCT CRUD OPERATIONS
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = productForm.data;
      if (productForm.isEdit) {
        await api.products.update(data._id, data);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.products.create(data);
        showToast('Product added successfully!', 'success');
      }
      setProductForm(null);
      loadAdminData();
    } catch (error) {
      showToast(error.message || 'Failed to save product', 'error');
    }
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.products.delete(id);
        showToast('Product deleted successfully.', 'success');
        loadAdminData();
      } catch (error) {
        showToast(error.message || 'Failed to delete product', 'error');
      }
    }
  };

  // CATEGORY CRUD OPERATIONS
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const data = categoryForm.data;
      if (categoryForm.isEdit) {
        await api.categories.update(data._id, data);
        showToast('Category updated successfully!', 'success');
      } else {
        await api.categories.create(data);
        showToast('Category created successfully!', 'success');
      }
      setCategoryForm(null);
      loadAdminData();
    } catch (error) {
      showToast(error.message || 'Failed to save category', 'error');
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.categories.delete(id);
        showToast('Category deleted successfully.', 'success');
        loadAdminData();
      } catch (error) {
        showToast(error.message || 'Failed to delete category', 'error');
      }
    }
  };

  // STATUS MODIFIERS (ORDERS & ENQUIRIES)
  const handleEnquiryStatusChange = async (id, status) => {
    try {
      await api.enquiries.updateStatus(id, status);
      showToast('Enquiry status updated!', 'success');
      loadAdminData();
    } catch (error) {
      showToast('Failed to modify enquiry status', 'error');
    }
  };

  const handleOrderStatusChange = async (id, status) => {
    try {
      await api.orders.updateStatus(id, status);
      showToast('Order fulfillment status updated!', 'success');
      loadAdminData();
    } catch (error) {
      showToast('Failed to modify order status', 'error');
    }
  };

  // CMS SAVING
  const handleCmsSubmit = async (e) => {
    e.preventDefault();
    try {
      let contentPayload = cmsForm.content;
      if (cmsKey === 'homepage') {
        // Parse JSON for home page structure
        contentPayload = JSON.parse(cmsForm.content);
      }
      await api.cms.updateByKey(cmsKey, {
        title: cmsForm.title,
        content: contentPayload,
      });
      showToast('CMS changes published successfully!', 'success');
      loadAdminData();
    } catch (error) {
      showToast(error.message || 'Error parsing content format. Verify valid JSON if editing homepage.', 'error');
    }
  };

  // GLOBAL SETTINGS SAVING
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.settings.update(settingsForm);
      showToast('Global website settings updated successfully!', 'success');
      loadAdminData();
    } catch (error) {
      showToast(error.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <h2 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 2rem 0.5rem', fontFamily: 'var(--font-serif)' }}>
          🌾 Agri Control
        </h2>
        
        <button
          onClick={() => { setActiveTab('overview'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'overview' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          📊 Stats Overview
        </button>
        <button
          onClick={() => { setActiveTab('products'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'products' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          📦 Catalog Products
        </button>
        <button
          onClick={() => { setActiveTab('categories'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'categories' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          📁 Categories CRUD
        </button>
        <button
          onClick={() => { setActiveTab('enquiries'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'enquiries' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          💼 B2B Enquiries
        </button>
        <button
          onClick={() => { setActiveTab('orders'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'orders' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          🛒 B2C Retail Orders
        </button>
        <button
          onClick={() => { setActiveTab('cms'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'cms' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          📝 CMS Web Editor
        </button>
        <button
          onClick={() => { setActiveTab('settings'); setProductForm(null); setCategoryForm(null); }}
          className={`admin-sidebar-link btn ${activeTab === 'settings' ? 'active' : ''}`}
          style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%' }}
        >
          ⚙️ Global Settings
        </button>

        <div style={{ marginTop: 'auto', padding: '1rem 0.5rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => navigate('/')} className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#fff', width: '100%' }}>
            &larr; Customer Store
          </button>
        </div>
      </aside>

      {/* Main Admin Console */}
      <main className="admin-main">
        {loadingData ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h3>Updating Live Dashboard...</h3>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Administrator Dashboard</h1>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Logged in as: {user.name}</span>
                </div>

                <div className="grid grid-4" style={{ marginBottom: '3rem' }}>
                  <div className="admin-card-summary">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>B2C REALIZED REVENUE</span>
                    <h2 className="admin-card-val">${totalB2CSales.toFixed(2)}</h2>
                  </div>
                  <div className="admin-card-summary">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>PENDING B2C ORDERS</span>
                    <h2 className="admin-card-val" style={{ color: 'var(--warning)' }}>{pendingOrders}</h2>
                  </div>
                  <div className="admin-card-summary">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>NEW B2B ENQUIRIES</span>
                    <h2 className="admin-card-val" style={{ color: 'var(--info)' }}>{newEnquiries}</h2>
                  </div>
                  <div className="admin-card-summary">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>OUT OF STOCK ITEMS</span>
                    <h2 className="admin-card-val" style={{ color: outOfStockProds > 0 ? 'var(--danger)' : 'var(--success)' }}>
                      {outOfStockProds}
                    </h2>
                  </div>
                </div>

                {/* Dashboard recent items summary */}
                <div className="grid grid-2">
                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-serif" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      Recent Wholesale Enquiries
                    </h3>
                    {enquiries.slice(0, 5).map((e) => (
                      <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid #f2eeea' }}>
                        <div>
                          <strong>{e.companyName}</strong> ({e.contactPerson})
                          <div style={{ color: 'var(--text-muted)' }}>{e.product?.name || 'General Business Inquiry'}</div>
                        </div>
                        <span className={`badge badge-${e.status}`}>{e.status}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-serif" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      Recent Retail Orders
                    </h3>
                    {orders.slice(0, 5).map((o) => (
                      <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid #f2eeea' }}>
                        <div>
                          <strong>{o.customerDetails.name}</strong>
                          <div style={{ color: 'var(--text-muted)' }}>{o.orderItems.length} products - ${o.totalAmount.toFixed(2)}</div>
                        </div>
                        <span className={`badge badge-${o.status}`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS CRUD */}
            {activeTab === 'products' && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Product Catalog Management</h1>
                  {!productForm && (
                    <button
                      onClick={() => setProductForm({
                        isEdit: false,
                        data: {
                          name: '', category: categories[0]?._id || '', image: '', price: 0,
                          description: '', shortDescription: '', specifications: [], stock: 0,
                          status: 'active', b2bVisibility: true, b2cVisibility: true, minOrderQty: 1
                        }
                      })}
                      className="btn btn-primary btn-sm"
                    >
                      ➕ Add Product
                    </button>
                  )}
                </div>

                {productForm ? (
                  <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', maxWidth: '750px' }}>
                    <h3 className="text-serif" style={{ marginBottom: '1.5rem', color: 'var(--primary-green)' }}>
                      {productForm.isEdit ? '✏️ Edit Product details' : '➕ Create New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit}>
                      <div className="form-group">
                        <label className="form-label">Product Name</label>
                        <input
                          type="text"
                          value={productForm.data.name}
                          onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, name: e.target.value } })}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            value={productForm.data.category?._id || productForm.data.category}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, category: e.target.value } })}
                            className="form-control"
                            required
                          >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Retail Price ($)</label>
                          <input
                            type="number"
                            value={productForm.data.price}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, price: parseFloat(e.target.value) || 0 } })}
                            className="form-control"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Available Stock</label>
                          <input
                            type="number"
                            value={productForm.data.stock}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, stock: parseInt(e.target.value) || 0 } })}
                            className="form-control"
                            min="0"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Min wholesale Enquiry Qty</label>
                          <input
                            type="number"
                            value={productForm.data.minOrderQty}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, minOrderQty: parseInt(e.target.value) || 1 } })}
                            className="form-control"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input
                          type="text"
                          value={productForm.data.image}
                          onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, image: e.target.value } })}
                          className="form-control"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Short Summary</label>
                        <input
                          type="text"
                          value={productForm.data.shortDescription}
                          onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, shortDescription: e.target.value } })}
                          className="form-control"
                          placeholder="Brief 1-sentence sales summary"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Detailed Description</label>
                        <textarea
                          value={productForm.data.description}
                          onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, description: e.target.value } })}
                          className="form-control"
                          required
                        ></textarea>
                      </div>

                      <div className="form-row" style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                        <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={productForm.data.b2bVisibility}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, b2bVisibility: e.target.checked } })}
                          />
                          <label style={{ fontWeight: '500', margin: 0 }}>Visible in Wholesale (B2B)</label>
                        </div>
                        <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={productForm.data.b2cVisibility}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, b2cVisibility: e.target.checked } })}
                          />
                          <label style={{ fontWeight: '500', margin: 0 }}>Visible in Retail (B2C)</label>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ margin: '0 0 0.25rem' }}>Status</label>
                          <select
                            value={productForm.data.status}
                            onChange={(e) => setProductForm({ ...productForm, data: { ...productForm.data, status: e.target.value } })}
                            className="form-control"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn btn-primary">
                          Save Product
                        </button>
                        <button type="button" onClick={() => setProductForm(null)} className="btn btn-outline-brown">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table-admin">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>B2B / B2C</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p._id}>
                            <td style={{ fontWeight: '600' }}>{p.name}</td>
                            <td>{p.category?.name || 'Category'}</td>
                            <td>${p.price.toFixed(2)}</td>
                            <td>
                              <span style={{ color: p.stock === 0 ? 'var(--danger)' : 'inherit', fontWeight: p.stock === 0 ? '700' : 'normal' }}>
                                {p.stock}
                              </span>
                            </td>
                            <td>
                              {p.b2bVisibility ? '🌾 B2B' : ''} {p.b2bVisibility && p.b2cVisibility ? ' / ' : ''} {p.b2cVisibility ? '🛒 B2C' : ''}
                            </td>
                            <td>
                              <span style={{ color: p.status === 'active' ? 'var(--success)' : 'var(--text-muted)', fontWeight: '600' }}>
                                {p.status}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  onClick={() => setProductForm({ isEdit: true, data: p })}
                                  className="btn btn-outline btn-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleProductDelete(p._id)}
                                  className="btn btn-outline-brown btn-sm"
                                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CATEGORIES CRUD */}
            {activeTab === 'categories' && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Product Categories</h1>
                  {!categoryForm && (
                    <button
                      onClick={() => setCategoryForm({
                        isEdit: false,
                        data: { name: '', slug: '', image: '', status: 'active', displayOrder: 0 }
                      })}
                      className="btn btn-primary btn-sm"
                    >
                      ➕ Add Category
                    </button>
                  )}
                </div>

                {categoryForm ? (
                  <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', maxWidth: '500px' }}>
                    <h3 className="text-serif" style={{ marginBottom: '1.5rem', color: 'var(--primary-green)' }}>
                      {categoryForm.isEdit ? '✏️ Edit Category' : '➕ Create New Category'}
                    </h3>
                    <form onSubmit={handleCategorySubmit}>
                      <div className="form-group">
                        <label className="form-label">Category Name</label>
                        <input
                          type="text"
                          value={categoryForm.data.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            setCategoryForm({ ...categoryForm, data: { ...categoryForm.data, name: val, slug: slugified } });
                          }}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category Slug</label>
                        <input
                          type="text"
                          value={categoryForm.data.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, data: { ...categoryForm.data, slug: e.target.value } })}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input
                          type="text"
                          value={categoryForm.data.image}
                          onChange={(e) => setCategoryForm({ ...categoryForm, data: { ...categoryForm.data, image: e.target.value } })}
                          className="form-control"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Display Order</label>
                          <input
                            type="number"
                            value={categoryForm.data.displayOrder}
                            onChange={(e) => setCategoryForm({ ...categoryForm, data: { ...categoryForm.data, displayOrder: parseInt(e.target.value) || 0 } })}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Status</label>
                          <select
                            value={categoryForm.data.status}
                            onChange={(e) => setCategoryForm({ ...categoryForm, data: { ...categoryForm.data, status: e.target.value } })}
                            className="form-control"
                            required
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary">
                          Save Category
                        </button>
                        <button type="button" onClick={() => setCategoryForm(null)} className="btn btn-outline-brown">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table-admin">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Category Name</th>
                          <th>Slug</th>
                          <th>Display Order</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c._id}>
                            <td>
                              <img src={c.image} alt={c.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                            </td>
                            <td style={{ fontWeight: '600' }}>{c.name}</td>
                            <td><code>{c.slug}</code></td>
                            <td>{c.displayOrder}</td>
                            <td>
                              <span style={{ color: c.status === 'active' ? 'var(--success)' : 'var(--text-muted)', fontWeight: '600' }}>
                                {c.status}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  onClick={() => setCategoryForm({ isEdit: true, data: c })}
                                  className="btn btn-outline btn-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleCategoryDelete(c._id)}
                                  className="btn btn-outline-brown btn-sm"
                                  style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: B2B ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Wholesale Quote Enquiries</h1>
                </div>

                <div className="table-responsive">
                  <table className="table-admin">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Sender Details</th>
                        <th>Type</th>
                        <th>Product / Qty</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((e) => (
                        <tr key={e._id}>
                          <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td>
                            <strong>{e.companyName}</strong> <br/>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Cont: {e.contactPerson} <br/>
                              E: {e.email} | P: {e.phone}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontStyle: 'italic', fontWeight: '500', color: 'var(--accent-brown)' }}>
                              {e.enquiryType}
                            </span>
                          </td>
                          <td>
                            {e.product ? (
                              <>
                                <strong style={{ color: 'var(--primary-green)' }}>{e.product.name}</strong> <br/>
                                <span>Qty: <strong>{e.quantity}</strong> units</span>
                              </>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>General Enquiry</span>
                            )}
                          </td>
                          <td style={{ maxWidth: '250px', whiteSpace: 'normal', fontSize: '0.85rem' }}>
                            {e.message}
                          </td>
                          <td>
                            <span className={`badge badge-${e.status}`}>{e.status}</span>
                          </td>
                          <td>
                            <select
                              value={e.status}
                              onChange={(el) => handleEnquiryStatusChange(e._id, el.target.value)}
                              className="form-control"
                              style={{ padding: '0.25rem 0.5rem', width: 'fit-content', fontSize: '0.85rem', borderRadius: '4px' }}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: B2C ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Retail Store Orders (B2C)</h1>
                </div>

                <div className="table-responsive">
                  <table className="table-admin">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Customer / Address</th>
                        <th>Cart Items Ordered</th>
                        <th>Total Amount</th>
                        <th>Fulfillment</th>
                        <th>Action Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>
                            <strong>{o.customerDetails.name}</strong> <br/>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              P: {o.customerDetails.phone} | E: {o.customerDetails.email} <br/>
                              {o.customerDetails.address}, {o.customerDetails.city} - {o.customerDetails.zipCode}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>
                            {o.orderItems.map((item, index) => (
                              <div key={index}>
                                • {item.product?.name || 'Unknown Product'} (Qty: {item.quantity} @ ${item.price.toFixed(2)})
                              </div>
                            ))}
                          </td>
                          <td style={{ fontWeight: '700', color: 'var(--primary-green)' }}>
                            ${o.totalAmount.toFixed(2)}
                          </td>
                          <td>
                            <span className={`badge badge-${o.status}`}>{o.status}</span>
                          </td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(el) => handleOrderStatusChange(o._id, el.target.value)}
                              className="form-control"
                              style={{ padding: '0.25rem 0.5rem', width: 'fit-content', fontSize: '0.85rem', borderRadius: '4px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: CMS PAGES EDITOR */}
            {activeTab === 'cms' && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Dynamic CMS Layout Editor</h1>
                </div>

                <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', maxWidth: '750px' }}>
                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label">Select Page Key to Modify</label>
                    <select
                      value={cmsKey}
                      onChange={(e) => handleCmsKeyChange(e.target.value)}
                      className="form-control"
                    >
                      <option value="homepage">Homepage Config (JSON Structure)</option>
                      <option value="about_us">About Us Page (Markdown)</option>
                      <option value="privacy_policy">Privacy & Security Page (Markdown)</option>
                      <option value="shipping_policy">Shipping & Terms Page (Markdown)</option>
                    </select>
                  </div>

                  <form onSubmit={handleCmsSubmit}>
                    <div className="form-group">
                      <label className="form-label">Page Title</label>
                      <input
                        type="text"
                        value={cmsForm.title}
                        onChange={(e) => setCmsForm({ ...cmsForm, title: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Page Content {cmsKey === 'homepage' ? '(Must be valid JSON formatting)' : '(Markdown syntax supported)'}
                      </label>
                      <textarea
                        value={cmsForm.content}
                        onChange={(e) => setCmsForm({ ...cmsForm, content: e.target.value })}
                        className="form-control"
                        style={{ minHeight: '350px', fontFamily: cmsKey === 'homepage' ? 'monospace' : 'inherit' }}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Publish Changes
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 7: GLOBAL WEBSITE SETTINGS */}
            {activeTab === 'settings' && settingsForm && (
              <div>
                <div className="admin-header">
                  <h1 className="text-serif">Global Storefront Settings</h1>
                </div>

                <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', maxWidth: '650px' }}>
                  <form onSubmit={handleSettingsSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Website Name</label>
                        <input
                          type="text"
                          value={settingsForm.websiteName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, websiteName: e.target.value })}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Logo Text / Emoji</label>
                        <input
                          type="text"
                          value={settingsForm.logoPlaceholder}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoPlaceholder: e.target.value })}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Default Visbility Mode on First Visit</label>
                      <select
                        value={settingsForm.defaultMode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, defaultMode: e.target.value })}
                        className="form-control"
                      >
                        <option value="B2C">Retail Storefront (B2C)</option>
                        <option value="B2B">Wholesale Leads (B2B)</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Support Email Address</label>
                        <input
                          type="email"
                          value={settingsForm.contactEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Support Phone Number</label>
                        <input
                          type="text"
                          value={settingsForm.contactPhone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Office Postal Address</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="form-control"
                        required
                      />
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                      <h3 className="text-serif" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-green)' }}>
                        Social Directory Directory Links
                      </h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Facebook</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks.facebook}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value } })}
                            className="form-control"
                            placeholder="https://..."
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Twitter/X</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks.twitter}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, twitter: e.target.value } })}
                            className="form-control"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Instagram</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks.instagram}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value } })}
                            className="form-control"
                            placeholder="https://..."
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">LinkedIn</label>
                          <input
                            type="text"
                            value={settingsForm.socialLinks.linkedin}
                            onChange={(e) => setSettingsForm({ ...settingsForm, socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value } })}
                            className="form-control"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                      Save Global Settings
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
