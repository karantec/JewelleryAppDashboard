import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { Formik, Form, Field } from "formik";

function ShopDetail() {
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
      const response = await axios.get("http://localhost:8000/shopdetails");
      setItems(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/shopdetails/${id}`);
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
        `http://localhost:8000/shopdetails/${selectedItem._id}`,
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
      await axios.post("http://localhost:8000/shopdetails", values);
      setIsCreateModalOpen(false);
      setCurrentPage(1);
      fetchItems();
    } catch (err) {
      console.error("Failed to create item", err);
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
          modelNumber: selectedItem?.modelNumber || "",
          description: selectedItem?.description || "",
          style: selectedItem?.style || "",
          certificate: selectedItem?.certificate || "",
          goldPurity: selectedItem?.goldPurity || "",
          totalWeight: selectedItem?.totalWeight || "",
          setIncludes: selectedItem?.setIncludes?.join(", ") || "",
          occasion: selectedItem?.occasion?.join(", ") || "",
          designTheme: selectedItem?.designTheme?.join(", ") || "",
          finish: selectedItem?.finish || "",
        }}
        onSubmit={(values) => {
          const formatted = {
            ...values,
            setIncludes: values.setIncludes.split(",").map((s) => s.trim()),
            occasion: values.occasion.split(",").map((s) => s.trim()),
            designTheme: values.designTheme.split(",").map((s) => s.trim()),
          };
          onSubmit(formatted);
        }}
      >
        {() => (
          <Form className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <Field
                name="modelNumber"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Model Number"
              />
              <Field
                name="description"
                as="textarea"
                className="w-full mt-2 p-2 border rounded resize-none"
                rows="3"
                placeholder="Description"
              />
              <Field
                name="style"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Style"
              />
              <Field
                name="certificate"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Certificate"
              />
              <Field
                name="goldPurity"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Gold Purity"
              />
              <Field
                name="totalWeight"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Total Weight"
              />
              <Field
                name="setIncludes"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Set Includes (comma-separated)"
              />
              <Field
                name="occasion"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Occasion (comma-separated)"
              />
              <Field
                name="designTheme"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Design Theme (comma-separated)"
              />
              <Field
                name="finish"
                className="w-full mt-2 p-2 border rounded"
                placeholder="Finish"
              />

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
      <TitleCard title="Shop Detail Management">
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Detail
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentItems.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-5 shadow-lg bg-white"
            >
              <h3 className="text-lg font-bold">{item.modelNumber}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Style:</strong> {item.style}
                </li>
                <li>
                  <strong>Certificate:</strong> {item.certificate}
                </li>
                <li>
                  <strong>Gold Purity:</strong> {item.goldPurity}
                </li>
                <li>
                  <strong>Total Weight:</strong> {item.totalWeight}
                </li>
                <li>
                  <strong>Set Includes:</strong> {item.setIncludes?.join(", ")}
                </li>
                <li>
                  <strong>Occasion:</strong> {item.occasion?.join(", ")}
                </li>
                <li>
                  <strong>Design Theme:</strong> {item.designTheme?.join(", ")}
                </li>
                <li>
                  <strong>Finish:</strong> {item.finish}
                </li>
              </ul>

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

        {/* Pagination */}
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
        title="Add New Detail"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />
      <ItemFormModal
        title="Edit Detail"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedItem(null)}
        isOpen={!!selectedItem}
      />
    </div>
  );
}

export default ShopDetail;
