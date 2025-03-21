import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountedPrice: '',
    weight: '',
    karat: '',
    description: '',
    coverImage: null,
    images: [],
    inStock: true,
  });

  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        images: files,
      }));
      toast.success("Images uploaded successfully!");
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        coverImage: file,
      }));
      toast.success("Cover image uploaded successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      for (let key in formData) {
        if (formData[key] instanceof FileList) {
          for (let file of formData[key]) {
            formDataToSubmit.append(key, file);
          }
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      }

      const response = await fetch('https://jewelleryapp.onrender.com//gold/add', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setFormData({
        name: '',
        category: '',
        price: '',
        discountedPrice: '',
        weight: '',
        karat: '',
        description: '',
        coverImage: null,
        images: [],
        inStock: true,
      });

      toast.success("Product added successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Add New Jewelry Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to add a new jewelry item to your inventory
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-lg rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Necklaces">Necklaces</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column */}
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Pricing & Specifications</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Regular Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      id="discountedPrice"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Weight (g)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="karat" className="block text-sm font-medium text-gray-700">
                      Karat
                    </label>
                    <select
                      id="karat"
                      name="karat"
                      value={formData.karat}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    >
                      <option value="">Select Karat</option>
                      <option value="14K">14K</option>
                      <option value="18K">18K</option>
                      <option value="22K">22K</option>
                      <option value="24K">24K</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Images</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                      Cover Image
                    </label>
                    <input
                      type="file"
                      id="coverImage"
                      name="coverImage"
                      onChange={handleCoverImageUpload}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      accept="image/*"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                      Additional Images
                    </label>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      onChange={handleImageUpload}
                      multiple
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Description Section */}
          <div className="px-6 pb-6">
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 pb-6">
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AddProductForm;
