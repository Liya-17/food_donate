import { Calendar, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatDate, timeAgo } from '../utils/helpers';

const QuickStats = ({ stats, recentDonation, donations = [] }) => {
  const calculateStreak = () => {
    // Simple streak calculation - days since last donation
    if (!recentDonation) return 0;
    const daysSince = Math.floor(
      (new Date() - new Date(recentDonation.createdAt)) / (1000 * 60 * 60 * 24)
    );
    return daysSince <= 7 ? Math.floor(daysSince / 7) + 1 : 0;
  };

  const getAchievementLevel = () => {
    const total = stats?.donationsGiven?.total || 0;
    if (total >= 50) return { level: 'Legend', icon: '🏆', color: 'text-yellow-600' };
    if (total >= 25) return { level: 'Hero', icon: '⭐', color: 'text-purple-600' };
    if (total >= 10) return { level: 'Champion', icon: '🎖️', color: 'text-blue-600' };
    if (total >= 5) return { level: 'Helper', icon: '🌟', color: 'text-green-600' };
    return { level: 'Beginner', icon: '🌱', color: 'text-gray-600' };
  };

  // Calculate donations this month from actual donations data
  const calculateThisMonth = () => {
    if (!donations || donations.length === 0) return 0;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return donations.filter(d => {
      const createdAt = new Date(d.createdAt);
      return createdAt >= firstDayOfMonth;
    }).length;
  };

  // Calculate completion rate from actual donations data
  const calculateCompletionRate = () => {
    if (!donations || donations.length === 0) return 0;

    const completedCount = donations.filter(d => d.status === 'completed').length;
    return Math.round((completedCount / donations.length) * 100);
  };

  const streak = calculateStreak();
  const achievement = getAchievementLevel();
  const thisMonth = calculateThisMonth();
  const completionRate = calculateCompletionRate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Weekly Streak */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <Calendar className="h-8 w-8 opacity-90" />
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Week
          </span>
        </div>
        <p className="text-3xl font-extrabold mb-1">{streak}</p>
        <p className="text-sm font-medium opacity-90">Week Streak 🔥</p>
      </div>

      {/* Achievement Level */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-4xl">{achievement.icon}</span>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Level
          </span>
        </div>
        <p className="text-2xl font-extrabold mb-1">{achievement.level}</p>
        <p className="text-sm font-medium opacity-90">Achievement Status</p>
      </div>

      {/* This Month */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <TrendingUp className="h-8 w-8 opacity-90" />
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Month
          </span>
        </div>
        <p className="text-3xl font-extrabold mb-1">
          {thisMonth}
        </p>
        <p className="text-sm font-medium opacity-90">Donations This Month</p>
      </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <CheckCircle2 className="h-8 w-8 opacity-90" />
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
            Rate
          </span>
        </div>
        <p className="text-3xl font-extrabold mb-1">
          {completionRate}%
        </p>
        <p className="text-sm font-medium opacity-90">Completion Rate</p>
      </div>

      {/* Last Activity */}
      {recentDonation && (
        <div className="md:col-span-2 lg:col-span-4 bg-white rounded-2xl p-5 shadow-soft border-2 border-gray-100 hover:border-primary-200 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600">Last Activity</p>
              <p className="text-lg font-bold text-gray-900">{recentDonation.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {formatDate(recentDonation.createdAt)}
              </p>
              <p className="text-sm font-semibold text-primary-600">
                {timeAgo(recentDonation.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStats;
