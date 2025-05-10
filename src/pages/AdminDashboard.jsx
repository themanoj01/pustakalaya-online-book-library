import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [books, setBooks] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const stockChartRef = useRef(null);
    const salesChartRef = useRef(null);

    // Fetch data
    useEffect(() => {
        fetchBooks();
        fetchDiscounts();
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        if (books.length > 0) {
            renderCharts();
        }
    }, [books]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5198/api/Book/GetAll');
            // Normalize response to lowercase keys for frontend
            const normalizedBooks = Array.isArray(response.data)
                ? response.data.map(book => ({
                      id: book.id,
                      title: book.title,
                      isbn: book.isbn,
                      price: book.price,
                      stock: book.stock,
                      language: book.language,
                      format: book.format,
                      publisher: book.publisher,
                      publicationDate: book.publicationDate,
                      description: book.description,
                      discountId: book.discountId,
                      totalSold: book.totalSold || 0
                  }))
                : [];
                console.log(normalizedBooks);
                
            setBooks(normalizedBooks);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        }
    };

    const fetchDiscounts = async () => {
        try {
            const response = await axios.get('http://localhost:5198/api/Discount/GetAll');
            console.log('Discounts API response:', response.data); // Debug
            setDiscounts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching discounts:', error);
            setDiscounts([]);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:5198/api/Announcement/GetAll');
            setAnnouncements(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setAnnouncements([]);
        }
    };

    // Chart rendering
    const renderCharts = () => {
        if (stockChartRef.current) {
            stockChartRef.current.destroy();
        }
        const stockCtx = document.getElementById('stockChart').getContext('2d');
        stockChartRef.current = new Chart(stockCtx, {
            type: 'bar',
            data: {
                labels: books.map(b => b.title?.substring(0, 20)),
                datasets: [{
                    label: 'Stock Levels',
                    data: books.map(b => b.stock),
                    backgroundColor: '#4a90e2',
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });

        if (salesChartRef.current) {
            salesChartRef.current.destroy();
        }
        const salesCtx = document.getElementById('salesChart').getContext('2d');
        salesChartRef.current = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: books.map(b => b.title?.substring(0, 20)),
                datasets: [{
                    label: 'Total Sold',
                    data: books.map(b => b.totalSold || 0),
                    borderColor: '#e94e77',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    };

    // CRUD Handlers
    const handleCreate = async (data, endpoint) => {
        try {
            console.log(`Creating ${endpoint} with data:`, data); // Debug
            await axios.post(`http://localhost:5198/api/${endpoint}/Add`, {dto: data});
            refreshData(endpoint);
            setShowModal(false);
        } catch (error) {
            console.error(`Error creating ${endpoint}:`, error.response?.data || error.message);
            alert(`Failed to create ${endpoint}. Check console for details.`);
        }
    };

    const handleUpdate = async (id, data, endpoint) => {
        try {
            console.log(`Updating ${endpoint} ID ${id} with data:`, data); // Debug
            await axios.put(`http://localhost:5198/api/${endpoint}/${id}`, data);
            refreshData(endpoint);
            setShowModal(false);
        } catch (error) {
            console.error(`Error updating ${endpoint}:`, error.response?.data || error.message);
            alert(`Failed to update ${endpoint}. Check console for details.`);
        }
    };

    const handleDelete = async (id, endpoint) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://localhost:5198/api/${endpoint}/${id}`);
                refreshData(endpoint);
            } catch (error) {
                console.error(`Error deleting ${endpoint}:`, error.response?.data || error.message);
                alert(`Failed to delete ${endpoint}. Check console for details.`);
            }
        }
    };

    const refreshData = (endpoint) => {
        if (endpoint === 'Book') fetchBooks();
        else if (endpoint === 'Discount') fetchDiscounts();
        else if (endpoint === 'Announcement') fetchAnnouncements();
    };

    // Modal Handlers
    const openModal = (type, item = null) => {
        setModalType(type);
        setCurrentItem(item);
        setShowModal(true);
    };

    // Components
    const BookForm = ({ item, onSubmit }) => {
        const [formData, setFormData] = useState({
            title: item?.title || '',
            isbn: item?.isbn || '',
            price: item?.price || '',
            stock: item?.stock || '',
            language: item?.language || '',
            format: item?.format || '',
            publisher: item?.publisher || '',
            publicationDate: item?.publicationDate?.split('T')[0] || '',
            description: item?.description || '',
            discountId: item?.discountId || ''
        });
        const [loading, setLoading] = useState(false);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async () => {
            setLoading(true);
            try {
                console.log('Submitting book data:', formData); // Debug
                const submitData = {
                    ...formData,
                    Price: parseFloat(formData.Price) || 0,
                    Stock: parseInt(formData.Stock) || 0,
                    DiscountId: formData.DiscountId ? parseInt(formData.DiscountId) : null
                };
                await onSubmit(submitData);
            } catch (error) {
                console.error('Error submitting book:', error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="modal-form">
                <input name="Title" value={formData.Title} onChange={handleChange} placeholder="Title" />
                <input name="ISBN" value={formData.ISBN} onChange={handleChange} placeholder="ISBN" />
                <input name="Price" type="number" value={formData.Price} onChange={handleChange} placeholder="Enter Price" />
                <input name="Stock" type="number" value={formData.Stock} onChange={handleChange} placeholder="Enter Stock" />
                <input name="Language" value={formData.Language} onChange={handleChange} placeholder="Language" />
                <input name="Format" value={formData.Format} onChange={handleChange} placeholder="Format" />
                <input name="Publisher" value={formData.Publisher} onChange={handleChange} placeholder="Publisher" />
                <input name="PublicationDate" type="date" value={formData.PublicationDate} onChange={handleChange} />
                <textarea name="Description" value={formData.Description} onChange={handleChange} placeholder="Description" />
                <select name="DiscountId" value={formData.DiscountId} onChange={handleChange}>
                    <option value="">No Discount</option>
                    {Array.isArray(discounts) ? discounts.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    )) : null}
                </select>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="loader"></span> : 'Save'}
                </button>
            </div>
        );
    };

    const DiscountForm = ({ item, onSubmit }) => {
        const [formData, setFormData] = useState({
            name: item?.name || '',
            discountPercent: item?.discountPercent || '',
            startDate: item?.startDate?.split('T')[0] || '',
            endDate: item?.endDate?.split('T')[0] || ''
        });
        const [loading, setLoading] = useState(false);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async () => {
            setLoading(true);
            try {
                await onSubmit({
                    ...formData,
                    discountPercent: parseInt(formData.discountPercent) || 0
                });
            } catch (error) {
                console.error('Error submitting discount:', error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="modal-form">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Discount Name" />
                <input name="discountPercent" type="number" value={formData.discountPercent} onChange={handleChange} placeholder="Discount Percent" />
                <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="loader"></span> : 'Save'}
                </button>
            </div>
        );
    };

    const AnnouncementForm = ({ item, onSubmit }) => {
        const [formData, setFormData] = useState({
            title: item?.title || '',
            content: item?.content || '',
            expiresAt: item?.expiresAt?.split('T')[0] || ''
        });
        const [loading, setLoading] = useState(false);

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async () => {
            setLoading(true);
            try {
                await onSubmit(formData);
            } catch (error) {
                console.error('Error submitting announcement:', error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="modal-form">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content" />
                <input name="expiresAt" type="date" value={formData.expiresAt} onChange={handleChange} />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="loader"></span> : 'Save'}
                </button>
            </div>
        );
    };

    const Modal = () => {
        if (!showModal) return null;

        const handleSubmit = (data) => {
            if (modalType.includes('Edit')) {
                handleUpdate(currentItem.id, data, modalType.split('Edit')[1]);
            } else {
                handleCreate(data, modalType.split('Create')[1]);
            }
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{modalType.includes('Edit') ? 'Edit' : 'Create'} {modalType.split(/(Edit|Create)/)[2]}</h2>
                    {modalType.includes('Book') && <BookForm item={currentItem} onSubmit={handleSubmit} />}
                    {modalType.includes('Discount') && <DiscountForm item={currentItem} onSubmit={handleSubmit} />}
                    {modalType.includes('Announcement') && <AnnouncementForm item={currentItem} onSubmit={handleSubmit} />}
                    <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h1>Pustakalaya Admin</h1>
                <ul>
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
                    <li className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>Books</li>
                    <li className={activeTab === 'discounts' ? 'active' : ''} onClick={() => setActiveTab('discounts')}>Discounts</li>
                    <li className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>Announcements</li>
                </ul>
            </div>
            <div className="main-content">
                <header>
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                </header>
                {activeTab === 'dashboard' && (
                    <div className="dashboard-grid">
                        <div className="card">
                            <h3>Inventory Overview</h3>
                            <canvas id="stockChart"></canvas>
                        </div>
                        <div className="card">
                            <h3>Sales Performance</h3>
                            <canvas id="salesChart"></canvas>
                        </div>
                        <div className="card">
                            <h3>Quick Stats</h3>
                            <p>Total Books: {books.length}</p>
                            <p>Active Discounts: {Array.isArray(discounts) ? discounts.filter(d => new Date(d.endDate) > new Date()).length : 0}</p>
                            <p>Active Announcements: {Array.isArray(announcements) ? announcements.filter(a => !a.expiresAt || new Date(a.expiresAt) > new Date()).length : 0}</p>
                        </div>
                    </div>
                )}
                {activeTab === 'books' && (
                    <div className="table-container">
                        <div className="table-header">
                            <h3>Book Management</h3>
                            <button onClick={() => openModal('CreateBook')}>Add Book</button>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>ISBN</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
            <tbody>
                {books.map(book => (
                    <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.isbn}</td>
                        <td>${book.price}</td>
                        <td>{book.stock}</td>
                        <td>
                            <button className="action-edit" onClick={() => openModal('EditBook', book)}>Edit</button>
                            <button className="action-delete" onClick={() => handleDelete(book.id, 'Book')}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
{activeTab === 'discounts' && (
    <div className="table-container">
        <div className="table-header">
            <h3>Discount Management</h3>
            <button onClick={() => openModal('CreateDiscount')}>Add Discount</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Percent</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {discounts.map(discount => (
                    <tr key={discount.id}>
                        <td>{discount.name}</td>
                        <td>{discount.discountPercent}%</td>
                        <td>{discount.startDate?.split('T')[0]}</td>
                        <td>{discount.endDate?.split('T')[0]}</td>
                        <td>
                            <button className="action-edit" onClick={() => openModal('EditDiscount', discount)}>Edit</button>
                            <button className="action-delete" onClick={() => handleDelete(discount.id, 'Discount')}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
{activeTab === 'announcements' && (
    <div className="table-container">
        <div className="table-header">
            <h3>Announcement Management</h3>
            <button onClick={() => openModal('CreateAnnouncement')}>Add Announcement</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Expires At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {announcements.map(announcement => (
                    <tr key={announcement.id}>
                        <td>{announcement.title}</td>
                        <td>{announcement.content?.substring(0, 50)}...</td>
                        <td>{announcement.expiresAt?.split('T')[0]}</td>
                        <td>
                            <button className="action-edit" onClick={() => openModal('EditAnnouncement', announcement)}>Edit</button>
                            <button className="action-delete" onClick={() => handleDelete(announcement.id, 'Announcement')}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
            </div>
            <Modal />
        </div>
    );
};

export default AdminDashboard;