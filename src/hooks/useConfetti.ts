import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = useCallback(() => {
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    });

    // Second burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B']
      });
    }, 200);

    // Third burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#EF4444', '#8B5CF6', '#F59E0B']
      });
    }, 400);
  }, []);

  return { triggerConfetti };
};