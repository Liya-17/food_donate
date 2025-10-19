import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../services/api';
import { Calendar, MapPin, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleMapsLocationPicker from '../components/GoogleMapsLocationPicker';

const CreateDonation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: 'vegetarian',
    quantity: '',
    servings: '',
    category: 'cooked-food',
    expiryTime: '',
    availableTo: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    specialInstructions: '',
    contactPhone: '',
    isUrgent: false,
  });
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
  });

  const handleLocationSelect = (locationData) => {
    // Set coordinates
    setLocation({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    });

    // Auto-fill address fields if address components are provided
    if (locationData.address) {
      setFormData((prevData) => ({
        ...prevData,
        street: locationData.address.street || prevData.street,
        city: locationData.address.city || prevData.city,
        state: locationData.address.state || prevData.state,
        zipCode: locationData.address.zipCode || prevData.zipCode,
      }));
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Add pickup location
      data.append('pickupLocation[address][street]', formData.street);
      data.append('pickupLocation[address][city]', formData.city);
      data.append('pickupLocation[address][state]', formData.state);
      data.append('pickupLocation[address][zipCode]', formData.zipCode);

      // Add contact info
      data.append('contactInfo[phone]', formData.contactPhone);

      // Add location coordinates (only if valid numbers)
      if (
        location.latitude &&
        location.longitude &&
        !isNaN(Number(location.latitude)) &&
        !isNaN(Number(location.longitude))
      ) {
        data.append('latitude', Number(location.latitude));
        data.append('longitude', Number(location.longitude));
      }

      // Add images
      images.forEach((image) => {
        data.append('images', image);
      });

      await donationAPI.createDonation(data);

      toast.success('Donation created successfully!');
      navigate('/my-donations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
            Create Donation
          </h1>
          <p className="text-xl text-gray-600">Share your surplus food with those in need 🍲</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center mr-3 shadow-lg">
                  1
                </span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Donation Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field text-lg"
                    placeholder="e.g., Fresh Pizza from Restaurant"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field resize-none"
                    rows="4"
                    placeholder="Describe the food donation in detail..."
                  />
                  <p className="text-xs text-gray-500 mt-2">Include details about freshness, packaging, and any special notes</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🥗 Food Type *
                  </label>
                  <select name="foodType" value={formData.foodType} onChange={handleChange} className="input-field cursor-pointer">
                    <option value="vegetarian">🥬 Vegetarian</option>
                    <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                    <option value="vegan">🌱 Vegan</option>
                    <option value="mixed">🍽️ Mixed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📦 Category *
                  </label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field cursor-pointer">
                    <option value="cooked-food">🍲 Cooked Food</option>
                    <option value="raw-food">🥩 Raw Food</option>
                    <option value="packaged-food">📦 Packaged Food</option>
                    <option value="fruits-vegetables">🍎 Fruits & Vegetables</option>
                    <option value="bakery">🍞 Bakery</option>
                    <option value="other">➕ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ⚖️ Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 10 plates, 5kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    👥 Number of Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    required
                    min="1"
                    value={formData.servings}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            {/* Time Information */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-700 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center mr-3 shadow-lg">
                  <Calendar className="h-5 w-5" />
                </span>
                Time Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📅 Available Until *
                  </label>
                  <input
                    type="datetime-local"
                    name="availableTo"
                    required
                    value={formData.availableTo}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">When can the food be picked up?</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ⏰ Expiry Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="expiryTime"
                    required
                    value={formData.expiryTime}
                    onChange={handleChange}
                    className="input-field cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">When will the food expire?</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-green-700 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center mr-3 shadow-lg">
                  <MapPin className="h-5 w-5" />
                </span>
                Pickup Location
              </h2>

              {/* Google Maps Location Picker Component */}
              <GoogleMapsLocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={location}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pl-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🏠 Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">🏙️ City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">📍 State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">📮 ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📞 Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-700 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center mr-3 shadow-lg">
                  <Upload className="h-5 w-5" />
                </span>
                Additional Details
              </h2>

              <div className="space-y-6 pl-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="input-field resize-none"
                    rows="4"
                    placeholder="Any special pickup instructions, parking details, or access codes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    📸 Images (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="input-field cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Upload up to 5 images to show the food quality</p>
                  {images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from(images).map((image, index) => (
                        <div key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                          ✓ {image.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-5">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="isUrgent"
                      id="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleChange}
                      className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="isUrgent" className="ml-3 cursor-pointer">
                      <span className="text-base font-bold text-orange-900 block">⚠️ Mark as Urgent</span>
                      <span className="text-sm text-orange-800">Check this if the food needs to be picked up immediately</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Donation...
                  </span>
                ) : (
                  '✓ Create Donation'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Be accurate with expiry time to ensure food safety</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Add clear photos to help receivers know what to expect</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Include special instructions for easy pickup</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Mark as urgent if the food needs immediate pickup</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
