import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { MapPin, Navigation, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '450px',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const GoogleMapsLocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation?.latitude && initialLocation?.longitude
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : null
  );
  const [mapCenter, setMapCenter] = useState(
    initialLocation?.latitude && initialLocation?.longitude
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : defaultCenter
  );
  const [address, setAddress] = useState('');
  const [addressComponents, setAddressComponents] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [gettingLocation, setGettingLocation] = useState(false);

  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const result = results[0];
          setAddress(result.formatted_address);

          // Extract address components
          const components = {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          };

          result.address_components.forEach((component) => {
            const types = component.types;

            if (types.includes('street_number')) {
              components.street = component.long_name + ' ' + components.street;
            }
            if (types.includes('route')) {
              components.street = components.street + component.long_name;
            }
            if (types.includes('locality')) {
              components.city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              components.state = component.long_name;
            }
            if (types.includes('postal_code')) {
              components.zipCode = component.long_name;
            }
            if (types.includes('country')) {
              components.country = component.long_name;
            }
          });

          setAddressComponents(components);

          // Send to parent
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: components,
          });
        }
      });
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  }, [onLocationSelect]);

  const handleMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleMarkerDragEnd = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    toast.loading('Getting your precise location...', { id: 'location-loading' });

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        const newPosition = { lat, lng };

        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
        reverseGeocode(lat, lng);

        toast.dismiss('location-loading');

        // Check accuracy and provide appropriate feedback
        if (accuracy > 100) {
          toast.error(
            `⚠️ Location accuracy is poor (${Math.round(accuracy)}m). Please use the search box or click directly on the map for precise location.`,
            {
              duration: 7000,
            }
          );
        } else if (accuracy > 50) {
          toast.warning(
            `Location detected with moderate accuracy (${Math.round(accuracy)}m). Consider using search or adjusting the marker for better precision.`,
            {
              duration: 6000,
            }
          );
        } else if (accuracy > 10) {
          toast.success(
            `Location detected! (Accuracy: ${Math.round(accuracy)}m)\nFor better precision, drag the marker or use the search box.`,
            {
              icon: '📍',
              duration: 5000,
            }
          );
        } else {
          toast.success(
            `Excellent! Precise location detected (Accuracy: ${Math.round(accuracy)}m) ✓`,
            {
              icon: '🎯',
              duration: 4000,
            }
          );
        }

        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.dismiss('location-loading');

        let errorMessage = 'Failed to get your location. ';
        let suggestion = '';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied.';
            suggestion = 'Please enable location permission in your browser settings, or use the search box to find your location.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            suggestion = 'Try using the search box or click directly on the map to set your location.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            suggestion = 'Please try again or use the search box to find your address.';
            break;
          default:
            errorMessage = 'Unknown error occurred.';
            suggestion = 'Please use the search box or click on the map to set your location.';
        }

        toast.error(errorMessage + ' ' + suggestion, {
          duration: 6000,
        });
        setGettingLocation(false);
      },
      options
    );
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPosition = { lat, lng };

        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
        setAddress(place.formatted_address);

        // Extract address components
        const components = {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        };

        place.address_components?.forEach((component) => {
          const types = component.types;

          if (types.includes('street_number')) {
            components.street = component.long_name + ' ' + components.street;
          }
          if (types.includes('route')) {
            components.street = components.street + component.long_name;
          }
          if (types.includes('locality')) {
            components.city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            components.state = component.long_name;
          }
          if (types.includes('postal_code')) {
            components.zipCode = component.long_name;
          }
          if (types.includes('country')) {
            components.country = component.long_name;
          }
        });

        setAddressComponents(components);

        // Send to parent
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: components,
        });

        toast.success('Location found!');
      }
    }
  };

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading maps. Please check your Google Maps API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center text-lg">
          <MapPin className="h-5 w-5 mr-2" />
          Select Location on Map
        </h3>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Recommendation Badge */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✨</span>
              <p className="text-base font-bold text-green-900">Recommended: Search by Address</p>
            </div>
            <p className="text-sm text-green-800 ml-9">Get pinpoint accuracy (±10m) by typing your address below</p>
          </div>

          {/* Search Box - Primary Method */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center">
              <Search className="h-5 w-5 mr-2 text-green-600" />
              Search Location (Most Accurate)
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Type your address: e.g., '123 Main St, City, State'"
                  className="w-full pl-12 pr-4 py-4 border-2 border-green-400 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-medium text-base shadow-md hover:shadow-lg transition-all"
                />
              </Autocomplete>
            </div>
            <p className="text-xs text-gray-600 mt-2 ml-1">🔍 Start typing to see suggestions</p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-blue-50 text-gray-600 font-semibold">OR</span>
            </div>
          </div>

          {/* Current Location Button - Secondary Method */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center">
              <Navigation className="h-5 w-5 mr-2 text-blue-600" />
              Use GPS Location
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              className="w-full px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base"
            >
              {gettingLocation ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Detecting GPS Location...
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5 mr-2" />
                  Detect My Current Location
                </>
              )}
            </button>
            <p className="text-xs text-orange-600 mt-2 ml-1 font-medium">⚠️ May be less accurate indoors or in urban areas</p>
          </div>

        </div>

        {/* Google Map */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border-4 border-white">
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
            <p className="text-xs font-semibold text-gray-700">
              📍 Click on map or drag marker
            </p>
          </div>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={markerPosition ? 18 : 5}
            center={mapCenter}
            onClick={handleMapClick}
            onLoad={onMapLoad}
            options={{
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
              zoomControl: true,
              mapTypeId: 'roadmap',
              gestureHandling: 'greedy',
            }}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                animation={window.google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        </div>

        {/* Location Details */}
        {markerPosition && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-white border border-blue-200 rounded-xl">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Latitude
                  </label>
                  <p className="text-sm font-mono font-bold text-gray-900">
                    {markerPosition.lat.toFixed(6)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Longitude
                  </label>
                  <p className="text-sm font-mono font-bold text-gray-900">
                    {markerPosition.lng.toFixed(6)}
                  </p>
                </div>
              </div>

              {address && (
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Address
                  </label>
                  <p className="text-sm text-gray-700 mt-1">{address}</p>
                </div>
              )}

              {/* Address Components */}
              {(addressComponents.city || addressComponents.state || addressComponents.zipCode) && (
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2 block">
                    Auto-filled Details
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {addressComponents.city && (
                      <div>
                        <span className="text-gray-600">City:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {addressComponents.city}
                        </span>
                      </div>
                    )}
                    {addressComponents.state && (
                      <div>
                        <span className="text-gray-600">State:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {addressComponents.state}
                        </span>
                      </div>
                    )}
                    {addressComponents.zipCode && (
                      <div>
                        <span className="text-gray-600">ZIP:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {addressComponents.zipCode}
                        </span>
                      </div>
                    )}
                    {addressComponents.street && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Street:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {addressComponents.street}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps?q=${markerPosition.lat},${markerPosition.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View in Google Maps
              </a>
              <button
                type="button"
                onClick={() => {
                  setMarkerPosition(null);
                  setAddress('');
                  setAddressComponents({ street: '', city: '', state: '', zipCode: '', country: '' });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-300 rounded-xl">
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-2 text-base">💡 How to select your location:</p>
            <ul className="ml-4 space-y-2 list-disc">
              <li><strong>Option 1:</strong> Click the GPS button for automatic detection</li>
              <li><strong>Option 2:</strong> Type your address in the search box above</li>
              <li><strong>Option 3:</strong> Click anywhere on the map</li>
              <li><strong>Option 4:</strong> Drag the marker to adjust position</li>
            </ul>
            <div className="mt-3 p-3 bg-white rounded-lg border-2 border-blue-300">
              <p className="text-xs font-bold text-blue-900 mb-2">⚠️ Important Accuracy Information:</p>
              <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                <li><strong>Best accuracy:</strong> Less than 10 meters ✓</li>
                <li><strong>GPS issues:</strong> Works poorly indoors or in urban areas</li>
                <li><strong>Recommendation:</strong> Use address search for precise location</li>
                <li>Always verify and adjust marker position on map</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsLocationPicker;
