import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function OrderList() {
   const [orders, setOrders] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const ordersPerPage = 6;
   const [selectedOrder, setSelectedOrder] = useState(null);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const response = await axios.get("https://jewelleryapp-1.onrender.com/order/");
            setOrders(response.data);
         } catch (err) {
            console.error("Failed to fetch orders", err);
         }
      };

      fetchOrders();
   }, []);

   const indexOfLastOrder = currentPage * ordersPerPage;
   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
   const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

   return (
      <div className="p-6 min-h-screen bg-gray-100">
         <TitleCard title="Orders List">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {currentOrders.map((order) => (
                  <div
                     key={order._id}
                     className="border rounded-lg p-5 shadow-lg bg-white cursor-pointer hover:shadow-xl transition-all"
                     onClick={() => setSelectedOrder(order)}
                  >
                     <h3 className="text-lg font-bold text-gray-800">Order ID: {order._id}</h3>
                     <p className="text-sm text-gray-600"><strong>User ID:</strong> {order.userId._id}</p>
                     <p className="text-sm text-gray-600"><strong>Status:</strong> {order.orderStatus}</p>
                     <p className="text-sm text-gray-600"><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                     <p className="text-sm text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                     <p className="text-sm text-gray-600"><strong>Order Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                     <h4 className="mt-3 font-semibold text-gray-700">Products:</h4>
                     {order.products.map((item) => (
                        <div key={item._id} className="border p-3 rounded-md mt-2 bg-gray-50">
                           <p className="text-sm"><strong>Name:</strong> {item.productId.name}</p>
                           <p className="text-sm"><strong>Category:</strong> {item.productId.category}</p>
                           <p className="text-sm"><strong>Weight:</strong> {item.productId.weight}g</p>
                           <p className="text-sm"><strong>Karat:</strong> {item.productId.karat}</p>
                           <img
                              src={item.productId.images[0]}
                              alt={item.productId.name}
                              className="w-full h-32 object-cover mt-2 rounded-md"
                           />
                        </div>
                     ))}
                  </div>
               ))}
            </div>

         </TitleCard>


      </div>
   );
}

export default OrderList;
