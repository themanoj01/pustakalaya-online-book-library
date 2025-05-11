// OrderConfirmationPage.jsx
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Mail,
  MapPin,
  Calendar,
  Copy,
  AlertTriangle,
  BookOpen,
  Download,
} from "lucide-react";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState({
    orderId: "PK-2025-05060784",
    date: "May 6, 2025",
    items: [
      {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 18.99,
        quantity: 1,
        cover: "/api/placeholder/100/140",
      },
      {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 15.99,
        quantity: 2,
        cover: "/api/placeholder/100/140",
      },
      {
        id: 3,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 14.5,
        quantity: 1,
        cover: "/api/placeholder/100/140",
      },
    ],
    customerInfo: {
      name: "Manju Sapkota",
      email: "manoj.manju@example.com",
      phone: "+91 98765 43210",
    },
    paymentMethod: "Credit Card (ending in 4321)",
    paymentStatus: "Paid",
    subtotal: 65.47,
    shipping: 0,
    total: 65.47,
  });

  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCancelling, setIsCancelling] = useState(false);

  // Calculate claim code (1% of total)
  const claimCode = `CLAIM-${Math.floor(orderDetails.total * 0.01 * 100)}`;

  const copyClaimCode = () => {
    navigator.clipboard.writeText(claimCode).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => {
        setShowCopiedNotification(false);
      }, 2000);
    });
  };

  const handleCancelRequest = () => {
    setCancelRequested(true);
  };

  const confirmCancel = () => {
    setIsCancelling(true);
    setTimeout(() => {
      // Simulate order cancellation
      setOrderDetails({
        ...orderDetails,
        paymentStatus: "Cancellation Pending",
      });
      setCancelRequested(false);
      setIsCancelling(false);
    }, 2000);
  };

  const cancelCancellation = () => {
    setCancelRequested(false);
  };

  // Countdown timer for cancel confirmation
  useEffect(() => {
    if (cancelRequested && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cancelRequested, countdown]);

  // Reset countdown when cancel dialog is closed
  useEffect(() => {
    if (!cancelRequested) {
      setCountdown(5);
    }
  }, [cancelRequested]);

  return (
    <div className="order-confirmation-page">
      {/* Main Content */}
      <main className="main-content container">
        <div className="success-banner">
          <CheckCircle size={40} className="success-icon" />
          <div className="success-message">
            <h2>Order Placed Successfully!</h2>
            <p>
              Thank you for your order. An email confirmation has been sent to{" "}
              {orderDetails.customerInfo.email}
            </p>
          </div>
        </div>

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
                  <span className="value">{orderDetails.date}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span
                    className={`value status ${orderDetails.paymentStatus
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {orderDetails.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                <div className="items-list">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        <img src={item.cover} alt={item.title} />
                      </div>
                      <div className="item-details">
                        <div>
                          <h5>{item.title}</h5>
                          <p className="author">by {item.author}</p>
                        </div>

                        <div className="item-price-qty">
                          <span className="price">
                            ${item.price.toFixed(2)}
                          </span>
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
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-card">
              <div className="card-header">
                <h3>Customer Information</h3>
              </div>
              <div className="customer-info">
                <p className="customer-name">
                  {orderDetails.customerInfo.name}
                </p>
                <p className="customer-email">
                  <Mail size={14} className="info-icon" />
                  {orderDetails.customerInfo.email}
                </p>
                <p className="customer-phone">
                  <Calendar size={14} className="info-icon" />
                  {orderDetails.customerInfo.phone}
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
                <p className="claim-code-info">
                  Please use this claim code when picking up your books. This
                  represents 1% of your order total.
                </p>
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
                    <p>
                      Please visit our official department physically to collect
                      your books. Books will be available for pickup within 24
                      hours of your order.
                    </p>
                  </div>
                </div>

                <div className="instruction">
                  <Mail size={20} className="instruction-icon" />
                  <div>
                    <h4>Bring Your Documents</h4>
                    <p>
                      You must bring the bill and token that have been sent to
                      your email ({orderDetails.customerInfo.email}) after order
                      success.
                    </p>
                  </div>
                </div>

                <div className="instruction">
                  <Download size={20} className="instruction-icon" />
                  <div>
                    <h4>Download Receipt</h4>
                    <p>
                      You can download and print your receipt from the email or
                      via the button below.
                    </p>
                    <button className="download-button">
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="confirmation-card cancel-order-card">
              <div className="card-header">
                <h3>Need to Cancel?</h3>
              </div>
              <div className="cancel-order-content">
                <p>
                  If you need to cancel your order, please do so within 24 hours
                  of placing it. After this period, cancellations may not be
                  possible as your books will be prepared for pickup.
                </p>
                <button
                  className={`cancel-button ${
                    orderDetails.paymentStatus === "Cancellation Pending"
                      ? "disabled"
                      : ""
                  }`}
                  onClick={handleCancelRequest}
                  disabled={
                    orderDetails.paymentStatus === "Cancellation Pending"
                  }
                >
                  {orderDetails.paymentStatus === "Cancellation Pending"
                    ? "Cancellation In Process"
                    : "Cancel Order"}
                </button>
                {orderDetails.paymentStatus === "Cancellation Pending" && (
                  <p className="cancellation-note">
                    Your cancellation request is being processed. You will
                    receive an email confirmation soon.
                  </p>
                )}
              </div>
            </div>
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
              <p className="modal-note">
                This action cannot be undone. Your payment will be refunded
                according to your payment method's policy.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={cancelCancellation}
                disabled={isCancelling}
              >
                Keep Order
              </button>
              <button
                className="primary-button danger"
                onClick={confirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Processing..." : `Yes, Cancel (${countdown})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}