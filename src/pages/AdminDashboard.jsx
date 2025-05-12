import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import Select from "react-select";
import {
  FiBook,
  FiBell,
  FiHome,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPackage,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import "./AdminDashboard.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || "Please try again later."}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ConfirmDeleteModal = ({ entity, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Confirm Delete</h2>
        <button className="modal-close" onClick={onCancel}>
          ×
        </button>
      </div>
      <div className="modal-body">
        <p>
          Are you sure you want to delete this {entity.toLowerCase()}? This
          action cannot be undone.
        </p>
      </div>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

const ImagePreviewModal = ({ book, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content image-preview-modal">
      <div className="modal-header">
        <h2>{book.title}</h2>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="modal-body">
        <img
          src={book.bookImage}
          alt={book.title}
          className="large-book-image"
        />
      </div>
    </div>
  </div>
);

const Modal = ({ type, item, onClose, onSave, authors, genres, userId }) => {
  const isCreate = type.startsWith("Create");
  const entity = type.replace("Create", "").replace("Edit", "");
  const [formData, setFormData] = useState(
    item ||
      {
        Book: {
          title: "",
          isbn: "",
          price: "",
          stock: "",
          language: "",
          format: "",
          publisher: "",
          publicationDate: "",
          description: "",
          authorIds: [],
          genreIds: [],
          bookImage: null,
          awardWinner: false,
        },
        Discount: { name: "", discountPercent: "", startDate: "", endDate: "" },
        Announcement: {
          title: "",
          content: "",
          expiresAt: "",
          userId: userId || "",
        },
      }[entity]
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(item?.bookImage || null);

  // Format date to YYYY-MM-DD for input type="date"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const validate = () => {
    const newErrors = {};
    if (entity === "Book") {
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.isbn || !/^\d{13}$/.test(formData.isbn))
        newErrors.isbn = "ISBN must be 13 digits";
      if (!formData.price || formData.price <= 0)
        newErrors.price = "Price must be greater than 0";
      if (!formData.stock || formData.stock < 0)
        newErrors.stock = "Stock cannot be negative";
      if (!formData.language) newErrors.language = "Language is required";
      if (!formData.format) newErrors.format = "Format is required";
      if (!formData.publisher) newErrors.publisher = "Publisher is required";
      if (!formData.publicationDate)
        newErrors.publicationDate = "Publication date is required";
      if (!formData.authorIds || formData.authorIds.length === 0)
        newErrors.authorIds = "At least one author is required";
      if (!formData.genreIds || formData.genreIds.length === 0)
        newErrors.genreIds = "At least one genre is required";
      if (formData.title?.length > 200)
        newErrors.title = "Title must be 200 characters or less";
      if (formData.language?.length > 50)
        newErrors.language = "Language must be 50 characters or less";
      if (formData.format?.length > 50)
        newErrors.format = "Format must be 50 characters or less";
      if (formData.publisher?.length > 100)
        newErrors.publisher = "Publisher must be 100 characters or less";
      if (formData.description?.length > 1000)
        newErrors.description = "Description must be 1000 characters or less";
    } else if (entity === "Discount") {
      if (!formData.name) newErrors.name = "Name is required";
      if (
        !formData.discountPercent ||
        formData.discountPercent <= 0 ||
        formData.discountPercent > 100
      )
        newErrors.discountPercent = "Discount must be between 1 and 100";
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.endDate) newErrors.endDate = "End date is required";
      if (
        formData.startDate &&
        formData.endDate &&
        new Date(formData.startDate) >= new Date(formData.endDate)
      )
        newErrors.endDate = "End date must be after start date";
      if (formData.name?.length > 100)
        newErrors.name = "Name must be 100 characters or less";
    } else if (entity === "Announcement") {
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.content) newErrors.content = "Content is required";
      if (isCreate && !formData.userId)
        newErrors.userId = "User ID is required";
      if (formData.title?.length > 200)
        newErrors.title = "Title must be 200 characters or less";
      if (formData.content?.length > 2000)
        newErrors.content = "Content must be 2000 characters or less";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the form errors.");
      return;
    }
    setLoading(true);
    try {
      await onSave(formData, isCreate);
      toast.success(
        `${entity} ${isCreate ? "created" : "updated"} successfully!`
      );
      onClose();
    } catch (error) {
      console.error(
        `Error ${isCreate ? "creating" : "updating"} ${entity}:`,
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isCreate ? "create" : "update"} ${entity}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFormData({ ...formData, [name]: values });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, bookImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {isCreate ? "Add" : "Edit"} {entity}
          </h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          {entity === "Book" && (
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter book title"
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter ISBN (13 digits)"
                />
                {errors.isbn && <span className="error">{errors.isbn}</span>}
              </div>
              <div className="form-group">
                <label>Price (RS)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  disabled={loading}
                  placeholder="Enter price"
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter stock quantity"
                />
                {errors.stock && <span className="error">{errors.stock}</span>}
              </div>
              <div className="form-group">
                <label>Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter language"
                />
                {errors.language && (
                  <span className="error">{errors.language}</span>
                )}
              </div>
              <div className="form-group">
                <label>Format</label>
                <input
                  type="text"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter format (e.g., Hardcover)"
                />
                {errors.format && (
                  <span className="error">{errors.format}</span>
                )}
              </div>
              <div className="form-group">
                <label>Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter publisher"
                />
                {errors.publisher && (
                  <span className="error">{errors.publisher}</span>
                )}
              </div>
              <div className="form-group">
                <label>Publication Date</label>
                <input
                  type="date"
                  name="publicationDate"
                  value={formatDate(formData.publicationDate)}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.publicationDate && (
                  <span className="error">{errors.publicationDate}</span>
                )}
              </div>
              <div className="form-group full-width">
                <label>Authors</label>
                <Select
                  isMulti
                  name="authorIds"
                  options={authors.map((author) => ({
                    value: author.id,
                    label: author.name,
                  }))}
                  value={formData.authorIds
                    .map((id) => {
                      const author = authors.find((author) => author.id === id);
                      return author
                        ? { value: author.id, label: author.name }
                        : null;
                    })
                    .filter(Boolean)}
                  onChange={(selected) =>
                    handleSelectChange("authorIds", selected)
                  }
                  isDisabled={loading}
                  placeholder="Select authors"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {errors.authorIds && (
                  <span className="error">{errors.authorIds}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label>Genres</label>
                <Select
                  isMulti
                  name="genreIds"
                  options={genres.map((genre) => ({
                    value: genre.id,
                    label: genre.name,
                  }))}
                  value={formData.genreIds
                    .map((id) => {
                      const genre = genres.find((genre) => genre.id === id);
                      return genre
                        ? { value: genre.id, label: genre.name }
                        : null;
                    })
                    .filter(Boolean)}
                  onChange={(selected) =>
                    handleSelectChange("genreIds", selected)
                  }
                  isDisabled={loading}
                  placeholder="Select genres"
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {errors.genreIds && (
                  <span className="error">{errors.genreIds}</span>
                )}
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter book description"
                />
                {errors.description && (
                  <span className="error">{errors.description}</span>
                )}
              </div>
              <div className="form-group full-width">
                <label>Award Winner</label>
                <input
                  type="checkbox"
                  name="awardWinner"
                  checked={formData.awardWinner || false}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkbox-label">Mark as Award Winner</span>
                {errors.awardWinner && (
                  <span className="error">{errors.awardWinner}</span>
                )}
              </div>
              <div className="form-group full-width">
                <label>Book Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Book Preview"
                    className="image-preview"
                  />
                )}
              </div>
            </div>
          )}
          {entity === "Discount" && (
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter discount name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Discount Percent (%)</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  step="0.01"
                  disabled={loading}
                  placeholder="Enter percentage"
                />
                {errors.discountPercent && (
                  <span className="error">{errors.discountPercent}</span>
                )}
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formatDate(formData.startDate)}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.startDate && (
                  <span className="error">{errors.startDate}</span>
                )}
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formatDate(formData.endDate)}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.endDate && (
                  <span className="error">{errors.endDate}</span>
                )}
              </div>
            </div>
          )}
          {entity === "Announcement" && (
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter announcement title"
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="form-group full-width">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter announcement content"
                />
                {errors.content && (
                  <span className="error">{errors.content}</span>
                )}
              </div>
              <div className="form-group">
                <label>Expires At (Optional)</label>
                <input
                  type="date"
                  name="expiresAt"
                  value={formatDate(formData.expiresAt)}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {isCreate && (
                <div className="form-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Enter user ID (GUID)"
                  />
                  {errors.userId && (
                    <span className="error">{errors.userId}</span>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loader"></span>
              ) : isCreate ? (
                "Create"
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// StatCard component
const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">
        {title.includes("Revenue") ? `RS  ${value.toFixed(2)}` : value}
      </h3>
    </div>
  </div>
);

// Main AdminDashboard component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [books, setBooks] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteEntity, setDeleteEntity] = useState("");
  const [stats, setStats] = useState({
    totalBooks: 0,
    lowStock: 0,
    activeDiscounts: 0,
    activeAnnouncements: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    bookId: null,
    discountId: null,
  });
  const salesChartRef = useRef(null);
  const inventoryChartRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const openImageModal = (book) => {
    setSelectedBook(book);
    setShowImageModal(true);
  };

  const handleAssignDiscount = async () => {
    if (!assignmentForm.bookId || !assignmentForm.discountId) {
      toast.error("Please select both a book and a discount.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5198/api/Book/assign-discount",
        {
          bookId: assignmentForm.bookId,
          discountId: assignmentForm.discountId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Discount assigned successfully!");
      setAssignmentForm({ bookId: null, discountId: null });
      fetchBooks(); // Refresh books to reflect updated discount
    } catch (error) {
      console.error(
        "Error assigning discount:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to assign discount."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchDiscounts();
    fetchAnnouncements();
    fetchAuthors();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      try {
        renderCharts();
        calculateStats();
      } catch (error) {
        console.error("Error in useEffect:", error);
        toast.error("Failed to render charts or stats.");
      }
    }

    return () => {
      if (salesChartRef.current) {
        salesChartRef.current.destroy();
        salesChartRef.current = null;
      }
      if (inventoryChartRef.current) {
        inventoryChartRef.current.destroy();
        inventoryChartRef.current = null;
      }
    };
  }, [books, discounts, announcements]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5198/api/Book/GetAll");
      const normalizedBooks = Array.isArray(response.data)
        ? response.data.map((book) => ({
            id: book.id || book.Id,
            title: book.title || book.Title || "",
            isbn: book.isbn || book.ISBN || "",
            price: parseFloat(book.price || book.Price || 0),
            stock: parseInt(book.stock || book.Stock || 0),
            language: book.language || book.Language || "",
            format: book.format || book.Format || "",
            publisher: book.publisher || book.Publisher || "",
            publicationDate: book.publicationDate || book.PublicationDate || "",
            description: book.description || book.Description || "",
            authorIds: book.authorIds || book.AuthorIds || [],
            genreIds: book.genreIds || book.GenreIds || [],
            totalSold: parseInt(book.totalSold || book.TotalSold || 0),
            bookImage: book.bookImage || null,
            awardWinner: book.awardWinner || false,
            discountId: book.discountId || null, // Added to support discount assignment
          }))
        : [];
      setBooks(normalizedBooks);
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5198/api/Discount/GetAll"
      );
      const normalizedDiscounts = Array.isArray(response.data)
        ? response.data.map((discount) => ({
            id: discount.id || discount.Id,
            name: discount.name || discount.Name || "",
            discountPercent: parseFloat(
              discount.discountPercent || discount.DiscountPercent || 0
            ),
            startDate: discount.startDate || discount.StartDate || "",
            endDate: discount.endDate || discount.EndDate || "",
          }))
        : [];
      setDiscounts(normalizedDiscounts);
    } catch (error) {
      console.error(
        "Error fetching discounts:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to load discounts.");
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5198/api/Announcement/GetAll"
      );
      const normalizedAnnouncements = Array.isArray(response.data)
        ? response.data.map((announcement) => ({
            id: announcement.id || announcement.Id,
            title: announcement.title || announcement.Title || "",
            content: announcement.content || announcement.Content || "",
            expiresAt: announcement.expiresAt || announcement.ExpiresAt || "",
            userId: announcement.userId || announcement.UserId || "",
          }))
        : [];
      setAnnouncements(normalizedAnnouncements);
    } catch (error) {
      console.error(
        "Error fetching announcements:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to load announcements."
      );
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5198/api/Author/GetAll"
      );
      const normalizedAuthors = Array.isArray(response.data)
        ? response.data.map((author) => ({
            id: author.id || author.Id,
            name: author.name || author.Name || "",
          }))
        : [];
      setAuthors(normalizedAuthors);
    } catch (error) {
      console.error(
        "Error fetching authors:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to load authors.");
      setAuthors([]);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5198/api/Genre/GetAll"
      );
      const normalizedGenres = Array.isArray(response.data)
        ? response.data.map((genre) => ({
            id: genre.id || genre.Id,
            name: genre.name || genre.Name || "",
          }))
        : [];
      setGenres(normalizedGenres);
    } catch (error) {
      console.error(
        "Error fetching genres:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to load genres.");
      setGenres([]);
    }
  };

  const calculateStats = () => {
    const revenue = books.reduce(
      (sum, book) => sum + book.price * book.totalSold,
      0
    );
    setStats({
      totalBooks: books.length,
      lowStock: books.filter((book) => book.stock < 10).length,
      activeDiscounts: discounts.filter((d) => new Date(d.endDate) > new Date())
        .length,
      activeAnnouncements: announcements.filter(
        (a) => !a.expiresAt || new Date(a.expiresAt) > new Date()
      ).length,
      totalRevenue: revenue,
    });
  };

  const renderCharts = () => {
    if (salesChartRef.current) {
      salesChartRef.current.destroy();
      salesChartRef.current = null;
    }
    if (inventoryChartRef.current) {
      inventoryChartRef.current.destroy();
      inventoryChartRef.current = null;
    }

    const salesCtx = document.getElementById("salesChart")?.getContext("2d");
    if (salesCtx) {
      const sortedBooks = [...books]
        .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
        .slice(0, 8);

      salesChartRef.current = new Chart(salesCtx, {
        type: "bar",
        data: {
          labels: sortedBooks.map(
            (b) =>
              b.title?.substring(0, 15) + (b.title?.length > 15 ? "..." : "")
          ),
          datasets: [
            {
              label: "Units Sold",
              data: sortedBooks.map((b) => Math.floor(b.totalSold || 0)),
              backgroundColor: "#6366F1",
              borderColor: "#4F46E5",
              borderWidth: 1,
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 30,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: { size: 12, weight: "bold" },
                color: "#1E293B",
              },
            },
            tooltip: {
              backgroundColor: "#1E293B",
              titleFont: { size: 14, weight: "bold" },
              bodyFont: { size: 12 },
              padding: 12,
              usePointStyle: true,
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.y} units`,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Units Sold",
                font: { size: 12, weight: "bold" },
                color: "#1E293B",
              },
              grid: {
                drawBorder: false,
                color: "#E2E8F0",
              },
              ticks: {
                stepSize: 1,
                font: { size: 12 },
                color: "#64748B",
              },
            },
            x: {
              title: {
                display: true,
                text: "Books",
                font: { size: 12, weight: "bold" },
                color: "#1E293B",
              },
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: { size: 12 },
                color: "#64748B",
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
        },
      });
    }

    const inventoryCtx = document
      .getElementById("inventoryChart")
      ?.getContext("2d");
    if (inventoryCtx) {
      inventoryChartRef.current = new Chart(inventoryCtx, {
        type: "bar",
        data: {
          labels: books
            .slice(0, 8)
            .map(
              (b) =>
                b.title?.substring(0, 15) + (b.title?.length > 15 ? "..." : "")
            ),
          datasets: [
            {
              label: "Current Stock",
              data: books.slice(0, 8).map((b) => b.stock),
              backgroundColor: books
                .slice(0, 8)
                .map((b) =>
                  b.stock === 0
                    ? "#EF4444"
                    : b.stock < 10
                    ? "#F59E0B"
                    : "#6366F1"
                ),
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1E293B",
              titleFont: { size: 14, weight: "bold" },
              bodyFont: { size: 12 },
              padding: 12,
              usePointStyle: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { drawBorder: false, color: "#E2E8F0" },
              ticks: {
                stepSize: Math.max(...books.map((b) => b.stock)) > 20 ? 10 : 5,
              },
            },
            x: { grid: { display: false, drawBorder: false } },
          },
        },
      });
    }
  };

  const handleCreate = async (data, endpoint) => {
    try {
      if (endpoint === "Book") {
        let payload = new FormData();
        payload.append("Title", data.title || "");
        payload.append("ISBN", data.isbn || "");
        payload.append("Price", parseFloat(data.price) || 0);
        payload.append("Stock", parseInt(data.stock) || 0);
        payload.append("Language", data.language || "");
        payload.append("Format", data.format || "");
        payload.append("Publisher", data.publisher || "");
        payload.append(
          "PublicationDate",
          data.publicationDate || new Date().toISOString().split("T")[0]
        );
        payload.append("Description", data.description || "");
        payload.append("AwardWinner", data.awardWinner || false);
        if (data.bookImage) payload.append("BookImage", data.bookImage);
        if (data.authorIds)
          data.authorIds.forEach((id) => payload.append("AuthorIds", id));
        if (data.genreIds)
          data.genreIds.forEach((id) => payload.append("GenreIds", id));
        await axios.post(`http://localhost:5198/api/${endpoint}/Add`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (endpoint === "Discount") {
        const payload = {
          Name: data.name || "",
          DiscountPercent: parseFloat(data.discountPercent) || 0,
          StartDate: data.startDate || null,
          EndDate: data.endDate || null,
        };
        await axios.post(`http://localhost:5198/api/${endpoint}/Add`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      } else if (endpoint === "Announcement") {
        const payload = {
          Title: data.title || "",
          Content: data.content || "",
          ExpiresAt: data.expiresAt || null,
          UserId: data.userId || userId,
        };
        await axios.post(`http://localhost:5198/api/${endpoint}/Add`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }
      refreshData(endpoint);
    } catch (error) {
      console.error(
        `Error creating ${endpoint}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleUpdate = async (data, endpoint) => {
    try {
      if (endpoint === "Book") {
        const payload = {
          id: data.id,
          Title: data.title || "",
          ISBN: data.isbn || "",
          Price: parseFloat(data.price) || 0,
          Stock: parseInt(data.stock) || 0,
          Language: data.language || "",
          Format: data.format || "",
          Publisher: data.publisher || "",
          AwardWinner: data.awardWinner || false,
          PublicationDate: data.publicationDate
            ? new Date(data.publicationDate).toISOString()
            : new Date().toISOString(),
          Description: data.description || "",
          AuthorIds: data.authorIds || [],
          GenreIds: data.genreIds || [],
        };
        await axios.put(
          `http://localhost:5198/api/${endpoint}/${data.id}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      } else if (endpoint === "Discount") {
        const payload = {
          id: data.id,
          Name: data.name || "",
          DiscountPercent: parseFloat(data.discountPercent) || 0,
          StartDate: data.startDate
            ? new Date(data.startDate).toISOString()
            : null,
          EndDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        };
        await axios.put(
          `http://localhost:5198/api/${endpoint}/${data.id}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      } else if (endpoint === "Announcement") {
        const payload = {
          id: data.id,
          Title: data.title || "",
          Content: data.content || "",
          ExpiresAt: data.expiresAt
            ? new Date(data.expiresAt).toISOString()
            : null,
        };
        await axios.put(
          `http://localhost:5198/api/${endpoint}/${data.id}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
      }
      refreshData(endpoint);
    } catch (error) {
      console.error(
        `Error updating ${endpoint}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleDelete = async (id, endpoint) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5198/api/${endpoint}/${id}`);
      toast.success(`${endpoint} deleted successfully!`);
      refreshData(endpoint);
    } catch (error) {
      console.error(
        `Error deleting ${endpoint}:`,
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || `Failed to delete ${endpoint}.`
      );
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteItem(null);
      setDeleteEntity("");
    }
  };

  const handleSave = async (data, isCreate) => {
    const endpoint = modalType.replace("Create", "").replace("Edit", "");
    if (isCreate) {
      await handleCreate(data, endpoint);
    } else {
      await handleUpdate(data, endpoint);
    }
  };

  const refreshData = (endpoint) => {
    if (endpoint === "Book") fetchBooks();
    else if (endpoint === "Discount") fetchDiscounts();
    else if (endpoint === "Announcement") fetchAnnouncements();
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setShowModal(true);
  };

  const openDeleteModal = (id, entity) => {
    setDeleteItem({ id });
    setDeleteEntity(entity);
    setShowDeleteModal(true);
  };

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => setActiveTab("dashboard")}
              >
                <FiHome className="nav-icon" />
                <span>Dashboard</span>
              </li>
              <li
                className={activeTab === "books" ? "active" : ""}
                onClick={() => setActiveTab("books")}
              >
                <FiBook className="nav-icon" />
                <span>Books</span>
              </li>
              <li
                className={activeTab === "discounts" ? "active" : ""}
                onClick={() => setActiveTab("discounts")}
              >
                <FaMoneyBillWave className="nav-icon" />
                <span>Discounts</span>
              </li>
              <li
                className={activeTab === "announcements" ? "active" : ""}
                onClick={() => setActiveTab("announcements")}
              >
                <FiBell className="nav-icon" />
                <span>Announcements</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="main-content">
          {loading && (
            <div className="loader-overlay">
              <span className="loader"></span>
            </div>
          )}
          {activeTab === "dashboard" && (
            <>
              <h2 className="tab-title">Dashboard</h2>
              {books.length === 0 && !loading ? (
                <div className="empty-state">
                  <p>No data available. Add books to see stats and charts.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab("books")}
                  >
                    Add Books
                  </button>
                </div>
              ) : (
                <>
                  <div className="stats-grid">
                    <StatCard
                      icon={<FiBook size={20} />}
                      title="Total Books"
                      value={stats.totalBooks}
                      color="#6366F1"
                    />
                    <StatCard
                      icon={<FiPackage size={20} />}
                      title="Low Stock"
                      value={stats.lowStock}
                      color="#F59E0B"
                    />
                    <StatCard
                      icon={<FaMoneyBillWave size={20} />}
                      title="Total Revenue"
                      value={stats.totalRevenue}
                      color="#818CF8"
                    />
                    <StatCard
                      icon={<FiBell size={20} />}
                      title="Announcements"
                      value={stats.activeAnnouncements}
                      color="#4F46E5"
                    />
                  </div>
                  <div className="charts-container">
                    <div className="chart-card large">
                      <div className="chart-header">
                        <h3>Top Books by Sales</h3>
                        <div className="chart-legend">
                          <div className="legend-item">
                            <span
                              className="legend-color"
                              style={{ backgroundColor: "#6366F1" }}
                            ></span>
                            <span>Units Sold</span>
                          </div>
                        </div>
                      </div>
                      <div className="chart-container">
                        <canvas id="salesChart"></canvas>
                      </div>
                    </div>
                    <div className="chart-card large">
                      <div className="chart-header">
                        <h3>Inventory Levels</h3>
                        <div className="chart-legend">
                          <div className="legend-item">
                            <span
                              className="legend-color"
                              style={{ backgroundColor: "#6366F1" }}
                            ></span>
                            <span>In Stock</span>
                          </div>
                          <div className="legend-item">
                            <span
                              className="legend-color"
                              style={{ backgroundColor: "#F59E0B" }}
                            ></span>
                            <span>Low Stock</span>
                          </div>
                          <div className="legend-item">
                            <span
                              className="legend-color"
                              style={{ backgroundColor: "#EF4444" }}
                            ></span>
                            <span>Out of Stock</span>
                          </div>
                        </div>
                      </div>
                      <div className="chart-container">
                        <canvas id="inventoryChart"></canvas>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "books" && (
            <div className="data-table-container">
              <div className="table-header">
                <h3>Books Inventory</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => openModal("CreateBook")}
                  disabled={loading}
                >
                  <FiPlus size={16} /> Add Book
                </button>
              </div>
              <div className="table-responsive">
                {books.length === 0 ? (
                  <div className="empty-state">
                    <p>No books available.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => openModal("CreateBook")}
                    >
                      Add Book
                    </button>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>ISBN</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.id}>
                          <td>
                            <div className="book-title">
                              <strong>{book.title}</strong>
                              <span>{book.publisher}</span>
                            </div>
                          </td>
                          <td>{book.isbn}</td>
                          <td>RS {book.price.toFixed(2)}</td>
                          <td>
                            <span
                              className={`stock-badge ${
                                book.stock === 0
                                  ? "out"
                                  : book.stock < 10
                                  ? "low"
                                  : ""
                              }`}
                            >
                              {book.stock}
                            </span>
                          </td>
                          <td>
                            <img
                              src={book.bookImage}
                              alt={book.title}
                              className="book-thumbnail"
                              onClick={() => openImageModal(book)}
                            />
                          </td>
                          <td>
                            {book.stock === 0 ? (
                              <span className="status-badge danger">
                                Out of Stock
                              </span>
                            ) : book.stock < 10 ? (
                              <span className="status-badge warning">
                                Low Stock
                              </span>
                            ) : (
                              <span className="status-badge success">
                                In Stock
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn-icon edit"
                                onClick={() => openModal("EditBook", book)}
                                disabled={loading}
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                className="btn-icon delete"
                                onClick={() => openDeleteModal(book.id, "Book")}
                                disabled={loading}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "discounts" && (
            <div className="data-table-container">
              <div className="table-header">
                <h3>Discount Management</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => openModal("CreateDiscount")}
                  disabled={loading}
                >
                  <FiPlus size={16} /> Add Discount
                </button>
              </div>
              <div className="table-responsive">
                {discounts.length === 0 ? (
                  <div className="empty-state">
                    <p>No discounts available.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => openModal("CreateDiscount")}
                    >
                      Add Discount
                    </button>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Discount</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discounts.map((discount) => {
                        const isActive =
                          new Date(discount.endDate) > new Date();
                        return (
                          <tr key={discount.id}>
                            <td>{discount.name}</td>
                            <td>{discount.discountPercent}%</td>
                            <td>
                              {new Date(
                                discount.startDate
                              ).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(discount.endDate).toLocaleDateString()}
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  isActive ? "success" : "danger"
                                }`}
                              >
                                {isActive ? "Active" : "Expired"}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="btn-icon edit"
                                  onClick={() =>
                                    openModal("EditDiscount", discount)
                                  }
                                  disabled={loading}
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button
                                  className="btn-icon delete"
                                  onClick={() =>
                                    openDeleteModal(discount.id, "Discount")
                                  }
                                  disabled={loading}
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="discount-assignment-section">
                <h3>Assign Discount to Book</h3>
                <div className="assignment-form">
                  <div className="form-group">
                    <label>Select Discount</label>
                    <Select
                      name="discountId"
                      options={discounts.map((discount) => ({
                        value: discount.id,
                        label: `${discount.name} (${discount.discountPercent}%)`,
                      }))}
                      onChange={(selected) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          discountId: selected ? selected.value : null,
                        })
                      }
                      isDisabled={loading}
                      placeholder="Select a discount"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <div className="form-group">
                    <label>Select Book</label>
                    <Select
                      name="bookId"
                      options={books.map((book) => ({
                        value: book.id,
                        label: book.title,
                      }))}
                      onChange={(selected) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          bookId: selected ? selected.value : null,
                        })
                      }
                      isDisabled={loading}
                      placeholder="Select a book"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <button
                    className="btn btn-primary assign-btn"
                    onClick={handleAssignDiscount}
                    disabled={
                      loading ||
                      !assignmentForm.bookId ||
                      !assignmentForm.discountId
                    }
                  >
                    {loading ? (
                      <span className="loader"></span>
                    ) : (
                      "Confirm Assign"
                    )}
                  </button>
                </div>
              </div>

              <div className="assigned-discounts-section">
                <div className="table-header">
                  <h3>Assigned Discounts</h3>
                </div>
                <div className="table-responsive">
                  {books.filter((book) => book.discountId).length === 0 ? (
                    <div className="empty-state">
                      <p>No discounts assigned to books.</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Book ID</th>
                          <th>Book Name</th>
                          <th>Discount Id</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books
                          .filter((book) => book.discountId)
                          .map((book) => {
                            const discount = discounts.find(
                              (d) => d.id === book.discountId
                            );
                            return (
                              <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.discountId}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="data-table-container">
              <div className="table-header">
                <h3>Announcement Management</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => openModal("CreateAnnouncement")}
                  disabled={loading}
                >
                  <FiPlus size={16} /> Add Announcement
                </button>
              </div>
              <div className="table-responsive">
                {announcements.length === 0 ? (
                  <div className="empty-state">
                    <p>No announcements available.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => openModal("CreateAnnouncement")}
                    >
                      Add Announcement
                    </button>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Expires At</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.map((announcement) => {
                        const isActive =
                          !announcement.expiresAt ||
                          new Date(announcement.expiresAt) > new Date();
                        return (
                          <tr key={announcement.id}>
                            <td>{announcement.title}</td>
                            <td className="content-cell">
                              {announcement.content?.substring(0, 50)}...
                            </td>
                            <td>
                              {announcement.expiresAt
                                ? new Date(
                                    announcement.expiresAt
                                  ).toLocaleDateString()
                                : "No expiry"}
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  isActive ? "success" : "danger"
                                }`}
                              >
                                {isActive ? "Active" : "Expired"}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="btn-icon edit"
                                  onClick={() =>
                                    openModal("EditAnnouncement", announcement)
                                  }
                                  disabled={loading}
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button
                                  className="btn-icon delete"
                                  onClick={() =>
                                    openDeleteModal(
                                      announcement.id,
                                      "Announcement"
                                    )
                                  }
                                  disabled={loading}
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {showModal && (
            <Modal
              type={modalType}
              item={currentItem}
              onClose={() => setShowModal(false)}
              onSave={handleSave}
              authors={authors}
              genres={genres}
              userId={userId}
            />
          )}

          {showImageModal && (
            <ImagePreviewModal
              book={selectedBook}
              onClose={() => setShowImageModal(false)}
            />
          )}
          {showDeleteModal && (
            <ConfirmDeleteModal
              entity={deleteEntity}
              onConfirm={() => handleDelete(deleteItem.id, deleteEntity)}
              onCancel={() => {
                setShowDeleteModal(false);
                setDeleteItem(null);
                setDeleteEntity("");
              }}
            />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
