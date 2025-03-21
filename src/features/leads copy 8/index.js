import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function BlogList() {
   const [blogs, setBlogs] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const blogsPerPage = 6;
   const [selectedBlog, setSelectedBlog] = useState(null);

   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const response = await axios.get("https://jewelleryapp.onrender.com/blog/blogs");
            setBlogs(response.data);
         } catch (err) {
            console.error("Failed to fetch blogs", err);
         }
      };

      fetchBlogs();
   }, []);

   const indexOfLastBlog = currentPage * blogsPerPage;
   const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
   const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

   return (
      <div className="p-6 min-h-screen bg-gray-100">
         <TitleCard title="Blogs List">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {currentBlogs.map((blog) => (
                  <div
                     key={blog._id}
                     className="border rounded-lg p-5 shadow-lg bg-white cursor-pointer hover:shadow-xl transition-all"
                     onClick={() => setSelectedBlog(blog)}
                  >
                     <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-40 object-cover rounded-md"
                     />
                     <h3 className="text-lg font-bold text-gray-800 mt-3">{blog.title}</h3>
                     <p className="text-sm text-gray-600">{blog.content.substring(0, 100)}...</p>
                     <div className="mt-2 flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                           <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                              {tag}
                           </span>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
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
                  onClick={() => setCurrentPage((prev) => (indexOfLastBlog < blogs.length ? prev + 1 : prev))}
                  disabled={indexOfLastBlog >= blogs.length}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
               >
                  Next
               </button>
            </div>
         </TitleCard>

         {selectedBlog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
               <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                  <h3 className="text-lg font-bold text-gray-800">{selectedBlog.title}</h3>
                  <img
                     src={selectedBlog.image}
                     alt={selectedBlog.title}
                     className="w-full h-40 object-cover rounded-md my-3"
                  />
                  <p className="text-sm text-gray-600">{selectedBlog.content}</p>
                  <h4 className="text-md font-semibold mt-4">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                     {selectedBlog.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                           {tag}
                        </span>
                     ))}
                  </div>
                  <button
                     onClick={() => setSelectedBlog(null)}
                     className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                     Close
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default BlogList;
