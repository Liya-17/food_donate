import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchingAPI } from '../services/api';
import { Settings, Save, Sparkles, MapPin, Clock, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const Preferences = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    dietaryPreferences: [],
    preferredCategories: [],
    maxDistance: 10,
    preferredPickupTimes: [],
    minServings: 1,
    maxServings: 100,
    notifyOnMatch: true,
    autoMatchEnabled: true
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await matchingAPI.getPreferences();
      if (response.data.data && Object.keys(response.data.data).length > 0) {
        setPreferences({
          ...preferences,
          ...response.data.data
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field, value) => {
    setPreferences(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleInputChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await matchingAPI.updatePreferences(preferences);
      toast.success('Preferences updated successfully!');
      setTimeout(() => navigate('/smart-matches'), 1000);
    } catch (error) {
      toast.error('Failed to update preferences');
      console.error('Error updating preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Matching Preferences</h1>
        </div>
        <p className="text-gray-600">
          Customize your preferences to get better donation matches
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dietary Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Dietary Preferences</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['vegetarian', 'non-vegetarian', 'vegan', 'mixed'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(preferences.dietaryPreferences || []).includes(type)}
                  onChange={() => handleCheckboxChange('dietaryPreferences', type)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="capitalize text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Food Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Preferred Food Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'cooked food',
              'raw food',
              'packaged',
              'fruits & vegetables',
              'bakery items',
              'other'
            ].map(category => (
              <label key={category} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(preferences.preferredCategories || []).includes(category)}
                  onChange={() => handleCheckboxChange('preferredCategories', category)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="capitalize text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distance Preference */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Maximum Travel Distance</h2>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <input
                type="range"
                min="1"
                max="100"
                value={preferences.maxDistance}
                onChange={(e) => handleInputChange('maxDistance', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-gray-900 min-w-[60px]">
                {preferences.maxDistance} km
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Only show donations within this distance from your location
            </p>
          </div>
        </div>

        {/* Pickup Times */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Preferred Pickup Times</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['morning', 'afternoon', 'evening', 'night'].map(time => (
              <label key={time} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(preferences.preferredPickupTimes || []).includes(time)}
                  onChange={() => handleCheckboxChange('preferredPickupTimes', time)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="capitalize text-gray-700">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Servings Range */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Servings Preference</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Servings
              </label>
              <input
                type="number"
                min="1"
                max={preferences.maxServings - 1}
                value={preferences.minServings}
                onChange={(e) => handleInputChange('minServings', parseInt(e.target.value))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Servings
              </label>
              <input
                type="number"
                min={preferences.minServings + 1}
                max="1000"
                value={preferences.maxServings}
                onChange={(e) => handleInputChange('maxServings', parseInt(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Smart Match Notifications</p>
                <p className="text-sm text-gray-600">
                  Get notified when donations match your preferences
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notifyOnMatch}
                onChange={(e) => handleInputChange('notifyOnMatch', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Auto-Match Enabled</p>
                <p className="text-sm text-gray-600">
                  Automatically find matches when new donations are posted
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoMatchEnabled}
                onChange={(e) => handleInputChange('autoMatchEnabled', e.target.checked)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Preferences;
