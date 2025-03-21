import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AboutForm() {
  const [about, setAbout] = useState("");
  const [title, setTitle] = useState("");
  const [description1, setDescription1] = useState("");
  const [history, setHistory] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [founder, setFounder] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      about,
      title,
      description1,
      history,
      establishmentYear,
      founder,
    };

    try {
      const response = await axios.post(
        "https://jewelleryapp-1.onrender.com/about/create",
        formData
      );

      console.log("About Created:", response.data);

      setAbout("");
      setTitle("");
      setDescription1("");
      setHistory("");
      setEstablishmentYear("");
      setFounder("");
      setError("");

      toast.success("About section created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Failed to post category", err);
      setError("Failed to post category. Please try again.");

      toast.error("Failed to create about section!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-[100%] min-h-screen bg-white flex p-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-full   rounded-lg p-3 flex flex-col"
      >

        {/* About & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
          <input
            type="text"
            placeholder="About"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Description */}
        <div className="w-full mt-6">
          <p className="font-semibold mb-2">Description:</p>
          <textarea
            value={description1}
            onChange={(e) => setDescription1(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter description here..."
          />
        </div>

        {/* History */}
        <div className="w-full mt-6">
          <p className="font-semibold mb-2">History:</p>
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm h-32 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter history here..."
          />
        </div>

        {/* Establishment Year & Founder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <input
            type="text"
            placeholder="Establishment Year"
            value={establishmentYear}
            onChange={(e) => setEstablishmentYear(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            placeholder="Founder"
            value={founder}
            onChange={(e) => setFounder(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-4 rounded-lg font-semibold shadow-md transition duration-300 mt-8"
        >
          Post About Section
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>

      <ToastContainer />
    </div>
  );
}

export default AboutForm;
