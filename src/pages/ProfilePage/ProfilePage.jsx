import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const userId = JSON.parse(atob(localStorage.getItem("JwtToken").split('.')[1])).userId;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5198/pustakalaya/users/getUserById`, { params: { userId } })
      .then((res) => {
        setUserData(res.data);
        setFormData({
          userName: res.data.userName,
          userEmail: res.data.userEmail,
          userContact: res.data.userContact,
          userAddress: res.data.userAddress,
        });
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        toast.error("Failed to load user data");
      });
  }, [userId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const validatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const updateDetails = async () => {
    try {
      setUpdating(true);
      await axios.put(`http://localhost:5198/pustakalaya/users/update-user`, formData);
      
      if (profilePic) {
        const data = new FormData();
        data.append("userId", userId);
        data.append("profilePic", profilePic);
        await axios.patch(`http://localhost:5198/pustakalaya/users/update-profilePic`, data);
      }
      
      toast.success("Profile updated successfully");
      setUpdating(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
      setUpdating(false);
    }
  };

  const updatePassword = async () => {
    if (!validatePassword()) return;
    
    try {
      setUpdating(true);
      await axios.patch(
        `http://localhost:5198/pustakalaya/users/update-password`, 
        passwordData, 
        { params: { userId } }
      );
      
      toast.success("Password updated successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setUpdating(false);
    } catch (error) {
      console.error(error);
      toast.error("Password update failed. Check your Password");
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {previewURL ? (
            <img src={previewURL} alt="Profile Preview" />
          ) : userData.profileURL ? (
            <img src={userData.profileURL} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {formData.userName ? formData.userName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="avatar-overlay">
            <label htmlFor="profile-upload" className="upload-btn">
              <i className="upload-icon">📷</i>
            </label>
            <input 
              type="file" 
              id="profile-upload" 
              onChange={handleProfilePicChange} 
              className="hidden-input"
              accept="image/*"
            />
          </div>
        </div>
        <h1>{formData.userName || 'Your Profile'}</h1>
      </div>

      <div className="tab-container">
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`} 
            onClick={() => setActiveTab("details")}
          >
            <i className="tab-icon">👤</i> User Details
          </button>
          <button 
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`} 
            onClick={() => setActiveTab("password")}
          >
            <i className="tab-icon">🔒</i> Change Password
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "details" && (
            <div className="profile-form animate-fade">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="userName" 
                  value={formData.userName || ''} 
                  onChange={handleInputChange} 
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="userEmail" 
                  value={formData.userEmail || ''} 
                  onChange={handleInputChange} 
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Number</label>
                  <input 
                    type="text" 
                    name="userContact" 
                    value={formData.userContact || ''} 
                    onChange={handleInputChange} 
                    placeholder="Phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <input 
                    type="text" 
                    name="userAddress" 
                    value={formData.userAddress || ''} 
                    onChange={handleInputChange} 
                    placeholder="Your address"
                  />
                </div>
              </div>

              <button 
                className="update-btn" 
                onClick={updateDetails}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === "password" && (
            <div className="profile-form animate-fade">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="oldPassword" 
                  value={passwordData.oldPassword} 
                  onChange={handlePasswordChange} 
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange} 
                  placeholder="Confirm new password"
                />
              </div>

              <div className="password-requirements">
                <p>Password must be at least 6 characters long</p>
              </div>
              
              <button 
                className="update-btn" 
                onClick={updatePassword}
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;