import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function ContactUs() {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 10;

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        "https://backend.srilaxmialankar.com/support"
      );
      setContacts(
        Array.isArray(response.data.abouts) ? response.data.abouts : []
      );
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentContacts = contacts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(contacts.length / postsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <TitleCard title="Contact Us Submissions">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Full Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Query
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentContacts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
              {currentContacts.map((contact) => (
                <tr key={contact._id}>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {contact.fullName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {contact.contactEmail}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {contact.phoneNumber}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {contact.supportQuery}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {new Date(contact.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            disabled={currentPage === totalPages || totalPages === 0}
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
    </div>
  );
}

export default ContactUs;
