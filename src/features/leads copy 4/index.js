import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caratPrices, setCaratPrices] = useState({});
  const [calculatedPrices, setCalculatedPrices] = useState({});
  const [wsStatus, setWsStatus] = useState('Initializing...');
  const [usePolling, setUsePolling] = useState(false);
  const socketRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  
  // Memoize the price calculation function
  const calculateProductPrices = useCallback((productsList, prices) => {
    console.log('Calculating prices with gold prices:', prices);
    if (!Object.keys(prices).length || !productsList.length) return;
    
    const newPrices = {};
    productsList.forEach(product => {
      try {
        // Use consistent property names
        const netWeight = product.netWeight || 0;
        const carat = product.carat || '';
        const makingCharge = parseFloat(product.makingcharge) || 0;
        
        if (netWeight && carat && !isNaN(netWeight)) {
          const caratKey = carat.toUpperCase();
          const goldPricePerGram = parseFloat(prices[caratKey]);
          
          // Make sure we have a valid gold price
          if (!goldPricePerGram || isNaN(goldPricePerGram)) {
            console.warn(`Invalid gold price for ${caratKey}:`, prices[caratKey]);
            return;
          }
          
          // Calculate gold price based on weight and current rate
          const goldPrice = netWeight * goldPricePerGram;
          
          // Calculate making charge amount (as percentage of gold price)
          const makingChargeAmount = (goldPrice * makingCharge) / 100;
          
          // Calculate total price
          const totalPrice = goldPrice + makingChargeAmount;
          
          // Store the calculated price with detailed breakdown for debugging
          newPrices[product._id] = {
            total: totalPrice.toFixed(2),
            breakdown: {
              goldPrice: goldPrice.toFixed(2),
              makingChargeAmount: makingChargeAmount.toFixed(2),
              netWeight,
              pricePerGram: goldPricePerGram,
              makingChargePercentage: makingCharge
            }
          };
          
          console.log(`Price calculated for ${product.name}: ₹${totalPrice.toFixed(2)}`);
        } else {
          console.warn('Missing required product data for price calculation:', {
            netWeight, carat, makingCharge, productId: product._id
          });
        }
      } catch (err) {
        console.error('Error calculating price for product:', product._id, err);
      }
    });
    
    console.log('New calculated prices:', newPrices);
    setCalculatedPrices(newPrices);
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://jewelleryapp.onrender.com/gold',);
      console.log('Fetched products:', response.data);
      
      let productsData = [];
      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      } else {
        setError('Unexpected data format received');
      }
      
      setProducts(productsData);
      
      // If we already have gold prices, calculate product prices immediately
      if (Object.keys(caratPrices).length) {
        calculateProductPrices(productsData, caratPrices);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoldPrices = async () => {
    try {
      const response = await axios.get('https://jewelleryapp.onrender.com/today-price/PriceRouting');
      console.log('Fetched gold prices:', response.data);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Convert array to object with Carat as key and TodayPricePerGram as value
        const prices = {};
        response.data.forEach(item => {
          prices[item.Carat] = item.TodayPricePerGram;
        });
        
        setCaratPrices(prices);
        return prices;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch gold prices:', err);
      return null;
    }
  };

  // Setup polling as a fallback for WebSocket
  const setupPolling = useCallback(() => {
    console.log('Setting up polling for gold price updates');
    setUsePolling(true);
    setWsStatus('Using polling (30s interval)');
    
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Fetch immediately and then set up interval
    fetchGoldPrices();
    
    pollingIntervalRef.current = setInterval(async () => {
      console.log('Polling for gold price update');
      await fetchGoldPrices();
    }, 30000); // Poll every 30 seconds
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Set up WebSocket with fallback to polling
  const setupWebSocket = useCallback(() => {
    // If we're already using polling, don't try WebSocket again
    if (usePolling) {
      return setupPolling();
    }
    
    const wsUrl = 'ws://https://jewelleryapp.onrender.com/ws/goldprice';
    
    console.log('Attempting to set up WebSocket connection');
    setWsStatus('Connecting...');
    
    try {
      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Create new WebSocket connection
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      let connectionTimeout = setTimeout(() => {
        console.log('WebSocket connection timed out');
        socket.close();
        setupPolling();
      }, 5000);
      
      socket.onopen = () => {
        console.log('WebSocket connected successfully');
        clearTimeout(connectionTimeout);
        setWsStatus('Connected (real-time)');
        setUsePolling(false);
      };
      
      socket.onmessage = async (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          
          // If we receive a price update notification, fetch the latest prices
          if (data && data.type === 'PRICE_UPDATE') {
            await fetchGoldPrices();
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(connectionTimeout);
        setWsStatus('Connection failed, switching to polling');
        setupPolling();
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket closed, code:', event.code);
        if (!usePolling) {
          // Only try to reconnect if we haven't switched to polling
          setWsStatus('Disconnected, attempting to reconnect...');
          setTimeout(() => setupWebSocket(), 5000);
        }
      };
      
      return () => {
        clearTimeout(connectionTimeout);
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setupPolling();
      return () => {};
    }
  }, [setupPolling, usePolling]);
  
  // Initial setup on component mount
  useEffect(() => {
    console.log('Component mounted, initializing...');
    
    const initializeData = async () => {
      const prices = await fetchGoldPrices();
      await fetchProducts();
      if (prices && Object.keys(prices).length > 0 && products.length > 0) {
        calculateProductPrices(products, prices);
      }
    };
    
    initializeData();
    const cleanup = setupWebSocket();
    
    return () => {
      console.log('Component unmounting, cleaning up...');
      if (typeof cleanup === 'function') {
        cleanup();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [setupWebSocket]);
  
  // Recalculate prices when gold prices or products change
  useEffect(() => {
    if (Object.keys(caratPrices).length > 0 && products.length > 0) {
      calculateProductPrices(products, caratPrices);
    }
  }, [caratPrices, products, calculateProductPrices]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`https://jewelleryapp.onrender.com/gold/${id}`);
        fetchProducts(); // Refresh the products list after deletion
        alert('Product deleted successfully');
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Updated handleEdit function to fetch product by ID before redirecting
  const handleEdit = async (id) => {
    try {
      // Fetch the product data by ID
      const response = await axios.get(`https://jewelleryapp.onrender.com/gold/${id}`);
      
      if (response.data) {
        console.log('Product data for editing:', response.data);
        // Store the product data in localStorage or state management solution if needed
        // This can be useful if you want to pre-populate the edit form
        localStorage.setItem('editProduct', JSON.stringify(response.data));
        
        // Redirect to edit page
        window.location.href = `/edit-product/${id}`;
      } else {
        alert('Could not retrieve product details');
      }
    } catch (err) {
      console.error('Error fetching product for edit:', err);
      alert('Failed to retrieve product details: ' + (err.response?.data?.message || err.message));
    }
  };

  // Manual refresh button handler
  const handleManualRefresh = async () => {
    await fetchGoldPrices();
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Next page
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get list of carats from API data
  const caratList = Object.keys(caratPrices).sort((a, b) => {
    // Sort by carat value (extract number from string like "24K")
    const caratA = parseInt(a.replace(/\D/g, ''));
    const caratB = parseInt(b.replace(/\D/g, ''));
    return caratB - caratA; // Sort highest to lowest
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-yellow-700">Jewellery Products</h1>
        {Object.keys(caratPrices).length > 0 && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-yellow-800">Today's Gold Prices</span>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full ${
                  wsStatus.includes('Connected') ? 'bg-green-500' : 
                  wsStatus.includes('polling') ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
                <span className="text-xs text-yellow-600 ml-2">{wsStatus}</span>
              </div>
            </div>
            
            {/* Carat-wise price grid */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {caratList.map(carat => (
                <div key={carat} className="bg-yellow-50 p-2 rounded border border-yellow-200">
                  <div className="text-xs text-yellow-800">{carat} Gold </div>
                  <div className="text-lg font-bold text-yellow-700">
                    ₹{parseFloat(caratPrices[carat]).toLocaleString()}/g
                  </div>
                </div>
              ))}
              {/* Add placeholder if we have odd number of carats */}
              {caratList.length % 2 !== 0 && (
                <div className="bg-yellow-50 p-2 rounded border border-yellow-200 opacity-0"></div>
              )}
            </div>
            
            <div className="flex justify-end mt-1">
              <button 
                onClick={handleManualRefresh} 
                className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
              >
                Refresh Prices
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isLoading && <p className="text-center py-4">Loading products...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      {!isLoading && products.length === 0 && <p className="text-center py-4">No products found.</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {currentProducts.map(product => (
          <div key={product._id} className="bg-white p-4 rounded-lg shadow-md border">
            <img 
              src={product.images?.[0] || product.coverImage || 'https://via.placeholder.com/150'} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-lg mb-4" 
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                {product.carat || product.karat || "N/A"}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                Net: {product.netWeight || product.weight || "N/A"}g
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                Gross: {product.grossWeight || product.weight || "N/A"}g
              </span>
            </div>
            
            {calculatedPrices[product._id] ? (
  <div className="mt-3 mb-3 border-t border-b py-2">
    <span className="text-sm font-medium text-gray-700">Current Price:</span>
    <span className="text-lg font-bold text-yellow-700">
      ₹{parseFloat(calculatedPrices[product._id].total).toLocaleString()}
    </span>
    {/* <p className="text-xs text-gray-500">
      Based on today's gold rate (₹{parseFloat(calculatedPrices[product._id].breakdown.pricePerGram).toLocaleString()}/g) 
      and {product.makingcharge}% making charge
    </p> */}
    {/* <div className="text-xs text-gray-500 mt-1">
      <span>Gold: ₹{parseFloat(calculatedPrices[product._id].breakdown.goldPrice).toLocaleString()}</span>
      <span className="mx-1">+</span>
      <span>Making: ₹{parseFloat(calculatedPrices[product._id].breakdown.makingChargeAmount).toLocaleString()}</span>
    </div> */}
  </div>
) : (
  product.price && (
    <div className="mt-3 mb-3 border-t border-b py-2">
      <span className="text-sm font-medium text-gray-700">Price:</span>
      <span className="text-lg font-bold text-yellow-700">₹{product.price.toLocaleString()}</span>
      {product.discountedPrice && (
        <p className="text-xs text-green-600">Discounted: ₹{product.discountedPrice.toLocaleString()}</p>
      )}
    </div>
  )
)}
            
            {/* Action buttons row */}
            <div className="flex gap-2 mt-4">
              {/* <button 
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex justify-center items-center" 
                onClick={() => handleEdit(product._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button> */}
              <button 
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex justify-center items-center" 
                onClick={() => handleDelete(product._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center items-center mt-8">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => {
              // Show only 5 page numbers at a time with current page in the middle if possible
              const pageNum = index + 1;
              const totalPages = Math.ceil(products.length / productsPerPage);
              
              // Always show first page, last page, current page, and pages adjacent to current page
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ||
                (currentPage <= 3 && pageNum <= 5) ||
                (currentPage >= totalPages - 2 && pageNum >= totalPages - 4)
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => paginate(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === pageNum
                        ? 'z-10 bg-yellow-50 border-yellow-500 text-yellow-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              
              // Show ellipsis for skipped pages
              if (
                (pageNum === 2 && currentPage > 4) ||
                (pageNum === totalPages - 1 && currentPage < totalPages - 3)
              ) {
                return (
                  <span
                    key={index}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              
              return null;
            })}
            
            <button
              onClick={nextPage}
              disabled={currentPage === Math.ceil(products.length / productsPerPage)}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                currentPage === Math.ceil(products.length / productsPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } text-sm font-medium`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* Page information */}
      {products.length > 0 && (
        <div className="text-sm text-gray-500 text-center mt-4">
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
        </div>
      )}
    </div>
  );
};

export default ProductsPage;