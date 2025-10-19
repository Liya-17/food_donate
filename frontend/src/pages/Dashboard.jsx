import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, donationAPI } from '../services/api';
import { Heart, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import QuickStats from '../components/QuickStats';
import ImpactCalculator from '../components/ImpactCalculator';
import ExportData from '../components/ExportData';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myDonations, setMyDonations] = useState([]);

  useEffect(() => {
    loadStats();
    if (user?._id) {
      loadMyDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const loadStats = async () => {
    try {
      const response = await userAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyDonations = async () => {
    try {
      // Use the existing getMyDonations API which should return ALL donations for the current user
      // This is more efficient than making multiple API calls
      const response = await donationAPI.getMyDonations();
      const myDonations = response.data.data || [];

      setMyDonations(myDonations);
    } catch (error) {
      console.error('Failed to load my donations:', error);
      setMyDonations([]);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in-down">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">Here&apos;s your activity overview and impact</p>
        </div>

        {/* Quick Stats Widget */}
        <div className="mb-10 animate-fade-in-up">
          <QuickStats stats={stats} recentDonation={stats?.recentActivity?.[0]} donations={myDonations} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-glow transition-all duration-300 animate-fade-in-up overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Heart className="h-12 w-12 opacity-90" />
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">All Time</span>
              </div>
              <p className="text-sm font-medium mb-1 opacity-90">Total Donations</p>
              <p className="text-4xl font-bold">
                {stats?.donationsGiven?.total || 0}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 animate-fade-in-up overflow-hidden" style={{animationDelay: '0.1s'}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-12 w-12 opacity-90" />
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Active</span>
              </div>
              <p className="text-sm font-medium mb-1 opacity-90">Active Donations</p>
              <p className="text-4xl font-bold">
                {stats?.donationsGiven?.active || 0}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 animate-fade-in-up overflow-hidden" style={{animationDelay: '0.2s'}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-12 w-12 opacity-90" />
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Received</span>
              </div>
              <p className="text-sm font-medium mb-1 opacity-90">Donations Received</p>
              <p className="text-4xl font-bold">
                {stats?.donationsReceived?.total || 0}
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 animate-fade-in-up overflow-hidden" style={{animationDelay: '0.3s'}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="h-12 w-12 opacity-90" />
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Success</span>
              </div>
              <p className="text-sm font-medium mb-1 opacity-90">Completed</p>
              <p className="text-4xl font-bold">
                {stats?.donationsGiven?.completed || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-10 border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Quick Actions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/create-donation"
              className="group relative p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-2xl text-center hover:border-primary-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-gray-900 text-lg mb-1">Create Donation</p>
              <p className="text-sm text-gray-600">Share food with those in need</p>
            </Link>

            <Link
              to="/donations"
              className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl text-center hover:border-blue-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-gray-900 text-lg mb-1">Browse Donations</p>
              <p className="text-sm text-gray-600">Find available food near you</p>
            </Link>

            <Link
              to="/my-donations"
              className="group relative p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl text-center hover:border-green-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-gray-900 text-lg mb-1">My Donations</p>
              <p className="text-sm text-gray-600">Track your donation history</p>
            </Link>
          </div>
        </div>

        {/* Impact Calculator & Export Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <ImpactCalculator donations={myDonations} />
          <ExportData donations={myDonations} user={user} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Recent Activity</span>
          </h2>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={activity._id}
                  className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{activity.title}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">{activity.status}</span>
                        <span>•</span>
                        <span>{activity.servings} servings</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/donations/${activity._id}`}
                    className="px-5 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No recent activity</p>
              <p className="text-sm text-gray-500 mt-2">Your donation activity will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
