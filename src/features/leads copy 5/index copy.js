import { useState, useEffect, useRef } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function GoldPriceManagement() {
  const priceInputRef = useRef(null);
  const [goldPrices, setGoldPrices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [formData, setFormData] = useState({ 
    TodayGoldPricePerGram: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   
  const pricesPerPage = 6;

  useEffect(() => {
    fetchGoldPrices();
  }, []);

  useEffect(() => {
    // Delay focus slightly to ensure smooth transition
    setTimeout(() => {
      priceInputRef.current?.focus();
    }, 100);
  }, [isCreateModalOpen, selectedPrice]);

  const fetchGoldPrices = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gold-price/todayPrice");
      console.log("Fetched gold prices:", response.data);
      
      // Handle the response data correctly
      const priceData = response.data.data;
      // Convert to array if it's not already
      const pricesArray = Array.isArray(priceData) ? priceData : [priceData];
      
      setGoldPrices(pricesArray);
    } catch (err) {
      console.error("Failed to fetch gold prices", err);
    }
  };

  const handleDelete = async (priceId) => {
    try {  
      await axios.delete(`http://localhost:8000/gold-price/${priceId}`);
      setGoldPrices(goldPrices.filter((price) => price._id !== priceId));
    } catch (err) {
      console.error("Failed to delete gold price", err);
    }
  };

  const handleEdit = (price) => {
    setSelectedPrice(price);
    setFormData({
      TodayGoldPricePerGram: price.TodayGoldPricePerGram,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/gold-price/gold-price/${selectedPrice._id}`, formData);
      setSelectedPrice(null);
      fetchGoldPrices();
    } catch (err) {
      console.error("Failed to update gold price", err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`http://localhost:8000/goldprice/createPrice`, formData);
      setIsCreateModalOpen(false);
      resetFormData();
      fetchGoldPrices();
    } catch (err) {
      console.error("Failed to create gold price", err);
    }
  };

  const resetFormData = () => {
    setFormData({ 
      TodayGoldPricePerGram: "",
    });
  };

  const openCreateModal = () => {
    resetFormData();
    setIsCreateModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const indexOfLastPrice = currentPage * pricesPerPage;
  const indexOfFirstPrice = indexOfLastPrice - pricesPerPage;
  const currentPrices = goldPrices.slice(indexOfFirstPrice, indexOfLastPrice);

  // Format the date from a timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
  };

  // Form Modal component to be reused for both create and edit
  const PriceFormModal = ({ title, onSubmit, onCancel, isOpen }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <div className="mt-4">
            <label htmlFor="TodayGoldPricePerGram" className="block text-sm font-medium text-gray-700">Gold Price (per gram)</label>
            <input 
              type="number" 
              id="TodayGoldPricePerGram"
              name="TodayGoldPricePerGram"
              value={formData.TodayGoldPricePerGram} 
              ref={priceInputRef}  
              onChange={handleChange} 
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter gold price"
              autoFocus
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button 
              onClick={onSubmit} 
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Save
            </button>
            <button 
              onClick={onCancel} 
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <TitleCard title="Gold Price Management">
        {/* Add Gold Price Button */}
        <div className="mb-6">
          <button 
            onClick={openCreateModal}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add Today's Gold Price
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Gold Price (per gram)</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPrices.map((price) => (
                <tr key={price._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{formatDate(price.createdAt)}</td>
                  <td className="py-3 px-4">₹{price.TodayGoldPricePerGram}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(price)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(price._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentPrices.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                    No gold prices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage}</span>
          <button 
            onClick={() => setCurrentPage((prev) => (indexOfLastPrice < goldPrices.length ? prev + 1 : prev))} 
            disabled={indexOfLastPrice >= goldPrices.length} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </TitleCard>

      {/* Create Gold Price Modal */}
      <PriceFormModal 
        title="Add Today's Gold Price"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />

      {/* Edit Gold Price Modal */}
      <PriceFormModal 
        title="Edit Gold Price"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedPrice(null)}
        isOpen={!!selectedPrice}
      />
    </div>
  );
}

export default GoldPriceManagement;