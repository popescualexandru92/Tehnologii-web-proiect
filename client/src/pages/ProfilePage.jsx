import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getUser, updateUser } from '../api/user.routes';
import { logout } from '../store/slices/userSlice';

const ProfilePage = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getUser(user.id);
        
        if (response?.success) {
          setFormData({
            name: response.data.name,
            email: response.data.email,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password change
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return;
      }
      if (!formData.newPassword) {
        toast.error('New password is required');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
    }

    setSaving(true);
    try {
      const updateData = {};

      // Only add fields that are not empty
      if (formData.name && formData.name.trim()) {
        updateData.name = formData.name.trim();
      }
      if (formData.email && formData.email.trim()) {
        updateData.email = formData.email.trim();
      }

      // Add password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0) {
        toast.error('No changes to save');
        setSaving(false);
        return;
      }

      const response = await updateUser(user.id, updateData);
      
      if (response?.success) {
        toast.success('Profile updated successfully! Logging out...');
        
        // Logout and redirect to login page
        setTimeout(() => {
          dispatch(logout());
          navigate('/login');
        }, 1500);
      } else {
        toast.error(response?.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 ${saving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed`}
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Account Information</h2>
            <p className="text-sm text-gray-600">User ID: {user?.id}</p>
            <p className="text-sm text-gray-600">Account created: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
