export const orders = [
  {
    id: 1,
    userId: 1,
    items: [
      { bookId: 1, quantity: 1, price: 24.99 },
      { bookId: 4, quantity: 1, price: 22.99 }
    ],
    totalAmount: 47.98,
    discountApplied: 0,
    finalAmount: 47.98,
    status: "completed",
    orderDate: "2023-01-15",
    claimCode: "ORD1-ADM-2301",
    deliveryAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Credit Card"
  },
  {
    id: 2,
    userId: 3,
    items: [
      { bookId: 2, quantity: 1, price: 17.95 },
      { bookId: 6, quantity: 1, price: 28.99 },
      { bookId: 8, quantity: 1, price: 16.99 }
    ],
    totalAmount: 63.93,
    discountApplied: 3.20, // 5% discount for 3 books
    finalAmount: 60.73,
    status: "completed",
    orderDate: "2023-02-20",
    claimCode: "ORD2-SJ-2302",
    deliveryAddress: "456 Elm St, Boston, MA 02108",
    paymentMethod: "PayPal"
  },
  {
    id: 3,
    userId: 1,
    items: [
      { bookId: 3, quantity: 1, price: 18.99 },
      { bookId: 5, quantity: 1, price: 26.95 },
      { bookId: 7, quantity: 1, price: 45.00 }
    ],
    totalAmount: 90.94,
    discountApplied: 4.55, // 5% discount for 3 books
    finalAmount: 86.39,
    status: "completed",
    orderDate: "2023-03-10",
    claimCode: "ORD3-ADM-2303",
    deliveryAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Credit Card"
  },
  {
    id: 4,
    userId: 4,
    items: [
      { bookId: 1, quantity: 1, price: 24.99 },
      { bookId: 3, quantity: 1, price: 18.99 },
      { bookId: 5, quantity: 1, price: 26.95 },
      { bookId: 7, quantity: 1, price: 45.00 },
      { bookId: 8, quantity: 1, price: 16.99 }
    ],
    totalAmount: 132.92,
    discountApplied: 6.65, // 5% discount for 5 books
    finalAmount: 126.27,
    status: "processing",
    orderDate: "2023-04-05",
    claimCode: "ORD4-ML-2304",
    deliveryAddress: "789 Oak St, San Francisco, CA 94102",
    paymentMethod: "Credit Card"
  },
  {
    id: 5,
    userId: 3,
    items: [
      { bookId: 4, quantity: 1, price: 22.99 }
    ],
    totalAmount: 22.99,
    discountApplied: 0,
    finalAmount: 22.99,
    status: "cancelled",
    orderDate: "2023-04-15",
    claimCode: "ORD5-SJ-2304",
    deliveryAddress: "456 Elm St, Boston, MA 02108",
    paymentMethod: "PayPal",
    cancellationReason: "Changed mind"
  }
];