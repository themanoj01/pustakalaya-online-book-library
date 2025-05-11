import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StaffPortal.css";
import toast from "react-hot-toast";

const StaffPortal = () => {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchOrders();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5198/api/Book/GetAll");
      const normalizedBooks = Array.isArray(response.data)
        ? response.data
            .map((book) => ({
              id: book.Id,
              title: book.Title || "Untitled",
            }))
            .filter((book) => book.id != null)
        : [];
      setBooks(normalizedBooks);
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response?.data || error.message
      );
      setBooks([]);
      setErrorMessage("Failed to load book data.");
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5198/pustakalaya/orders/get-orders"
      );
      const fetchedOrders = Array.isArray(response.data) ? response.data : [];
      const sortedOrders = fetchedOrders.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      setOrders([]);
      setErrorMessage("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const confirmDeliverOrder = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:5198/pustakalaya/orders/change-status?orderId=${selectedOrder.orderId}`
      );
      toast.success("Order marked as delivered successfully!");
      setModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error(
        "Error completing order:",
        error.response?.data || error.message
      );
      setErrorMessage("Failed to mark order as delivered.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelivery = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const displayedOrders = searchTerm
    ? orders.filter(
        (order) =>
          order.claimCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orders;

  return (
    <div className="staff-portal-wrapper">
      <main className="staff-portal">
        <div className="container">
          <div className="portal-header">
            <h2>Staff Portal - Manage Orders</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Claim Code or Membership ID or Order ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loading}
              />
            </div>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="orders-table">
            {loading && (
              <div className="loader-overlay">
                <span className="loader"></span>
              </div>
            )}
            {displayedOrders.length === 0 ? (
              <div className="empty-state">
                <p>
                  {searchTerm
                    ? "No orders match your search."
                    : "No orders found."}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Claim Code</th>
                      <th>Membership ID</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.claimCode || "N/A"}</td>
                        <td>{order.userId}</td>
                        <td>
                          {order.orderedItems &&
                          order.orderedItems.length > 0 ? (
                            <ul className="items-list">
                              {order.orderedItems.map((item, index) => (
                                <li key={index}>
                                  {item.bookTitle || "Unknown Book"} (Qty:{" "}
                                  {item.quantity || 0})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No items"
                          )}
                        </td>
                        <td>Rs. {order.totalAmount?.toFixed(2)}</td>
                        <td>
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${order.status?.toLowerCase()}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {order.status === "PENDING" ? (
                            <button
                              className="action-btn btn-success"
                              onClick={() => handleMarkAsDelivered(order)}
                              disabled={loading}
                            >
                              Mark as Delivered
                            </button>
                          ) : (
                            <span className="no-action">
                              No Actions Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {modalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            {loading && (
              <div className="modal-loader-overlay">
                <span className="loader"></span>
              </div>
            )}
            <div className="modal-header">
              <h3>Confirm Delivery</h3>
              <button className="modal-close" onClick={cancelDelivery}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Order ID:</strong> {selectedOrder.orderId}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(selectedOrder.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Amount:</strong> Rs.{" "}
                {selectedOrder.totalAmount?.toFixed(2)}
              </p>
              <p>
                <strong>Claim Code:</strong> {selectedOrder.claimCode || "N/A"}
              </p>
              <p>
                <strong>User ID:</strong> {selectedOrder.userId}
              </p>
              <p>
                <strong>User Name:</strong> {selectedOrder.userName || "N/A"}
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul className="items-list">
                {selectedOrder.orderedItems &&
                selectedOrder.orderedItems.length > 0 ? (
                  selectedOrder.orderedItems.map((item, index) => (
                    <li key={index}>
                      {item.bookTitle || "Unknown Book"} (Qty:{" "}
                      {item.quantity || 0})
                    </li>
                  ))
                ) : (
                  <li>No items</li>
                )}
              </ul>
              <p>
                <strong>New Status:</strong> DELIVERED
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={cancelDelivery}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={confirmDeliverOrder}
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPortal;
