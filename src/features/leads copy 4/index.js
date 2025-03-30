import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const ViewProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGoldPrice, setCurrentGoldPrice] = useState(null);
  const [calculatedPrices, setCalculatedPrices] = useState({});
  const [wsStatus, setWsStatus] = useState('Initializing...');
  const [usePolling, setUsePolling] = useState(false);
  const socketRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  
  // Memoize the price calculation function
  const calculateProductPrices = useCallback((productsList, goldPrice) => {
    console.log('Calculating prices with gold price:', goldPrice);
    if (!goldPrice || !productsList.length) return;
    
    const newPrices = {};
    productsList.forEach(product => {
      const netWeight = product.netWeight || product.weight;
      const carat = product.carat || product.karat;
      
      if (netWeight && carat) {
        let adjustedGoldPrice = goldPrice;
        const makingCharge = product.makingcharge || 0;
        
        if (carat === '22K') adjustedGoldPrice = (goldPrice * 22) / 24;
        else if (carat === '18K') adjustedGoldPrice = (goldPrice * 18) / 24;
        
        const totalPrice = netWeight * (adjustedGoldPrice + parseFloat(makingCharge));
        newPrices[product._id] = totalPrice.toFixed(2);
      }
    });
    
    console.log('New calculated prices:', newPrices);
    setCalculatedPrices(newPrices);
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/gold', { withCredentials: true });
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
      
      // If we already have the gold price, calculate prices immediately
      if (currentGoldPrice) {
        calculateProductPrices(productsData, currentGoldPrice);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoldPrice = useCallback((newPrice) => {
    console.log('Updating gold price to:', newPrice);
    setCurrentGoldPrice(newPrice);
  }, []);

  const fetchGoldPrice = async () => {
    try {
      const response = await axios.get('http://localhost:8000/gold-price/todayPrice');
      const price = response.data?.data?.TodayGoldPricePerGram || null;
      if (price) {
        updateGoldPrice(price);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to fetch gold price:', err);
      return false;
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
    fetchGoldPrice();
    
    pollingIntervalRef.current = setInterval(async () => {
      console.log('Polling for gold price update');
      await fetchGoldPrice();
    }, 30000); // Poll every 30 seconds
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [updateGoldPrice]);

  // Set up WebSocket with fallback to polling
  const setupWebSocket = useCallback(() => {
    // If we're already using polling, don't try WebSocket again
    if (usePolling) {
      return setupPolling();
    }
    
    const wsUrl = 'ws://localhost:8000/ws/goldprice';
    
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
      
      socket.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          
          if (data && 'TodayGoldPricePerGram' in data) {
            updateGoldPrice(data.TodayGoldPricePerGram);
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
  }, [setupPolling, updateGoldPrice, usePolling]);
  
  // Initial setup on component mount
  useEffect(() => {
    console.log('Component mounted, initializing...');
    fetchProducts();
    fetchGoldPrice();
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
  
  // Recalculate prices when gold price changes
  useEffect(() => {
    if (currentGoldPrice && products.length > 0) {
      calculateProductPrices(products, currentGoldPrice);
    }
  }, [currentGoldPrice, products, calculateProductPrices]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8000/gold/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  // Manual refresh button handler
  const handleManualRefresh = async () => {
    await fetchGoldPrice();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-yellow-700">Jewellery Products</h1>
        {currentGoldPrice !== null && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 flex flex-col items-end">
            <div className="flex items-center">
              <span className="text-sm text-yellow-800 mr-2">Today's Gold Price (24K)</span>
              <span className={`w-2 h-2 rounded-full ${
                wsStatus.includes('Connected') ? 'bg-green-500' : 
                wsStatus.includes('polling') ? 'bg-yellow-500' : 'bg-red-500'
              }`}></span>
            </div>
            <span className="text-xl font-bold text-yellow-700">₹{parseFloat(currentGoldPrice).toLocaleString()}/g</span>
            <div className="flex items-center mt-1">
              <span className="text-xs text-yellow-600 mr-2">{wsStatus}</span>
              <button 
                onClick={handleManualRefresh} 
                className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isLoading && <p className="text-center py-4">Loading products...</p>}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      {!isLoading && products.length === 0 && <p className="text-center py-4">No products found.</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map(product => (
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
                <span className="text-lg font-bold text-yellow-700">₹{parseFloat(calculatedPrices[product._id]).toLocaleString()}</span>
                <p className="text-xs text-gray-500">Based on today's gold rate and {product.carat || product.karat} purity</p>
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
            
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors" 
                    onClick={() => handleDelete(product._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProductsPage;