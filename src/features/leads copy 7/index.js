import { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://backend.srilaxmialankar.com/order"
        );
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Payment</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Shipping</th>
                <th className="p-3 border">Razorpay</th>
                <th className="p-3 border">Products</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="text-sm text-gray-700 border-t hover:bg-gray-50"
                >
                  <td className="p-3 border">{order._id}</td>
                  <td className="p-3 border">{order?.userId?._id || "N/A"}</td>
                  <td className="p-3 border">{order.orderStatus}</td>
                  <td className="p-3 border">{order.paymentStatus}</td>
                  <td className="p-3 border">₹{order.totalAmount}</td>
                  <td className="p-3 border">{order.paymentMethod}</td>
                  <td className="p-3 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  {/* Shipping Address */}
                  <td className="p-3 border">
                    <div className="text-xs leading-5">
                      <div>{order?.shippingAddress?.fullName}</div>
                      <div>{order?.shippingAddress?.addressLine1}</div>
                      <div>
                        {order?.shippingAddress?.city},{" "}
                        {order?.shippingAddress?.state} -{" "}
                        {order?.shippingAddress?.postalCode}
                      </div>
                      <div>{order?.shippingAddress?.country}</div>
                      <div>
                        <strong>Phone:</strong> {order?.shippingAddress?.phone}
                      </div>
                    </div>
                  </td>

                  {/* Razorpay */}
                  <td className="p-3 border">
                    <div className="text-xs leading-5">
                      <div>
                        <strong>ID:</strong> {order?.razorpay?.orderId}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        {order?.razorpay?.orderDetails?.status}
                      </div>
                      <div>
                        <strong>Amount:</strong> ₹
                        {(order?.razorpay?.orderDetails?.amount || 0) / 100}
                      </div>
                    </div>
                  </td>

                  {/* Product List */}
                  <td className="p-3 border">
                    {Array.isArray(order.products) &&
                      order.products.map((item, idx) => (
                        <div key={item._id || idx} className="mb-2">
                          <div className="text-xs">
                            {item?.productId?.name || "N/A"}
                          </div>
                          <img
                            src={
                              item?.productId?.images?.[0] || "/placeholder.jpg"
                            }
                            alt={item?.productId?.name || "Product"}
                            className="w-16 h-16 object-cover rounded mt-1"
                          />
                        </div>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TitleCard>
    </div>
  );
}

export default OrderList;
