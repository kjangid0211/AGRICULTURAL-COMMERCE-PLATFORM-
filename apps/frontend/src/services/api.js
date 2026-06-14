const BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Something went wrong';
    throw new Error(errorMessage);
  }

  return response.json();
};

export const api = {
  // Auth
  auth: {
    login: (credentials) => request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getProfile: () => request('/auth/me'),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.mode) queryParams.append('mode', params.mode);
      if (params.isAdmin) queryParams.append('isAdmin', params.isAdmin);
      return request(`/products?${queryParams.toString()}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (data) => request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/products/${id}`, {
      method: 'DELETE',
    }),
  },

  // Categories
  categories: {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.isAdmin) queryParams.append('isAdmin', params.isAdmin);
      return request(`/categories?${queryParams.toString()}`);
    },
    getById: (id) => request(`/categories/${id}`),
    create: (data) => request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/categories/${id}`, {
      method: 'DELETE',
    }),
  },

  // Enquiries
  enquiries: {
    create: (data) => request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: () => request('/enquiries'),
    updateStatus: (id, status) => request(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    delete: (id) => request(`/enquiries/${id}`, {
      method: 'DELETE',
    }),
  },

  // Orders
  orders: {
    create: (data) => request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: () => request('/orders'),
    getById: (id) => request(`/orders/${id}`),
    updateStatus: (id, status) => request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    delete: (id) => request(`/orders/${id}`, {
      method: 'DELETE',
    }),
  },

  // CMS
  cms: {
    getByKey: (key) => request(`/cms/${key}`),
    updateByKey: (key, data) => request(`/cms/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Settings
  settings: {
    get: () => request('/settings'),
    update: (data) => request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },
};
