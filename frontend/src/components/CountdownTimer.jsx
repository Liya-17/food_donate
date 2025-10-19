import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const CountdownTimer = ({ expiryTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }

      // Check if less than 2 hours remaining
      setIsUrgent(difference < 2 * 60 * 60 * 1000);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  const getColorClasses = () => {
    if (isExpired) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (isUrgent) {
      return 'bg-orange-100 text-orange-800 border-orange-300 animate-pulse';
    }
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${getColorClasses()} transition-all duration-300`}>
      {isExpired ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Clock className={`h-5 w-5 ${isUrgent ? 'animate-spin' : ''}`} />
      )}
      <span className="text-sm">
        {isExpired ? 'Expired' : `Expires in: ${timeLeft}`}
      </span>
    </div>
  );
};

export default CountdownTimer;
