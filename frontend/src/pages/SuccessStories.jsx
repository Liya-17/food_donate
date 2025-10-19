import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, Users, Award, MapPin, Clock, CheckCircle } from 'lucide-react';
import { donationAPI } from '../services/api';
import { formatDate, getFoodTypeIcon, getCategoryLabel, timeAgo } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const SuccessStories = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalServings: 0,
    activeDonors: 0,
    activeReceivers: 0,
  });
  const [completedDonations, setCompletedDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await donationAPI.getDonations({ status: 'completed' });
      const donations = response.data.data;

      // Calculate real stats
      setStats({
        totalDonations: donations.length,
        totalServings: donations.reduce((sum, d) => sum + d.servings, 0),
        activeDonors: new Set(donations.map(d => d.donor?._id).filter(Boolean)).size,
        activeReceivers: new Set(donations.map(d => d.claimedBy?._id).filter(Boolean)).size,
      });

      // Sort by completion date (most recent first)
      const sortedDonations = donations.sort((a, b) =>
        new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt)
      );

      setCompletedDonations(sortedDonations);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
            Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real impact from our community. Every completed donation represents food saved and people helped.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white mb-4 mx-auto shadow-lg">
              <Heart className="h-8 w-8" />
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
              {stats.totalDonations}
            </p>
            <p className="text-gray-600 font-semibold">Completed Donations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-gray-100" style={{animationDelay: '0.1s'}}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white mb-4 mx-auto shadow-lg">
              <TrendingUp className="h-8 w-8" />
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              {stats.totalServings}
            </p>
            <p className="text-gray-600 font-semibold">People Fed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-gray-100" style={{animationDelay: '0.2s'}}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 text-white mb-4 mx-auto shadow-lg">
              <Users className="h-8 w-8" />
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
              {stats.activeDonors}
            </p>
            <p className="text-gray-600 font-semibold">Active Donors</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-gray-100" style={{animationDelay: '0.3s'}}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white mb-4 mx-auto shadow-lg">
              <Award className="h-8 w-8" />
            </div>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
              {stats.activeReceivers}
            </p>
            <p className="text-gray-600 font-semibold">Active Receivers</p>
          </div>
        </div>

        {/* Completed Donations */}
        {completedDonations.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Successful Donations</h2>
              <p className="text-gray-600">These donations have been successfully completed and made an impact</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedDonations.map((donation, index) => (
                <Link
                  key={donation._id}
                  to={`/donations/${donation._id}`}
                  className="group bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-green-200 hover:border-green-400 transform hover:-translate-y-2 animate-fade-in-up"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {/* Success Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </div>

                  {/* Image */}
                  {donation.images && donation.images.length > 0 ? (
                    <div className="relative overflow-hidden">
                      <img
                        src={donation.images[0]}
                        alt={donation.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <span className="text-5xl">{getFoodTypeIcon(donation.foodType)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden">
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                        {getFoodTypeIcon(donation.foodType)}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-1">
                      {donation.title}
                    </h3>

                    {/* Category */}
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      {getCategoryLabel(donation.category)}
                    </span>

                    {/* Donor & Receiver Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                          <Users className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Donated by:</span>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {donation.donor?.name || 'Anonymous'}
                          </p>
                        </div>
                      </div>

                      {donation.claimedBy && (
                        <div className="flex items-center text-sm">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <Heart className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Received by:</span>
                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {donation.claimedBy.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location & Servings */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3 pb-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="line-clamp-1">
                          {donation.pickupLocation?.address?.city || 'Location'}
                        </span>
                      </div>
                      <div className="flex items-center font-semibold text-green-600">
                        <Heart className="h-4 w-4 mr-1" />
                        {donation.servings} servings
                      </div>
                    </div>

                    {/* Completion Time */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Completed {timeAgo(donation.completedAt || donation.updatedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={Heart}
            title="No completed donations yet"
            description="Completed donations will appear here to showcase the impact of our community"
          />
        )}

        {/* Call to Action - Role-based */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-12 text-center text-white shadow-2xl animate-fade-in-up relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full mix-blend-overlay animate-pulse-slow"></div>
            <div className="absolute bottom-10 left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-4">Make Your Impact Today</h2>

            {!isAuthenticated ? (
              <>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join our community of donors and receivers. Every donation matters and creates real success stories.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="inline-block bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    Join as Donor
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block bg-primary-500 text-white border-2 border-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-400 transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
                  >
                    Join as Receiver
                  </Link>
                </div>
              </>
            ) : user?.role === 'donor' || user?.role === 'admin' ? (
              <>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Your donations make a difference! Create more donations to help those in need.
                </p>
                <Link
                  to="/create-donation"
                  className="inline-block bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Create New Donation
                </Link>
              </>
            ) : (
              <>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Browse available donations and help reduce food waste while feeding those in need.
                </p>
                <Link
                  to="/donations"
                  className="inline-block bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Browse Available Donations
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
