import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { Formik, Form, Field } from "formik";

function Testimonials() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://jewelleryapp.onrender.com/testimonial"
      );
      setPosts(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(
        `https://jewelleryapp.onrender.com/testimonial/${postId}`
      );
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(
        `https://jewelleryapp.onrender.com/testimonial/${selectedPost._id}`,
        values
      );
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post("https://jewelleryapp.onrender.com/testimonial", values);
      setIsCreateModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error("Failed to create post", err);
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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const PostFormModal = ({ title, onSubmit, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
      <Formik
        initialValues={{
          name: selectedPost ? selectedPost.name : "",
          message: selectedPost ? selectedPost.message : "",
          image: selectedPost ? selectedPost.image : "",
        }}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <input
                type="text"
                name="name"
                value="name"
                className="w-full mt-2 p-2 border rounded resize-none"
                placeholder="Name"
              />
              <textarea
                name="message"
                value={values.message} // Ensure it's linked to Formik values
                rows="5"
                className="w-full mt-2 p-2 border rounded resize-none"
                placeholder="Message"
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
                  className="w-full h-40 object-cover mt-2 rounded-md"
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
      <TitleCard title="Testimonial Management">
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Add New Testimonial
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <div
              key={post._id}
              className="border rounded-lg p-5 shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <h3 className="text-lg font-bold text-gray-800">{post.name}</h3>
              <img
                src={post.image}
                alt="Testimonial"
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg  text-gray-800">{post.message}</h3>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(post)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
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

      <PostFormModal
        title="Add New Testimonial"
        onSubmit={handleCreate}
        onCancel={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />

      <PostFormModal
        title="Edit Testimonial"
        onSubmit={handleUpdate}
        onCancel={() => setSelectedPost(null)}
        isOpen={!!selectedPost}
      />
    </div>
  );
}

export default Testimonials;
