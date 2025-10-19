import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { TrendingUp, Bell, CheckCircle, X, Sparkles } from 'lucide-react';
import { timeAgo } from '../utils/helpers';
import CelebrationConfetti from './CelebrationConfetti';

const LiveImpactTracker = () => {
  const { socket } = useSocket();
  const [recentCompletions, setRecentCompletions] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [latestCompletion, setLatestCompletion] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for donation completions
    const handleDonationCompleted = (data) => {
      console.log('Donation completed:', data);

      // Add to recent completions
      setRecentCompletions(prev => [data, ...prev].slice(0, 5));

      // Show notification and confetti
      setLatestCompletion(data);
      setShowNotification(true);
      setShowConfetti(true);

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    socket.on('donation_completed', handleDonationCompleted);

    return () => {
      socket.off('donation_completed', handleDonationCompleted);
    };
  }, [socket]);

  if (recentCompletions.length === 0 && !showNotification) {
    return null;
  }

  return (
    <>
      {/* Celebration Confetti */}
      <CelebrationConfetti
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Live Notification Popup */}
      {showNotification && latestCompletion && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="bg-white rounded-xl shadow-2xl p-4 max-w-sm border-2 border-green-200 relative overflow-hidden">
            {/* Sparkle effect overlay */}
            <div className="absolute top-0 right-0 text-yellow-400 animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center animate-bounce">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900">
                    🎉 New Success Story!
                  </p>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 font-medium line-clamp-1">
                  {latestCompletion.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {latestCompletion.servings} servings • Just now
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Completions List */}
      {recentCompletions.length > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-pulse">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Live Impact Updates</h3>
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>

          <div className="space-y-2">
            {recentCompletions.map((completion, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 animate-fade-in"
              >
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {completion.title}
                  </p>
                  <p className="text-xs text-green-100">
                    {completion.servings} servings • {timeAgo(completion.completedAt || new Date())}
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 text-green-200" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default LiveImpactTracker;
