export const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@bookhaven.com",
    password: "admin1234", // In a real app, this would be hashed
    role: "admin",
    joinDate: "2020-01-01",
    bookmarks: [1, 4, 8],
    orders: [1, 3]
  },
  {
    id: 2,
    name: "Staff Member",
    email: "staff@bookhaven.com",
    password: "staff1234", // In a real app, this would be hashed
    role: "staff",
    joinDate: "2021-03-15",
    bookmarks: [],
    orders: []
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "user1234", // In a real app, this would be hashed
    role: "member",
    joinDate: "2022-02-10",
    bookmarks: [2, 6],
    orders: [2]
  },
  {
    id: 4,
    name: "Michael Lewis",
    email: "michael@example.com",
    password: "user1234", // In a real app, this would be hashed
    role: "member",
    joinDate: "2021-11-20",
    bookmarks: [3, 5, 7],
    orders: [4]
  }
];