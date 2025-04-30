import React, { useImperativeHandle, forwardRef, useState } from "react";

const EditProductModal = forwardRef(({ onSave }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    netWeight: "",
    description: "",
  });

  useImperativeHandle(ref, () => ({
    openModal(data) {
      setProductData(data);
      setIsOpen(true);
    },
  }));

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(productData);
    setIsOpen(false);
  };

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

        <input
          name="name"
          value={productData.name || ""}
          onChange={handleChange}
          className="border w-full p-2 mb-3"
          placeholder="Name"
          required
        />

        <input
          name="category"
          value={productData.category || ""}
          onChange={handleChange}
          className="border w-full p-2 mb-3"
          placeholder="Category"
          required
        />

        <input
          name="netWeight"
          value={productData.netWeight || ""}
          onChange={handleChange}
          className="border w-full p-2 mb-3"
          placeholder="Net Weight"
          required
        />

        <textarea
          name="description"
          value={productData.description || ""}
          onChange={handleChange}
          className="border w-full p-2 mb-3"
          placeholder="Description"
          rows={3}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-400 rounded text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 rounded text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});

export default EditProductModal;
