import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchingAPI } from '../services/api';
import { Sparkles, TrendingUp, MapPin, Clock, Users, Target, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SmartMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadSmartMatches();
    loadMatchingStats();
  }, []);

  const loadSmartMatches = async () => {
    try {
      setLoading(true);
      const response = await matchingAPI.getSmartMatches(15);
      setMatches(response.data.data);
    } catch (error) {
      console.error('Error loading smart matches:', error);
      toast.error('Failed to load smart matches');
    } finally {
      setLoading(false);
    }
  };

  const loadMatchingStats = async () => {
    try {
      const response = await matchingAPI.getMatchingStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 55) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getMatchBadge = (level) => {
    const badges = {
      perfect: { icon: '🎯', text: 'Perfect Match', color: 'bg-green-100 text-green-800' },
      excellent: { icon: '⭐', text: 'Excellent', color: 'bg-blue-100 text-blue-800' },
      good: { icon: '👍', text: 'Good Match', color: 'bg-yellow-100 text-yellow-800' },
      fair: { icon: '✓', text: 'Fair Match', color: 'bg-gray-100 text-gray-800' }
    };
    return badges[level] || badges.fair;
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  if (user?.role !== 'receiver') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">Smart Matches are only available for receivers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Smart Matches</h1>
        </div>
        <p className="text-gray-600">
          AI-powered recommendations tailored to your preferences
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMatches || 0}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful Claims</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulClaims || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageMatchScore || 0}%</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <Link to="/preferences" className="block hover:bg-gray-50 transition-colors rounded">
              <p className="text-sm text-gray-600">Preferences</p>
              <p className="text-lg font-semibold text-primary-600 flex items-center gap-1">
                Customize <ChevronRight className="h-4 w-4" />
              </p>
            </Link>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
        </div>
      )}

      {/* Matches List */}
      {!loading && matches.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your preferences to find more donations
          </p>
          <Link to="/preferences" className="btn-primary inline-block">
            Update Preferences
          </Link>
        </div>
      )}

      {!loading && matches.length > 0 && (
        <div className="space-y-4">
          {matches.map((match) => {
            const badge = getMatchBadge(match.recommendationLevel);
            const donation = match.donation;

            return (
              <div
                key={donation._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                          {badge.icon} {badge.text}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMatchColor(match.matchPercentage)}`}>
                          {match.matchPercentage}% Match
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {donation.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">{donation.description}</p>
                    </div>
                    {donation.images && donation.images.length > 0 && (
                      <img
                        src={donation.images[0]}
                        alt={donation.title}
                        className="w-24 h-24 object-cover rounded-lg ml-4"
                      />
                    )}
                  </div>

                  {/* Donation Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{formatDistance(match.matchBreakdown.distance)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{donation.servings} servings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className={donation.isUrgent ? 'text-red-600 font-medium' : ''}>
                        {donation.isUrgent ? 'Urgent!' : 'Available'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {donation.foodType}
                      </span>
                    </div>
                  </div>

                  {/* Match Breakdown */}
                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-600">Dietary: </span>
                        <span className="font-medium">{match.matchBreakdown.dietaryMatch}/30</span>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-600">Category: </span>
                        <span className="font-medium">{match.matchBreakdown.categoryMatch}/20</span>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-600">Distance: </span>
                        <span className="font-medium">{match.matchBreakdown.distanceScore}/25</span>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <span className="text-gray-600">Urgency: </span>
                        <span className="font-medium">{match.matchBreakdown.urgencyScore}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Donor Info */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={donation.donor?.avatar || '/default-avatar.jpg'}
                        alt={donation.donor?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{donation.donor?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{donation.donor?.organizationType}</p>
                      </div>
                    </div>
                    <Link
                      to={`/donations/${donation._id}`}
                      className="btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartMatches;
