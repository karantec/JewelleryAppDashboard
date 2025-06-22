import { useState, useEffect, useRef } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function AppScheme() {
  const titleInputRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({ image: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const bannersPerPage = 6;

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/appBanner`);
      setBanners(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/appBanner/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setFormData({ image: banner.image });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8000/appBanner/${selectedBanner._id}`,
        formData
      );
      setSelectedBanner(null);
      fetchBanners();
    } catch (err) {
      console.error("Failed to update banner", err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`http://localhost:8000/appBanner`, formData);
      setIsCreateModalOpen(false);
      resetFormData();
      fetchBanners();
    } catch (err) {
      console.error("Failed to create banner", err);
    }
  };

  const resetFormData = () => setFormData({ image: "" });

  const openCreateModal = () => {
    resetFormData();
    setIsCreateModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "marketdata"); // Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dl16jnera/image/upload", // Cloud name
        imageData
      );
      setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const indexOfLast = currentPage * bannersPerPage;
  const indexOfFirst = indexOfLast - bannersPerPage;
  const currentBanners = banners.slice(indexOfFirst, indexOfLast);

  const BannerFormModal = ({ title, onSubmit, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded mt-2"
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-32 object-cover mt-2 rounded-md"
            />
          )}

          <div className="mt-4 flex justify-between">
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
      <TitleCard title="App Banners">
        <div className="mb-6">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBanners.map((banner) => (
            <div
              key={banner._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <img
                src={banner.image}
                alt="Banner"
                className="w-full h-40 object-cover rounded-md"
              />

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(banner)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
            onClick={() =>
              setCurrentPage((prev) =>
                indexOfLast < banners.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLast >= banners.length}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </TitleCard>

      {/* Create & Edit Modals */}
      <BannerFormModal
        title="Add New Banner"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />

      <BannerFormModal
        title="Edit Banner"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedBanner(null)}
        isOpen={!!selectedBanner}
      />
    </div>
  );
}

export default AppScheme;
