const axios = require('axios');

/**
 * Geocode an address to coordinates using Nominatim (OpenStreetMap)
 * Free and doesn't require API key
 */
const geocodeAddress = async (address) => {
  try {
    const { street, city, state, zipCode, country = 'India' } = address;

    // Build query string
    const addressParts = [street, city, state, zipCode, country].filter(Boolean);
    const query = addressParts.join(', ');

    if (!query) {
      throw new Error('Address is required for geocoding');
    }

    // Use Nominatim API (OpenStreetMap's geocoding service)
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'FoodDonationPlatform/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formattedAddress: result.display_name,
        boundingBox: result.boundingbox
      };
    }

    throw new Error('Address not found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Reverse geocode coordinates to address
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
        zoom: 18, // Higher zoom for more accurate results (18 = building level)
        'accept-language': 'en'
      },
      headers: {
        'User-Agent': 'FoodDonationPlatform/1.0'
      }
    });

    if (response.data && response.data.address) {
      const addr = response.data.address;

      // Build street address from multiple possible fields
      const streetParts = [
        addr.house_number,
        addr.road || addr.street || addr.pedestrian || addr.footway
      ].filter(Boolean);

      const street = streetParts.length > 0
        ? streetParts.join(' ')
        : (addr.suburb || addr.neighbourhood || addr.hamlet || '');

      return {
        street: street,
        city: addr.city || addr.town || addr.village || addr.municipality || '',
        state: addr.state || addr.state_district || '',
        zipCode: addr.postcode || '',
        country: addr.country || 'India',
        formattedAddress: response.data.display_name,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      };
    }

    throw new Error('Location not found');
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    throw new Error(`Reverse geocoding failed: ${error.message}`);
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Search for locations (autocomplete)
 */
const searchLocations = async (query, limit = 5) => {
  try {
    if (!query || query.length < 3) {
      return [];
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: limit,
        addressdetails: 1,
        countrycodes: 'in' // Limit to India
      },
      headers: {
        'User-Agent': 'FoodDonationPlatform/1.0'
      }
    });

    return response.data.map(result => ({
      displayName: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.address
    }));
  } catch (error) {
    console.error('Location search error:', error.message);
    return [];
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocode,
  calculateDistance,
  searchLocations
};
