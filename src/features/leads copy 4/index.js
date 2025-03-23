import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://jewelleryapp.onrender.com/gold', {
        withCredentials: true // Added for CORS credentials
      });
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`https://jewelleryapp.onrender.com/gold/${id}`, {
          withCredentials: true // Added for CORS credentials
        });
        await fetchProducts(); // Refetch data after deletion for consistency
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-yellow-700 mb-6">Jewelry Products</h1>
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && products.length === 0 && <p>No products found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/150'}
              alt={product.name || 'Product Image'}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <p className="text-sm text-gray-500">{product.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Net Weight {product.netWeight}g | Gross Weight {product.grossWeight}
            </p>

            <div className="mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProductsPage;
