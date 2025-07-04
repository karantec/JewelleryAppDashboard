import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { Formik, Form, Field } from "formik";

function Related() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/related/");
      setItems(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/related/${id}`);
      const updatedItems = items.filter((item) => item._id !== id);
      const totalPages = Math.ceil(updatedItems.length / itemsPerPage);
      setCurrentPage((prevPage) => Math.min(prevPage, totalPages || 1));
      setItems(updatedItems);
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(
        `http://localhost:8000/related/${selectedItem._id}`,
        values
      );
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      console.error("Failed to update item", err);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post("http://localhost:8000/related/", values);
      setIsCreateModalOpen(false);
      setCurrentPage(1);
      fetchItems();
    } catch (err) {
      console.error("Failed to create item", err);
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

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = items.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const ItemFormModal = ({ title, onSubmit, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
      <Formik
        initialValues={{
          name: selectedItem ? selectedItem.name : "",
          description: selectedItem ? selectedItem.description : "",
          image: selectedItem ? selectedItem.image : "",
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
                className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Name"
              />
              <Field
                name="description"
                as="textarea"
                className="w-full mt-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
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
      <TitleCard title="Related Product Management">
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                {item.name}
              </h3>
              <p className="text-gray-600 mt-2">{item.description}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </TitleCard>

      <ItemFormModal
        title="Add New Item"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />

      <ItemFormModal
        title="Edit Item"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedItem(null)}
        isOpen={!!selectedItem}
      />
    </div>
  );
}

export default Related;
