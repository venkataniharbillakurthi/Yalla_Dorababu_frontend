// src/utils/secureApi.js

const API_BASE_URL = 'https://78139d15db4f.ngrok-free.app';

const secureApi = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
};

export default secureApi; 