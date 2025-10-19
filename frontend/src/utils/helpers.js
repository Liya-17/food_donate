import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy h:mm a');
};

export const formatPickupTime = (date) => {
  return format(new Date(date), 'EEEE, MMM dd, yyyy \'at\' h:mm a');
};

export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isExpired = (date) => {
  return isPast(new Date(date));
};

export const isComing = (date) => {
  return isFuture(new Date(date));
};

export const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    claimed: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800',
    cancelled: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getFoodTypeIcon = (foodType) => {
  const icons = {
    vegetarian: '🥗',
    'non-vegetarian': '🍗',
    vegan: '🌱',
    mixed: '🍱',
  };
  return icons[foodType] || '🍽️';
};

export const getCategoryLabel = (category) => {
  const labels = {
    'cooked-food': 'Cooked Food',
    'raw-food': 'Raw Food',
    'packaged-food': 'Packaged Food',
    'fruits-vegetables': 'Fruits & Vegetables',
    bakery: 'Bakery',
    other: 'Other',
  };
  return labels[category] || category;
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(1);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return re.test(phone);
};
