import { useState, useEffect, useRef } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { useFormik } from "formik";

function GoldPriceManagement() {
  const [goldPrices, setGoldPrices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const pricesPerPage = 6;

  useEffect(() => {
    fetchGoldPrices();
  }, []);

  const fetchGoldPrices = async () => {
    try {
      const response = await axios.get("https://jewelleryapp.onrender.com/today-price/PriceRouting");
      if (!response.data || !Array.isArray(response.data)) {
        setGoldPrices([]);
        return;
      }
      setGoldPrices(response.data);
    } catch (err) {
      console.error("Failed to fetch gold prices", err);
    }
  };

  const handleDelete = async (priceId) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await axios.delete(`https://jewelleryapp.onrender.com/today-price/price/${priceId}`);
      setGoldPrices((prev) => prev.filter((price) => price._id !== priceId));
    } catch (err) {
      console.error("Failed to delete gold price", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (price) => {
    setSelectedPrice(price);
    formik.setValues({
      Carat: price.Carat || "",
      TodayPricePerGram: price.TodayPricePerGram || "",
    });
    setIsCreateModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedPrice || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await axios.patch(`https://jewelleryapp.onrender.com/today-price/price/${selectedPrice._id}`, formik.values);
      await fetchGoldPrices();
      closeModal();
    } catch (err) {
      console.error("Failed to update gold price", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await axios.post("https://jewelleryapp.onrender.com/today-price/todayPrice", formik.values);
      await fetchGoldPrices();
      closeModal();
    } catch (err) {
      console.error("Failed to create gold price", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreateModal = () => {
    formik.resetForm();
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setSelectedPrice(null);
    formik.resetForm();
  };

  const indexOfLastPrice = currentPage * pricesPerPage;
  const indexOfFirstPrice = indexOfLastPrice - pricesPerPage;
  const currentPrices = goldPrices.slice(indexOfFirstPrice, indexOfLastPrice);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString();
  };

  useEffect(() => {
    if (isCreateModalOpen || selectedPrice) {
      inputRef.current?.focus();
    }
  }, [isCreateModalOpen, selectedPrice]);

  const PriceFormModal = ({ title, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Carat</label>
              <input
                type="text"
                name="Carat"
                value={formik.values.Carat}
                onChange={formik.handleChange}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter Carat (e.g. 18K)"
                autoFocus
                ref={inputRef}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Gold Price (per gram)</label>
              <input
                type="number"
                name="TodayPricePerGram"
                value={formik.values.TodayPricePerGram}
                onChange={formik.handleChange}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter gold price"
                autoFocus
                ref={inputRef}
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
                Save
              </button>
              <button type="button" onClick={onCancel} className="px-4 py-2 bg-red-500 text-white rounded-md">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const formik = useFormik({
    initialValues: { Carat: "", TodayPricePerGram: "" },
    onSubmit: () => {
      if (selectedPrice) {
        handleUpdate();
      } else {
        handleCreate();
      }
    },
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <TitleCard title="Gold Price Management">
        <div className="mb-6">
          <button onClick={openCreateModal} className="px-4 py-2 bg-green-500 text-white rounded-md">
            Add Today's Gold Price
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Carat</th>
                <th className="py-3 px-4 text-left">Gold Price (per gram)</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPrices.map((price) => (
                <tr key={price._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{formatDate(price.createdAt)}</td>
                  <td className="py-3 px-4">{price.Carat}</td>
                  <td className="py-3 px-4">₹{price.TodayPricePerGram}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(price)} className="px-3 py-1 bg-blue-500 text-white rounded-md">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(price._id)} className="px-3 py-1 bg-red-500 text-white rounded-md">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentPrices.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                    No gold prices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TitleCard>

      <PriceFormModal title={selectedPrice ? "Edit Gold Price" : "Add Today's Gold Price"} onCancel={closeModal} isOpen={isCreateModalOpen || !!selectedPrice} />
    </div>
  );
}

export default GoldPriceManagement;
