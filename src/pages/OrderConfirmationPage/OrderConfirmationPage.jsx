import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle, Mail, MapPin, Calendar, Copy, AlertTriangle, Download
} from "lucide-react";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCancelling, setIsCancelling] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5198/pustakalaya/orders/get-order/${orderId}`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setOrderDetails(data[0]); 
          setStatus(orderDetails.status);
        } else {
          console.error("Order not found.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch order", err);
      });
  }, [orderId]);

  useEffect(() => {
    if (cancelRequested && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cancelRequested, countdown]);

  useEffect(() => {
    if (!cancelRequested) setCountdown(5);
  }, [cancelRequested]);

  if (!orderDetails) {
    return <div className="order-confirmation-page container"><p>Loading order details...</p></div>;
  }

  const claimCode = orderDetails.claimCode;

  const copyClaimCode = () => {
    navigator.clipboard.writeText(claimCode).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    });
  };



  const handleCancelRequest = () => setCancelRequested(true);

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      await axios.delete("http://localhost:5198/pustakalaya/orders/cancel-order", {
        params: { orderId }
      });

      // Update the status locally to reflect cancellation
      setOrderDetails(prev => ({
        ...prev,
        status: "CANCELLED"
      }));

      setCancelRequested(false);
    } catch (error) {
      console.error("Failed to cancel order", error);
      alert("Cancellation failed. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const cancelCancellation = () => setCancelRequested(false);

  return (
    <div className="order-confirmation-page">
      <main className="main-content container">
        {status != "CANCLED" && <div className="success-banner">
          <CheckCircle size={40} className="success-icon" />
          <div className="success-message">
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your order. An email confirmation has been sent to{" "}
              {orderDetails.userEmail}
            </p>
          </div>
        </div>}

        <div className="confirmation-grid">
          <div className="order-details-section">
            <div className="confirmation-card">
              <div className="card-header">
                <h3>Order Details</h3>
                <span className="order-id">Order #{orderDetails.orderId}</span>
              </div>

              <div className="order-info">
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(orderDetails.orderDate)?.toLocaleString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span style={{color: status == "CANCLED"? "red": "green"}} className={`value status ${orderDetails.status?.toLowerCase()}`}>
                    {orderDetails.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                <div className="items-list">
                  {orderDetails.orderedItems?.map((item, index) => (
                    <div key={index} className="order-item">

                      <div className="item-details">
                        <div>
                          <h5>{item.bookTitle}</h5>
                        </div>
                        <div className="item-price-qty">
                          <span className="quantity">× {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs. {orderDetails.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs. {orderDetails.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-card">
              <div className="card-header">
                <h3>Customer Information</h3>
              </div>
              <div className="customer-info">
                <p className="customer-name">{orderDetails.userName}</p>
                <p className="customer-email">
                  <Mail size={14} className="info-icon" />
                  {orderDetails.userEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="pickup-section">
            <div className="confirmation-card claim-code-card">
              <div className="card-header">
                <h3>Claim Code</h3>
              </div>
              <div className="claim-code-content">
                <p>Please use this code to pick up your books.</p>
                <div className="claim-code">
                  <span>{claimCode}</span>
                  <button className="copy-button" onClick={copyClaimCode}>
                    <Copy size={16} />
                  </button>
                </div>
                {showCopiedNotification && (
                  <p className="copied-notification">Copied to clipboard!</p>
                )}
              </div>
            </div>

            <div className="confirmation-card pickup-instructions-card">
              <div className="card-header">
                <h3>Pickup Instructions</h3>
              </div>
              <div className="pickup-instructions">
                <div className="instruction">
                  <MapPin size={20} className="instruction-icon" />
                  <div>
                    <h4>Visit Our Department</h4>
                    <p>Pickup is available within 24 hours of order placement.</p>
                  </div>
                </div>
                <div className="instruction">
                  <Mail size={20} className="instruction-icon" />
                  <div>
                    <h4>Bring Your Email Receipt</h4>
                    <p>Show the confirmation email sent to {orderDetails.userEmail}.</p>
                  </div>
                </div>
                <div className="instruction">
                  <Download size={20} className="instruction-icon" />
                  <div>
                    <h4>Download Receipt</h4>
                    <p>Download your Receipt in email sent to {orderDetails.userEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {status != "CANCLED" && <div className="confirmation-card cancel-order-card">
              <div className="card-header">
                <h3>Need to Cancel?</h3>
              </div>
              <div className="cancel-order-content">
                <p>You can cancel within 24 hours of placing the order.</p>
                <button
                  className={`cancel-button ${orderDetails.status === "Cancellation Pending" ? "disabled" : ""}`}
                  onClick={handleCancelRequest}
                  disabled={orderDetails.status === "Cancellation Pending"}
                >
                  {orderDetails.status === "Cancellation Pending" ? "Cancellation In Process" : "Cancel Order"}
                </button>
              </div>
            </div>}
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {cancelRequested && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <AlertTriangle size={24} className="warning-icon" />
              <h3>Cancel Order</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your order?</p>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={cancelCancellation} disabled={isCancelling}>
                Keep Order
              </button>
              <button className="primary-button danger" onClick={confirmCancel} disabled={isCancelling}>
                {isCancelling ? "Processing..." : `Yes, Cancel (${countdown})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
