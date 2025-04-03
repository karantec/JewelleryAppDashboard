import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    netWeight: '',
    grossWeight: '',
    carat: '',
    makingcharge: '',
    description: '',
    coverImage: null,
    images: [],
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [caratPrices, setCaratPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://jewelleryapp.onrender.com/category/getAllCategory');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  // Function to fetch gold prices for all carats
  const fetchGoldPrices = async () => {
    try {
      const response = await fetch('http://localhost:8000/today-price/PriceRouting');
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        // Check if prices have changed
        const pricesChanged = JSON.stringify(data) !== JSON.stringify(caratPrices);
        
        if (pricesChanged) {
          setCaratPrices(data);
          
          // If user has selected a carat, update the current price
          if (formData.carat) {
            const selectedCaratPrice = data.find(price => price.Carat === formData.carat);
            if (selectedCaratPrice) {
              const newPrice = selectedCaratPrice.TodayPricePerGram;
              setCurrentPrice(newPrice);
              
              // Only show toast if not initial load and price has changed
              if (currentPrice && currentPrice !== newPrice && !isPolling) {
                toast.info(`${formData.carat} gold price has been updated!`);
              }
            }
          }
        }
        return true;
      } else {
        throw new Error('Invalid gold price data');
      }
    } catch (error) {
      console.error('Error fetching gold prices:', error);
      if (!isPolling) {
        toast.error('Failed to fetch gold prices');
      }
      return false;
    }
  };

  // Initial fetch of gold prices and then poll every second
  useEffect(() => {
    // Initial fetch
    fetchGoldPrices();
    
    // Set up polling every 1 second
    setIsPolling(true);
    const intervalId = setInterval(() => {
      fetchGoldPrices();
    }, 1000);
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, []);

  // Update current price when carat changes
  useEffect(() => {
    if (formData.carat && caratPrices.length > 0) {
      const selectedCaratPrice = caratPrices.find(price => price.Carat === formData.carat);
      if (selectedCaratPrice) {
        setCurrentPrice(selectedCaratPrice.TodayPricePerGram);
      }
    }
  }, [formData.carat, caratPrices]);

  // Calculate total price whenever netWeight, currentPrice, or makingcharge changes
  useEffect(() => {
    if (formData.netWeight && currentPrice && formData.makingcharge) {
      const netWeight = parseFloat(formData.netWeight);
      const goldPricePerGram = parseFloat(currentPrice);
      const makingChargePercent = parseFloat(formData.makingcharge);
      
      if (!isNaN(netWeight) && !isNaN(goldPricePerGram) && !isNaN(makingChargePercent)) {
        const goldPrice = netWeight * goldPricePerGram;
        const makingChargeAmount = (goldPrice * makingChargePercent) / 100;
        const calculatedTotal = goldPrice + makingChargeAmount;
        
        setTotalPrice(calculatedTotal.toFixed(2));
      }
    }
  }, [formData.netWeight, currentPrice, formData.makingcharge]);

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
      toast.success('Images uploaded successfully!');
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        coverImage: file,
      }));
      toast.success('Cover image uploaded successfully!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      for (let key in formData) {
        if (key === 'images' && formData[key] instanceof FileList) {
          for (let file of formData[key]) {
            formDataToSubmit.append('images', file);
          }
        } else if (key === 'coverImage' && formData[key] instanceof File) {
          formDataToSubmit.append('coverImage', formData[key]);
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      }

      const response = await fetch('http://localhost:8000/gold/add', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct.product]);
      setFormData({
        name: '',
        category: '',
        netWeight: '',
        grossWeight: '',
        carat: '',
        makingcharge: '',
        description: '',
        coverImage: null,
        images: [],
      });
      setTotalPrice(0);

      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Add New Jewellery Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to add a new jewelry item to your inventory
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Information */}
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
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Middle Column - Specifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Specifications</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="netWeight" className="block text-sm font-medium text-gray-700">
                    Net Weight (in grams)
                  </label>
                  <input
                    type="number"
                    id="netWeight"
                    name="netWeight"
                    min="0"
                    step="0.01"
                    value={formData.netWeight}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="grossWeight" className="block text-sm font-medium text-gray-700">
                    Gross Weight (in grams)
                  </label>
                  <input
                    type="number"
                    id="grossWeight"
                    name="grossWeight"
                    min="0"
                    step="0.01"
                    value={formData.grossWeight}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="carat" className="block text-sm font-medium text-gray-700">
                    Carat Value
                  </label>
                  <select
                    id="carat"
                    name="carat"
                    value={formData.carat}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  >
                    <option value="" disabled>Select Carat Value</option>
                    <option value="24K">24K (99.9% pure)</option>
                    <option value="22K">22K (91.6% pure)</option>
                    <option value="18K">18K (75% pure)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing & Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Pricing & Images</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Today's Gold Price Per Gram
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={currentPrice || ''}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50"
                      readOnly
                    />
                    <div className="absolute right-3 top-2">
                      <span className="text-xs text-green-600 font-medium">Auto-updating</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formData.carat ? `Current ${formData.carat} gold price` : 'Select a carat value to see price'}
                  </p>
                </div>
               
                <div className="space-y-2">
                  <label htmlFor="makingcharge" className="block text-sm font-medium text-gray-700">
                    Making Charge (%)
                  </label>
                  <input
                    type="number"
                    id="makingcharge"
                    name="makingcharge"
                    min="0"
                    step="0.01"
                    value={formData.makingcharge}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                  <p className="text-xs text-gray-500">Enter percentage (e.g., 10 for 10%)</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Calculated Total Price
                  </label>
                  <div className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50 text-gray-700 font-semibold">
                    {totalPrice > 0 ? `₹${totalPrice}` : 'Fill in weight, carat and making charge fields'}
                  </div>
                  {totalPrice > 0 && (
                    <div className="text-xs text-gray-600">
                      <p>Gold value: ₹{(parseFloat(formData.netWeight) * currentPrice).toFixed(2)}</p>
                      <p>Making charge: ₹{((parseFloat(formData.netWeight) * currentPrice) * parseFloat(formData.makingcharge) / 100).toFixed(2)}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    onChange={handleCoverImageUpload}
                    accept="image/*"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                    accept="image/*"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors duration-200"
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

export default AddProduct;