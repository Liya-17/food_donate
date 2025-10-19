import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Home, PlusCircle, Heart, Award, Sparkles } from 'lucide-react';
import { useState } from 'react';
import NotificationsPanel from './NotificationsPanel';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Heart className="h-10 w-10 text-primary-600 group-hover:text-primary-700 transition-all duration-300 transform group-hover:scale-110" fill="currentColor" />
                <div className="absolute inset-0 bg-primary-400 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">FoodShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/')
                  ? 'text-primary-700 bg-primary-50 font-semibold shadow-sm'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/donations"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/donations')
                  ? 'text-primary-700 bg-primary-50 font-semibold shadow-sm'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Donations</span>
            </Link>

            <Link
              to="/success-stories"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive('/success-stories')
                  ? 'text-primary-700 bg-primary-50 font-semibold shadow-sm'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <Award className="h-5 w-5" />
              <span>Stories</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Smart Matches for receivers */}
                {user?.role === 'receiver' && (
                  <Link
                    to="/smart-matches"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive('/smart-matches')
                        ? 'text-primary-700 bg-primary-50 font-semibold shadow-sm'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Smart Matches</span>
                  </Link>
                )}
                {/* Only show "Donate" button for donors and admins */}
                {(user?.role === 'donor' || user?.role === 'admin') && (
                  <Link
                    to="/create-donation"
                    className="ml-4 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center space-x-2 transform hover:scale-105"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Donate</span>
                  </Link>
                )}

                <div className="relative ml-2">
                  <NotificationsPanel />
                </div>

                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      Profile
                    </Link>
                    {/* Show "My Donations" only for donors and admins */}
                    {(user?.role === 'donor' || user?.role === 'admin') && (
                      <Link
                        to="/my-donations"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        My Donations
                      </Link>
                    )}
                    {/* Show "My Requests" only for receivers and admins */}
                    {(user?.role === 'receiver' || user?.role === 'admin') && (
                      <Link
                        to="/my-requests"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        My Claims
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link to="/login" className="px-5 py-2.5 text-gray-700 hover:text-primary-600 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/donations"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Donations
            </Link>
            <Link
              to="/success-stories"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stories
            </Link>
            {isAuthenticated ? (
              <>
                {/* Only show "Donate" link for donors and admins */}
                {(user?.role === 'donor' || user?.role === 'admin') && (
                  <Link
                    to="/create-donation"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Donate
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
