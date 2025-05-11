import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userContact: '',
    userAddress: '',
    profilePic: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

 const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic' && files && files[0]) {
      setFormData(prev => ({ ...prev, profilePic: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.userPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'confirmPassword') {
        payload.append(key, value);
      }
    });

    try {
      await axios.post('http://localhost:5198/pustakalaya/users/register', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      toast.success('Registration successful! Please login.');
      
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create Account</h1>
        <p className="register-subtitle">Join our community of book lovers</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">

           <div className="form-group profile-upload">
            <label>Profile Picture</label>
            <div className="profile-pic-wrapper">
              <label htmlFor="profilePic" className="profile-pic-label">
                <img
                  src={previewImage || 'src/assets/images/default_profile.png'}
                  alt="Preview"
                  className="profile-pic-preview"
                />
                <input
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userName">Full Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userPassword">Password</label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              required
              placeholder="Create a password"
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userContact">Contact Number</label>
            <input
              type="text"
              id="userContact"
              name="userContact"
              value={formData.userContact}
              onChange={handleChange}
              required
              placeholder="10-digit phone number"
              maxLength="10"
              minLength="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="userAddress">Address</label>
            <input
              type="text"
              id="userAddress"
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              required
              placeholder="Enter your address"
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="profilePic">Profile Picture</label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div> */}

          <button type="submit" className="register-button">
            {loading? "Creating...": "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
