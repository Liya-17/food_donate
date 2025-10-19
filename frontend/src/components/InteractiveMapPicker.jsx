import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation, Search, Crosshair } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map events
function LocationMarker({ position, setPosition, onLocationChange }) {
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const { lat, lng } = marker.getLatLng();
        setPosition([lat, lng]);
        onLocationChange(lat, lng);
      }
    },
  };

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  );
}

// Component to recenter map
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
}

const InteractiveMapPicker = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState(
    initialLocation?.latitude && initialLocation?.longitude
      ? [initialLocation.latitude, initialLocation.longitude]
      : null
  );
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const [address, setAddress] = useState('');
  const [addressComponents, setAddressComponents] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [useHighAccuracy, setUseHighAccuracy] = useState(true);

  useEffect(() => {
    if (position) {
      reverseGeocode(position[0], position[1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  const handleLocationChange = (lat, lng) => {
    reverseGeocode(lat, lng);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    const options = {
      enableHighAccuracy: useHighAccuracy,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const newPosition = [lat, lng];

        setPosition(newPosition);
        setMapCenter(newPosition);
        reverseGeocode(lat, lng);

        setLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get your location. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location unavailable. Try again.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Request timed out. Try again.';
            break;
          default:
            errorMessage += 'Unknown error occurred.';
        }

        alert(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data.display_name) {
        setAddress(data.display_name);

        // Extract structured address components
        const addr = data.address || {};

        const components = {
          street: addr.road || addr.street || addr.suburb || '',
          city: addr.city || addr.town || addr.village || addr.county || '',
          state: addr.state || addr.region || '',
          zipCode: addr.postcode || '',
          country: addr.country || ''
        };

        setAddressComponents(components);

        // Send both coordinates and address components to parent
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: components
        });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const searchLocation = async () => {
    if (!address.trim()) {
      alert('Please enter an address to search');
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        setMapCenter(newPosition);
        reverseGeocode(parseFloat(lat), parseFloat(lon));
      } else {
        alert('Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      alert('Failed to search location');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center text-lg">
          <MapPin className="h-5 w-5 mr-2" />
          Choose Location on Map
        </h3>

        {/* Controls */}
        <div className="space-y-3 mb-4">
          {/* Get Current Location */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loading}
              className="flex-1 min-w-[200px] px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Detecting...
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5 mr-2" />
                  Use My Current Location
                </>
              )}
            </button>

            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
              <input
                type="checkbox"
                checked={useHighAccuracy}
                onChange={(e) => setUseHighAccuracy(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <Crosshair className="h-4 w-4 mr-1" />
                High Accuracy
              </span>
            </label>
          </div>

          {/* Search Address */}
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              placeholder="Search: street, city, landmark..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={searchLocation}
              disabled={searching}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {searching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="relative rounded-lg overflow-hidden shadow-lg border-4 border-white">
          <div className="absolute top-2 left-2 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md">
            <p className="text-xs font-semibold text-gray-700">
              Click on map or drag marker
            </p>
          </div>

          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={position}
              setPosition={setPosition}
              onLocationChange={handleLocationChange}
            />
            <RecenterMap position={position} />
          </MapContainer>
        </div>

        {/* Coordinates Display */}
        {position && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-white border border-blue-300 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Latitude
                  </label>
                  <p className="text-sm font-mono font-bold text-gray-900">
                    {position[0].toFixed(6)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Longitude
                  </label>
                  <p className="text-sm font-mono font-bold text-gray-900">
                    {position[1].toFixed(6)}
                  </p>
                </div>
              </div>

              {address && (
                <div className="pt-2 border-t border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Address
                  </label>
                  <p className="text-sm text-gray-700 mt-1">{address}</p>
                </div>
              )}

              {/* Show extracted address components */}
              {(addressComponents.city || addressComponents.state || addressComponents.zipCode) && (
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">
                    Auto-filled Details
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {addressComponents.city && (
                      <div>
                        <span className="text-gray-600">City:</span>
                        <span className="ml-1 font-medium text-gray-900">{addressComponents.city}</span>
                      </div>
                    )}
                    {addressComponents.state && (
                      <div>
                        <span className="text-gray-600">State:</span>
                        <span className="ml-1 font-medium text-gray-900">{addressComponents.state}</span>
                      </div>
                    )}
                    {addressComponents.zipCode && (
                      <div>
                        <span className="text-gray-600">Pincode:</span>
                        <span className="ml-1 font-medium text-gray-900">{addressComponents.zipCode}</span>
                      </div>
                    )}
                    {addressComponents.street && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Street:</span>
                        <span className="ml-1 font-medium text-gray-900">{addressComponents.street}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View in Google Maps
              </a>
              <button
                type="button"
                onClick={() => {
                  setPosition(null);
                  setAddress('');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">💡 Tips:</p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Click anywhere on the map to set location</li>
              <li>Drag the red marker to adjust position</li>
              <li>Enable &quot;High Accuracy&quot; for GPS precision</li>
              <li>Zoom in for more precise selection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPicker;
