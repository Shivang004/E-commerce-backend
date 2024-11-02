import axios from 'axios';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Adjust the base URL to include the `/api` prefix for API routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/products`);
  return response.data;
};

export const addProduct = async (product, token) => {
  const response = await axios.post(`${API_BASE_URL}/api/products`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProduct = async (id, product, token) => {
  const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth`, credentials);
  return response.data;
};
