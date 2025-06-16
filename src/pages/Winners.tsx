import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Award } from 'lucide-react';
import { getWinners } from '../services/firebase';
import { Winner } from '../types';

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const winnerData = await getWinners();
        setWinners(winnerData);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          🏆 <span className="text-yellow-600">Winners</span> Gallery
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Congratulations to all our amazing winners! See who's won incredible prizes in our giveaways.
        </p>
      </div>

      {/* Winners Grid */}
      {winners.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Winners Yet</h2>
          <p className="text-gray-500">Winners will be displayed here once giveaways conclude!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {winners.map((winner) => (
            <div key={winner.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Winner Image */}
              <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-orange-500">
                {winner.imageUrl ? (
                  <img
                    src={winner.imageUrl}
                    alt={`Winner: ${winner.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                )}
                
                {/* Trophy Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>

              {/* Winner Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {winner.name}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{winner.giveawayTitle}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span>Won on {new Date(winner.dateWon).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Celebration Badge */}
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <span className="text-yellow-800 font-medium text-sm">🎉 Congratulations! 🎉</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {winners.length > 0 && (
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Want to be our next winner?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Check out our active giveaways and enter for your chance to win amazing prizes!
          </p>
          <a
            href="/"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Active Giveaways
            <Trophy className="h-5 w-5 ml-2" />
          </a>
        </div>
      )}
    </div>
  );
};

export default Winners;