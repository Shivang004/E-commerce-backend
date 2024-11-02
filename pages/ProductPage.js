import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct, loginUser } from '../utils/api';
import '../styles/ProductPage.css';
import logo from '../logo.png';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: 0, quantity: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    }
    fetchProducts();
    const fetchProductsInterval = setInterval(fetchProducts, 5000);
    return () => clearInterval(fetchProductsInterval);
  }, []);

  const fetchProducts = async () => {
    const productsData = await getProducts();
    setProducts(productsData);
  };

  const handleInputChange = (e) => setProductForm({ ...productForm, [e.target.name]: e.target.value });

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginForm);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setIsAuthenticated(true);
      setLoginError('');
      setShowLoginForm(false);
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      console.error("Login failed:", error.message);
      setLoginError("Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(currentProductId, productForm, token);
      } else {
        await addProduct(productForm, token);
      }
      setProductForm({ name: '', description: '', price: 0, quantity: 0 });
      fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save product.", error);
    }
  };

  const handleEdit = (product) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to edit a product.");
      return;
    }
    setProductForm(product);
    setIsEditing(true);
    setCurrentProductId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to delete a product.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id, token);
      fetchProducts();
    }
  };

  const toggleFormVisibility = () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to add a new product.");
      return;
    }
    setShowForm(!showForm);
    setProductForm({ name: '', description: '', price: 0, quantity: 0 });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleSortChange = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (typeof a[sortConfig.key] === 'string') {
      return sortConfig.direction === 'ascending'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    } else {
      return sortConfig.direction === 'ascending'
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key];
    }
  });

  const handleDropdownChange = (key, direction) => {
    handleSortChange(key, direction);
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo"><img src={logo} alt='GIVA'></img></div>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="navbar-auth">
          {!isAuthenticated ? (
            <div>
              <button onClick={() => setShowLoginForm(!showLoginForm)}>
                {showLoginForm ? 'Close Login' : 'Login'}
              </button>
              {showLoginForm && (
                <form onSubmit={handleLoginSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                  />
                  <button type="submit">Login</button>
                  {loginError && <p className="error">{loginError}</p>} {/* Display error message */}
                </form>
              )}
            </div>
          ) : (
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <h1 className="product-heading">Product Management System</h1>

      <button onClick={toggleFormVisibility}>
        {showForm ? 'Hide Form' : 'Add New Product'}
      </button>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleInputChange}
            required
          />

          <label>Description</label>
          <input
            type="text"
            name="description"
            value={productForm.description}
            onChange={handleInputChange}
            required
          />

          <label>Price</label>
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleInputChange}
            required
          />

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={productForm.quantity}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>
              Name<br></br><br></br>
              <select
                onChange={(e) => handleDropdownChange('name', e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Sorting</option>
                <option value="ascending">Sort A-Z</option>
                <option value="descending">Sort Z-A</option>
              </select>
            </th>
            <th>
              Description<br></br><br></br>
              <select
                onChange={(e) => handleDropdownChange('description', e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Sorting</option>
                <option value="ascending">Sort A-Z</option>
                <option value="descending">Sort Z-A</option>
              </select>
            </th>
            <th>
              Price<br></br><br></br>
              <select
                onChange={(e) => handleDropdownChange('price', e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Sorting</option>
                <option value="ascending">Sort Ascending</option>
                <option value="descending">Sort Descending</option>
              </select>
            </th>
            <th>
              Quantity<br></br><br></br>
              <select
                onChange={(e) => handleDropdownChange('quantity', e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Sorting</option>
                <option value="ascending">Sort Ascending</option>
                <option value="descending">Sort Descending</option>
              </select>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts
            .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPage;
