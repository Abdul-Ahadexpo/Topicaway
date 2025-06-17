import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWinners } from '../services/firebase';
import { Winner } from '../types';
import AnimatedBackground from '../components/ui/AnimatedBackground';

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
        <AnimatedBackground />
        <motion.div 
          className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Trophy className="h-10 w-10 text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          🏆 <span className="text-yellow-600">Winners</span> Gallery
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Congratulations to all our amazing winners! See who's won incredible prizes in our giveaways.
        </p>
      </motion.div>

      {/* Winners Grid */}
      {winners.length === 0 ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Winners Yet</h2>
          <p className="text-gray-500">Winners will be displayed here once giveaways conclude!</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {winners.map((winner, index) => (
              <motion.div 
                key={winner.id} 
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Winner Image */}
                <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-orange-500 overflow-hidden">
                  {winner.imageUrl ? (
                    <motion.img
                      src={winner.imageUrl}
                      alt={`Winner: ${winner.name}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="h-16 w-16 text-white" />
                    </div>
                  )}
                  
                  {/* Trophy Badge */}
                  <motion.div 
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  >
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </motion.div>

                  {/* Sparkle Effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Winner Info */}
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
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
                  <motion.div 
                    className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-yellow-800 font-medium text-sm">🎉 Congratulations! 🎉</span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Call to Action */}
      {winners.length > 0 && (
        <motion.div 
          className="mt-16 text-center bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to be our next winner?
            </h2>
            <p className="text-lg mb-6 text-blue-100">
              Check out our active giveaways and enter for your chance to win amazing prizes!
            </p>
            <motion.a
              href="/"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Active Giveaways
              <Trophy className="h-5 w-5 ml-2" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Winners;