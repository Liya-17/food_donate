import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { donationAPI } from '../services/api';
import { MapPin, Clock, User, Navigation, Loader, Map, Heart, SlidersHorizontal } from 'lucide-react';
import { formatDateTime, getStatusColor, getFoodTypeIcon, getCategoryLabel, calculateDistance } from '../utils/helpers';
import toast from 'react-hot-toast';
import DonationMap from '../components/DonationMap';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import AdvancedSearch from '../components/AdvancedSearch';

const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'available',
    foodType: '',
    category: '',
    latitude: '',
    longitude: '',
    distance: '10000', // 10km default
  });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.foodType, filters.category, filters.latitude, filters.longitude, filters.distance]);

  const loadDonations = async () => {
    try {
      const response = await donationAPI.getDonations(filters);
      setDonations(response.data.data);
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const getNearbyDonations = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ latitude: lat, longitude: lng });
        setFilters({
          ...filters,
          latitude: lat,
          longitude: lng,
        });
        toast.success('Showing donations near you!');
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get your location');
        setGettingLocation(false);
      }
    );
  };

  const clearLocationFilter = () => {
    setUserLocation(null);
    setFilters({
      ...filters,
      latitude: '',
      longitude: '',
    });
    toast.success('Location filter cleared');
  };

  const handleAdvancedSearch = (searchFilters) => {
    setFilters({
      ...filters,
      ...searchFilters,
    });
    setShowAdvancedSearch(false);
    toast.success('Search filters applied!');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in-down flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Available Donations
            </h1>
            <p className="text-lg text-gray-600">Browse and claim food donations near you</p>
          </div>
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Advanced Search
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 border border-gray-100 animate-fade-in-up">
          {/* Location Filter */}
          <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={getNearbyDonations}
                  disabled={gettingLocation}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center disabled:opacity-50 transform hover:scale-105"
                >
                  {gettingLocation ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-5 w-5 mr-2" />
                      Find Nearby Donations
                    </>
                  )}
                </button>

                {userLocation && (
                  <button
                    onClick={clearLocationFilter}
                    className="px-5 py-2.5 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Clear Location
                  </button>
                )}
              </div>

              {userLocation && (
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Distance:
                  </label>
                  <select
                    value={filters.distance}
                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1000">1 km</option>
                    <option value="5000">5 km</option>
                    <option value="10000">10 km</option>
                    <option value="25000">25 km</option>
                    <option value="50000">50 km</option>
                    <option value="100000">100 km</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Type
              </label>
              <select
                value={filters.foodType}
                onChange={(e) => handleFilterChange('foodType', e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toggle Map/List View */}
        <div className="mb-8 flex items-center justify-between animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {donations.length} donation{donations.length !== 1 ? 's' : ''} found
              {userLocation && ' near you'}
            </p>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-5 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Map className="h-5 w-5 mr-2" />
            {showMap ? 'Show List' : 'Show Map'}
          </button>
        </div>

        {/* Map View */}
        {showMap && donations.length > 0 && (
          <div className="mb-8">
            <DonationMap donations={donations} userLocation={userLocation} />
          </div>
        )}

        {/* Donations Grid */}
        {donations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donations.map((donation, index) => (
              <Link
                key={donation._id}
                to={`/donations/${donation._id}`}
                className="group bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2 animate-fade-in-up"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                {/* Image */}
                {donation.images && donation.images.length > 0 ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={donation.images[0]}
                      alt={donation.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="w-full h-56 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{getFoodTypeIcon(donation.foodType)}</span>
                    <div className="absolute inset-0 bg-primary-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}

                <div className="p-6">

                  {/* Status Badge */}
                  <span className={`badge ${getStatusColor(donation.status)} mb-4 inline-flex`}>
                    {donation.status}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {donation.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{donation.description}</p>

                  {/* Details */}
                  <div className="space-y-3 text-sm text-gray-600 mb-5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">{donation.donor?.name || 'Anonymous'}</span>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                      </div>
                      <span>{donation.pickupLocation?.address?.city || 'Location not specified'}</span>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <span>Expires: {formatDateTime(donation.expiryTime)}</span>
                    </div>

                    {/* Show distance if user location is available */}
                    {userLocation &&
                      donation.pickupLocation?.coordinates?.coordinates &&
                      donation.pickupLocation.coordinates.coordinates[0] !== 0 && (
                        <div className="flex items-center text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg">
                          <Navigation className="h-4 w-4 mr-2" />
                          <span>
                            {calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              donation.pickupLocation.coordinates.coordinates[1],
                              donation.pickupLocation.coordinates.coordinates[0]
                            )}{' '}
                            km away
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="text-sm font-semibold text-gray-900">
                        {donation.servings} servings
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {getCategoryLabel(donation.category)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No donations found"
            description="Try adjusting your filters or check back later for new donations"
          />
        )}

        {/* Advanced Search Modal */}
        {showAdvancedSearch && (
          <AdvancedSearch
            onSearch={handleAdvancedSearch}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DonationsList;
