import { Search, Filter, Calendar, MapPin, Utensils } from 'lucide-react';

const StoryFilters = ({ filters, onFilterChange }) => {
  const foodTypes = [
    { value: '', label: 'All Types' },
    { value: 'vegetarian', label: '🥗 Vegetarian' },
    { value: 'non-vegetarian', label: '🍗 Non-Vegetarian' },
    { value: 'vegan', label: '🌱 Vegan' },
    { value: 'mixed', label: '🍽️ Mixed' }
  ];

  const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filter Success Stories</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Search className="inline h-4 w-4 mr-1" />
            Search
          </label>
          <input
            type="text"
            placeholder="Search stories..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Food Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Utensils className="inline h-4 w-4 mr-1" />
            Food Type
          </label>
          <select
            value={filters.foodType}
            onChange={(e) => onFilterChange('foodType', e.target.value)}
            className="input-field"
          >
            {foodTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Time Period
          </label>
          <select
            value={filters.timeRange}
            onChange={(e) => onFilterChange('timeRange', e.target.value)}
            className="input-field"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            placeholder="City..."
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.foodType || filters.timeRange !== 'all' || filters.location) && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.search && (
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              Search: {filters.search}
              <button
                onClick={() => onFilterChange('search', '')}
                className="hover:bg-primary-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filters.foodType && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {filters.foodType}
              <button
                onClick={() => onFilterChange('foodType', '')}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filters.timeRange !== 'all' && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {timeRanges.find(r => r.value === filters.timeRange)?.label}
              <button
                onClick={() => onFilterChange('timeRange', 'all')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filters.location && (
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {filters.location}
              <button
                onClick={() => onFilterChange('location', '')}
                className="hover:bg-orange-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryFilters;
