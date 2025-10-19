import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Share Food, Share Love',
      description: 'Help reduce food waste by donating surplus food to those in need.',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Location-Based',
      description: 'Find donations near you or donors nearby looking for receivers.',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Real-Time Updates',
      description: 'Get instant notifications when new donations are available.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Safe & Secure',
      description: 'Verified users and secure platform for peace of mind.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Meals Shared' },
    { value: '500+', label: 'Active Donors' },
    { value: '100+', label: 'NGOs Connected' },
    { value: '50+', label: 'Cities Covered' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 md:py-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full mix-blend-overlay animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 animate-fade-in-down leading-tight">
            Share Food, <span className="text-primary-200">Fight Hunger</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-50 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{animationDelay: '0.2s'}}>
            Connect food donors with receivers in your community. Together, we can reduce food
            waste and help those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link to="/register" className="px-10 py-5 bg-white text-primary-700 rounded-2xl font-bold hover:bg-primary-50 transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl hover:scale-110 transform">
              Get Started Free
            </Link>
            <Link to="/donations" className="px-10 py-5 border-3 border-white bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-white hover:text-primary-700 transition-all duration-300 text-lg shadow-2xl hover:shadow-3xl hover:scale-110 transform">
              Browse Donations
            </Link>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-3">{stat.value}</div>
                <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-5">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple, fast, and effective food donation platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white border-2 border-gray-200 rounded-2xl p-8 text-center hover:border-primary-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Donate Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-5">Start Donating in 3 Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands making a difference in their communities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="relative group bg-white rounded-2xl p-10 text-center shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-primary-700 transition-colors">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">Create your free account as a donor or receiver</p>
            </div>

            <div className="relative group bg-white rounded-2xl p-10 text-center shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-700 transition-colors">Post or Browse</h3>
              <p className="text-gray-600 leading-relaxed">Post food donations or browse available donations nearby</p>
            </div>

            <div className="relative group bg-white rounded-2xl p-10 text-center shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-200">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-700 transition-colors">Connect & Share</h3>
              <p className="text-gray-600 leading-relaxed">Connect with donors/receivers and coordinate pickup</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full mix-blend-overlay animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-white rounded-full mix-blend-overlay animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">Ready to Make a Difference?</h2>
          <p className="text-2xl mb-10 text-primary-50 max-w-3xl mx-auto leading-relaxed">
            Join our community of food donors and receivers today. Every meal shared makes a difference.
          </p>
          <Link to="/register" className="inline-block px-12 py-5 bg-white text-primary-700 rounded-2xl font-bold hover:bg-primary-50 transition-all duration-300 text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110">
            Join Now - It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary-600" fill="currentColor" />
              <div className="absolute inset-0 bg-primary-600 rounded-full blur-lg opacity-50"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">FoodShare</span>
          </div>
          <p className="mb-6 text-lg">Together, we can end food waste and hunger.</p>
          <p className="text-sm text-gray-500">&copy; 2024 FoodShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
