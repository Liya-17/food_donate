import { useState } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';

const AdvancedSearch = ({ onSearch, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    foodType: '',
    category: '',
    minServings: '',
    maxServings: '',
    isUrgent: false,
    organizationType: '',
  });

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      ...filters,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      foodType: '',
      category: '',
      minServings: '',
      maxServings: '',
      isUrgent: false,
      organizationType: '',
    });
    onSearch({});
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Advanced Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or donor name..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Food Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Type
              </label>
              <select
                value={filters.foodType}
                onChange={(e) => setFilters({ ...filters, foodType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">All Types</option>
                <option value="vegetarian">🥗 Vegetarian</option>
                <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                <option value="vegan">🌱 Vegan</option>
                <option value="mixed">🍱 Mixed</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">All Categories</option>
                <option value="cooked-food">Cooked Food</option>
                <option value="raw-food">Raw Food</option>
                <option value="packaged-food">Packaged Food</option>
                <option value="fruits-vegetables">Fruits & Vegetables</option>
                <option value="bakery">Bakery</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Min Servings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Servings
              </label>
              <input
                type="number"
                value={filters.minServings}
                onChange={(e) => setFilters({ ...filters, minServings: e.target.value })}
                placeholder="e.g., 10"
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Max Servings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Servings
              </label>
              <input
                type="number"
                value={filters.maxServings}
                onChange={(e) => setFilters({ ...filters, maxServings: e.target.value })}
                placeholder="e.g., 100"
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Donor Type
              </label>
              <select
                value={filters.organizationType}
                onChange={(e) => setFilters({ ...filters, organizationType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="">All Donors</option>
                <option value="individual">Individual</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="catering">Catering Service</option>
                <option value="grocery">Grocery Store</option>
                <option value="ngo">NGO</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Urgent Only */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isUrgent}
                  onChange={(e) => setFilters({ ...filters, isUrgent: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  🔥 Urgent donations only
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              <X className="h-5 w-5 inline mr-2" />
              Reset
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Search className="h-5 w-5 inline mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
