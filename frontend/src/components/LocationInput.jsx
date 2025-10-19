import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader, Navigation2 } from 'lucide-react';
import { geocodingAPI } from '../services/api';
import toast from 'react-hot-toast';

const LocationInput = ({ value, onChange, onCoordinatesChange }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [detectedCoords, setDetectedCoords] = useState(null);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for locations
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await geocodingAPI.searchLocations(query);
        setSuggestions(response.data.data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Location search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelectSuggestion = (suggestion) => {
    const address = {
      street: suggestion.address.road || suggestion.address.suburb || '',
      city: suggestion.address.city || suggestion.address.town || '',
      state: suggestion.address.state || '',
      zipCode: suggestion.address.postcode || '',
      country: 'India'
    };

    setQuery(suggestion.displayName);
    setShowSuggestions(false);
    onChange(address);

    // Also provide coordinates
    if (onCoordinatesChange) {
      onCoordinatesChange({
        latitude: suggestion.latitude,
        longitude: suggestion.longitude
      });
    }

    // Store coordinates for display
    setDetectedCoords({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    });

    toast.success('Location selected');
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingCurrentLocation(true);

    // Request high accuracy location
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;

          console.log('Location detected:', { latitude, longitude, accuracy: `${accuracy}m` });

          // Reverse geocode to get address
          const response = await geocodingAPI.reverseGeocode(latitude, longitude);
          const address = response.data.data;

          setQuery(address.formattedAddress);
          onChange({
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            country: address.country
          });

          if (onCoordinatesChange) {
            onCoordinatesChange({ latitude, longitude });
          }

          // Store coordinates for display
          setDetectedCoords({ latitude, longitude, accuracy: Math.round(accuracy) });

          toast.success(`Location detected (accuracy: ${Math.round(accuracy)}m)`);
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          toast.error('Failed to get address from location');
        } finally {
          setGettingCurrentLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Failed to get your location';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out.';
            break;
        }

        toast.error(errorMsg);
        setGettingCurrentLocation(false);
      },
      options
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pickup Location
      </label>

      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for address..."
            className="input-field pl-10 pr-10"
          />
          {loading && (
            <Loader className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={gettingCurrentLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
          title="Use current location"
        >
          {gettingCurrentLocation ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Navigation2 className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start"
            >
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{suggestion.displayName}</p>
                {suggestion.address && (
                  <p className="text-xs text-gray-500 mt-1">
                    {[suggestion.address.city, suggestion.address.state].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Manual Address Input Fields */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Or enter address manually:</p>

        <input
          type="text"
          placeholder="Street Address"
          value={value?.street || ''}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
          className="input-field"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="City"
            value={value?.city || ''}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="State"
            value={value?.state || ''}
            onChange={(e) => onChange({ ...value, state: e.target.value })}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="ZIP Code"
            value={value?.zipCode || ''}
            onChange={(e) => onChange({ ...value, zipCode: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Country"
            value={value?.country || 'India'}
            onChange={(e) => onChange({ ...value, country: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      {/* Display detected coordinates */}
      {detectedCoords && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-medium">
            📍 Coordinates: {detectedCoords.latitude.toFixed(6)}, {detectedCoords.longitude.toFixed(6)}
            {detectedCoords.accuracy && ` (±${detectedCoords.accuracy}m)`}
          </p>
          <a
            href={`https://www.google.com/maps?q=${detectedCoords.latitude},${detectedCoords.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Verify on Google Maps
          </a>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        💡 Tip: Search for your location or use current location for accurate coordinates
      </p>
    </div>
  );
};

export default LocationInput;
