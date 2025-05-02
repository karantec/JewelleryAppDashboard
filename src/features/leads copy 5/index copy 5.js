import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { Formik, Form, Field } from "formik";

function Feature() {
  const [features, setFeatures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const featuresPerPage = 6;

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await axios.get(
        "https://backend.srilaxmialankar.com/feature"
      );
      setFeatures(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (err) {
      console.error("Failed to fetch features", err);
    }
  };

  const handleDelete = async (featureId) => {
    try {
      await axios.delete(
        `https://backend.srilaxmialankar.com/feature/${featureId}`
      );
      setFeatures(features.filter((feature) => feature._id !== featureId));
    } catch (err) {
      console.error("Failed to delete feature", err);
    }
  };

  const handleEdit = (feature) => {
    setSelectedFeature(feature);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(
        `https://backend.srilaxmialankar.com/feature/${selectedFeature._id}`,
        values
      );
      setSelectedFeature(null);
      fetchFeatures();
    } catch (err) {
      console.error("Failed to update feature", err);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post("https://backend.srilaxmialankar.com/feature", values);
      setIsCreateModalOpen(false);
      fetchFeatures();
    } catch (err) {
      console.error("Failed to create feature", err);
    }
  };

  const handleImageUpload = async (setFieldValue, file) => {
    if (!file) return;

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", "marketdata");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/de4ks8mkh/image/upload",
        imageData
      );
      setFieldValue("image", response.data.secure_url);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const indexOfLastFeature = currentPage * featuresPerPage;
  const indexOfFirstFeature = indexOfLastFeature - featuresPerPage;
  const currentFeatures = features.slice(
    indexOfFirstFeature,
    indexOfLastFeature
  );
  const totalPages = Math.ceil(features.length / featuresPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const FeatureFormModal = ({ title, onSubmit, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
      <Formik
        initialValues={{
          name: selectedFeature ? selectedFeature.name : "",
          description: selectedFeature ? selectedFeature.description : "",
          image: selectedFeature ? selectedFeature.image : "",
        }}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <Field
                name="name"
                as="input"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Name"
              />
              <Field
                name="description"
                as="textarea"
                className="w-full mt-2 p-2 border rounded resize-none"
                placeholder="Description"
                rows="5"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(setFieldValue, e.currentTarget.files[0])
                }
                className="w-full p-2 border rounded mt-2"
              />
              {values.image && (
                <img
                  src={values.image}
                  alt="Preview"
                  className="w-full h-32 object-cover mt-2 rounded-md"
                />
              )}
              <div className="mt-4 flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <TitleCard title="Feature Management">
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Feature
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentFeatures.map((feature) => (
            <div
              key={feature._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <img
                src={feature.image}
                alt={feature.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                {feature.name}
              </h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
              <p className="text-gray-400 mt-1 text-sm">
                Created: {new Date(feature.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(feature)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(feature._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </TitleCard>

      <FeatureFormModal
        title="Add New Feature"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />

      <FeatureFormModal
        title="Edit Feature"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedFeature(null)}
        isOpen={!!selectedFeature}
      />
    </div>
  );
}

export default Feature;
