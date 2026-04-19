import React, { useState, useEffect } from 'react';
import { 
  User, Building, Mail, Phone, Shield, Camera, Loader2, Save, Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth(); // We keep this just in case, but rely on DB for form data
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize empty form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    taxId: '',
  });

  // 1. Fetch fresh data straight from the database when the page loads!
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/auth/me');
        const dbUser = response.data;
        
        // Populate the form with the actual database information
        setFormData({
          name: dbUser.name || '',
          email: dbUser.email || '',
          phone: dbUser.phone || '',
          businessName: dbUser.businessName || '',
          address: dbUser.address || '',
          taxId: dbUser.taxId || '',
        });
      } catch (error) {
        console.error("Error fetching profile from DB:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Save the updated data directly to the database!
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Send the updated data to the backend
      const response = await axiosInstance.put('/auth/me', formData);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Sync our form with what the database confirmed was saved
      const updatedUser = response.data;
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        businessName: updatedUser.businessName || '',
        address: updatedUser.address || '',
        taxId: updatedUser.taxId || '',
      });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show a loading spinner while fetching data from the database
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">Manage your personal and business profile</p>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 flex flex-col items-center text-center transition-colors">
            <div className="relative mb-4 group cursor-pointer">
              <div className="h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-md transition-colors">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'V'}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">{formData.name || 'Your Name'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">{formData.businessName || 'Your Business'}</p>
            
            <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 space-y-3 text-sm text-left transition-colors">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Shield size={16} className="text-slate-400 dark:text-slate-500" />
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2 transition-colors">
              <User size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-800 dark:text-white transition-colors">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 dark:disabled:text-slate-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2 transition-colors">
              <Building size={18} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-800 dark:text-white transition-colors">Business Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Company / Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Business Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="123 Business Rd, Suite 100&#10;City, State, ZIP"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 transition-colors resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">Tax ID / VAT Number</label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Optional"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 transition-colors"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;