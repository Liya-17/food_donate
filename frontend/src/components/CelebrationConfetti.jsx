import { useEffect, useState } from 'react';

const CelebrationConfetti = ({ show, onComplete }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (show) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.5,
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 5)],
        size: Math.random() * 10 + 5
      }));

      setConfetti(particles);

      // Clean up after animation
      const timeout = setTimeout(() => {
        setConfetti([]);
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  if (!show || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle absolute"
          style={{
            left: `${particle.left}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.backgroundColor,
            animationDelay: `${particle.animationDelay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-particle {
          animation: confetti-fall 3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default CelebrationConfetti;
