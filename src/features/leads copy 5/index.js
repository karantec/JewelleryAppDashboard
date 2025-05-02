import { useState, useEffect, useRef } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function ServiceList() {
  const titleInputRef = useRef(null);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const servicesPerPage = 6;

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Delay focus slightly to ensure smooth transition
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "https://backend.srilaxmialankar.com/category/getAllCategory"
      );
      setServices(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(
        `https://backend.srilaxmialankar.comcategory/deleteCategory/${serviceId}`
      );
      setServices(services.filter((service) => service._id !== serviceId));
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      image: service.image,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://backend.srilaxmialankar.com/category/updateCategory/${selectedService._id}`,
        formData
      );
      setSelectedService(null);
      fetchServices();
    } catch (err) {
      console.error("Failed to update service", err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        `https://backend.srilaxmialankar.com/category/createCategory`,
        formData
      );
      setIsCreateModalOpen(false);
      resetFormData();
      fetchServices();
    } catch (err) {
      console.error("Failed to create service", err);
    }
  };

  const resetFormData = () => {
    setFormData({ title: "", image: "" });
  };

  const openCreateModal = () => {
    resetFormData();
    setIsCreateModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "marketdata"); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/de4ks8mkh/image/upload", // Replace with your Cloudinary cloud name
        imageData
      );
      setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(
    indexOfFirstService,
    indexOfLastService
  );

  // Form Modal component to be reused for both create and edit
  const ServiceFormModal = ({ title, onSubmit, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <input
            type="text"
            name="title"
            value={formData.title}
            ref={titleInputRef}
            onChange={handleChange}
            className="w-full mt-2 p-2 border rounded"
            placeholder="Category Name"
            autoFocus
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded mt-2"
          />

          {/* Preview Current Image */}
          {formData.image && (
            <img
              src={formData.image}
              alt="Service Preview"
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
      <TitleCard title="Category List">
        {/* Add Service Button */}
        <div className="mb-6">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentServices.map((service) => (
            <div
              key={service._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                {service.title}
              </h3>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
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
                indexOfLastService < services.length ? prev + 1 : prev
              )
            }
            disabled={indexOfLastService >= services.length}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </TitleCard>

      {/* Create Service Modal */}
      <ServiceFormModal
        title="Add New Service"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />

      {/* Edit Service Modal */}
      <ServiceFormModal
        title="Edit Service"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedService(null)}
        isOpen={!!selectedService}
      />
    </div>
  );
}

export default ServiceList;
