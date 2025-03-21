import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://jewelleryapp.onrender.com/gold');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-yellow-700 mb-6">Jewelry Products</h1>
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map((product, index) => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <img
              src={product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <p className="text-sm text-gray-500">{product.description}</p>
            <p className="mt-4">
              <span className="font-semibold">Price:</span> ${product.price}
            </p>
            {product.discountedPrice && (
              <p className="text-sm text-gray-500 line-through">${product.discountedPrice}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">{product.weight}g | {product.karat}</p>
            <p className="text-sm mt-2">
              <span className="font-semibold">In Stock:</span> {product.inStock ? 'Yes' : 'No'}
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold">Edit</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProductsPage;
