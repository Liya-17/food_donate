import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [coordinates, setCoordinates] = useState({
    latitude: initialLocation?.latitude || '',
    longitude: initialLocation?.longitude || '',
  });
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      onLocationSelect(coordinates);
      reverseGeocode(coordinates.latitude, coordinates.longitude);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates.latitude, coordinates.longitude]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({
          latitude: lat,
          longitude: lng,
        });
        toast.success('Location detected successfully!');
        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get your location. Please enter manually.');
        setLoading(false);
      }
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const searchLocation = async () => {
    if (!address.trim()) {
      toast.error('Please enter an address to search');
      return;
    }

    setSearching(true);
    try {
      // Using OpenStreetMap Nominatim for geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
        toast.success('Location found!');
      } else {
        toast.error('Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      toast.error('Failed to search location');
    } finally {
      setSearching(false);
    }
  };

  const handleManualInput = (field, value) => {
    setCoordinates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-3 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Location Information
        </h3>

        {/* Get Current Location Button */}
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <Navigation className="h-5 w-5 mr-2" />
              Use Current Location
            </>
          )}
        </button>

        {/* Address Search */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              placeholder="Enter address or landmark"
              className="flex-1 input-field"
            />
            <button
              type="button"
              onClick={searchLocation}
              disabled={searching}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {searching ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Manual Coordinates Input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={coordinates.latitude}
              onChange={(e) => handleManualInput('latitude', e.target.value)}
              placeholder="e.g., 40.7128"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={coordinates.longitude}
              onChange={(e) => handleManualInput('longitude', e.target.value)}
              placeholder="e.g., -74.0060"
              className="input-field"
            />
          </div>
        </div>

        {/* Display detected address */}
        {address && coordinates.latitude && coordinates.longitude && (
          <div className="mt-3 p-3 bg-white border border-blue-300 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Detected Location:</span>
              <br />
              {address}
            </p>
          </div>
        )}

        {/* Map Preview Link */}
        {coordinates.latitude && coordinates.longitude && (
          <div className="mt-3">
            <a
              href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center"
            >
              <MapPin className="h-4 w-4 mr-1" />
              View on Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
