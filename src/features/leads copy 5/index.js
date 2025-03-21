import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);





  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://jewelleryapp.onrender.com/category/getAllCategory');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('images', image); // Changed 'image' to 'images' to match backend

    try {
      const response = await axios.post('https://jewelleryapp.onrender.com/category/createCategory', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCategories([...categories, response.data]);
      setTitle('');
      setImage(null);
    } catch (err) {
      setError('Failed to post category');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-900 mb-6 text-center">Jewelry Categories</h1>
      {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

      {/* Category Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mb-8">
        <h2 className="text-lg font-semibold mb-4 text-center text-yellow-800">Add Category</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition duration-300">
          Post Category
        </button>
      </form>

      {/* Display Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 transform hover:scale-105 transition duration-300">
            <img src={category.image} alt={category.title} className="w-full h-48 object-cover rounded-lg mb-4 shadow-md" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">{category.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewCategoriesPage;