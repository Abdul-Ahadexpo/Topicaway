import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getGiveawayEntries } from '../../services/firebase';

interface ParticipantCounterProps {
  giveawayId: string;
  maxParticipants: number;
  onLimitReached?: () => void;
  className?: string;
}

const ParticipantCounter: React.FC<ParticipantCounterProps> = ({ 
  giveawayId, 
  maxParticipants, 
  onLimitReached,
  className = '' 
}) => {
  const [currentCount, setCurrentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const entries = await getGiveawayEntries(giveawayId);
        const newCount = entries.length;
        setCurrentCount(newCount);
        
        if (newCount >= maxParticipants && onLimitReached) {
          onLimitReached();
        }
      } catch (error) {
        console.error('Error fetching participant count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
    
    // Poll for updates every 30 seconds for real-time feel
    const interval = setInterval(fetchCount, 30000);
    
    return () => clearInterval(interval);
  }, [giveawayId, maxParticipants, onLimitReached]);

  const percentage = (currentCount / maxParticipants) * 100;
  const isNearFull = percentage >= 80;
  const isFull = currentCount >= maxParticipants;

  if (loading) {
    return (
      <div className={`flex items-center text-gray-500 text-sm ${className}`}>
        <Users className="h-4 w-4 mr-1" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center text-sm">
        <Users className="h-4 w-4 mr-1" />
        <span className={`font-medium ${isFull ? 'text-red-600' : isNearFull ? 'text-orange-600' : 'text-gray-600'}`}>
          {currentCount} / {maxParticipants} joined
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            isFull ? 'bg-red-500' : isNearFull ? 'bg-orange-500' : 'bg-gradient-to-r from-blue-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {isFull && (
        <div className="text-xs text-red-600 font-medium">
          🚫 Maximum entries reached
        </div>
      )}
    </div>
  );
};

export default ParticipantCounter;