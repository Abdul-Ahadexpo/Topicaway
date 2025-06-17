import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGiveaways } from '../services/firebase';
import { Giveaway } from '../types';
import CountdownTimer from '../components/ui/CountdownTimer';
import ParticipantCounter from '../components/ui/ParticipantCounter';
import ShareButton from '../components/ui/ShareButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const Home: React.FC = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [participantNames, setParticipantNames] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [expiredGiveaways, setExpiredGiveaways] = useState<Set<string>>(new Set());
  const [fullGiveaways, setFullGiveaways] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  const sharedGiveawayId = searchParams.get('giveaway');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const giveawayData = await getGiveaways();
        setGiveaways(giveawayData);

        // If there's a shared giveaway, filter to show only that one
        if (sharedGiveawayId) {
          const sharedGiveaway = giveawayData.find(g => g.id === sharedGiveawayId);
          if (sharedGiveaway) {
            setGiveaways([sharedGiveaway]);
          }
        }
      } catch (error) {
        console.error('Error fetching giveaways:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sharedGiveawayId]);

  const handleGiveawayExpire = (giveawayId: string) => {
    setExpiredGiveaways(prev => new Set([...prev, giveawayId]));
  };

  const handleLimitReached = (giveawayId: string) => {
    setFullGiveaways(prev => new Set([...prev, giveawayId]));
  };

  const isGiveawayActive = (giveaway: Giveaway): boolean => {
    const now = new Date();
    const endDate = new Date(giveaway.endDate);
    
    return giveaway.isActive && 
           now < endDate && 
           !expiredGiveaways.has(giveaway.id) && 
           !fullGiveaways.has(giveaway.id);
  };

  const getGiveawayStatus = (giveaway: Giveaway): string => {
    const now = new Date();
    const endDate = new Date(giveaway.endDate);

    if (!giveaway.isActive) return 'Deactivated';
    if (expiredGiveaways.has(giveaway.id) || now >= endDate) return 'Time Expired';
    if (fullGiveaways.has(giveaway.id)) return 'Max Entries Reached';
    return 'Active';
  };

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
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          🎁 Amazing <span className="text-blue-600">Giveaways</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {sharedGiveawayId 
            ? "You've been invited to join this exclusive giveaway!" 
            : "Join our exciting giveaways and win incredible prizes! Browse active contests below and enter for your chance to win."
          }
        </p>
        
        {sharedGiveawayId && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← View all giveaways
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Giveaways Grid */}
      {giveaways.length === 0 ? (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {sharedGiveawayId ? 'Giveaway Not Found' : 'No Giveaways Yet'}
          </h2>
          <p className="text-gray-500">
            {sharedGiveawayId 
              ? 'The giveaway you\'re looking for might have ended or been removed.' 
              : 'Stay tuned for exciting giveaways coming soon!'
            }
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {giveaways.map((giveaway, index) => {
              const isActive = isGiveawayActive(giveaway);
              const status = getGiveawayStatus(giveaway);
              const names = participantNames[giveaway.id] || [];

              const CardContent = () => (
                <motion.div 
                  className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full relative ${
                    isActive ? 'hover:shadow-2xl hover:-translate-y-2 cursor-pointer' : 'opacity-90'
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={isActive ? { scale: 1.02 } : {}}
                  whileTap={isActive ? { scale: 0.98 } : {}}
                >
                  {/* Status Badge & Share Button */}
                  <div className="relative">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <ShareButton 
                        giveawayId={giveaway.id} 
                        title={giveaway.title}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <motion.span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <div className="h-3 w-3 mr-1 rounded-full bg-red-500" />
                            {status}
                          </>
                        )}
                      </motion.span>
                    </div>
                  </div>

                  <div className="p-6 group">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {giveaway.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {giveaway.description}
                    </p>

                    <div className="space-y-3">
                      {/* Participant Counter */}
                      <ParticipantCounter
                        giveawayId={giveaway.id}
                        maxParticipants={giveaway.maxParticipants}
                        onLimitReached={() => handleLimitReached(giveaway.id)}
                      />
                      
                      {/* Countdown Timer */}
                      {isActive && (
                        <CountdownTimer
                          endDate={giveaway.endDate}
                          onExpire={() => handleGiveawayExpire(giveaway.id)}
                        />
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Ends: {new Date(giveaway.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Section */}
                    <motion.div 
                      className="mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {isActive ? (
                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 text-center border border-blue-100">
                          <p className="text-blue-800 font-medium text-sm mb-2">Ready to enter? Click to join!</p>
                          <div className="text-blue-600 font-semibold flex items-center justify-center">
                            Enter Giveaway 
                            <motion.span
                              className="ml-1"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-gray-600 font-medium text-sm text-center mb-3">
                            This giveaway has ended. Stay tuned for the next one! 🎉
                          </p>
                          
                          {names.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Participants:</h4>
                              <div className="max-h-20 overflow-y-auto">
                                <div className="flex flex-wrap gap-1">
                                  {names.map((name, nameIndex) => (
                                    <motion.span 
                                      key={nameIndex} 
                                      className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.6 + nameIndex * 0.05 }}
                                    >
                                      {name}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* Share Button - Always visible on hover */}
                    <div className="absolute top-16 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <ShareButton 
                        giveawayId={giveaway.id} 
                        title={giveaway.title}
                      />
                    </div>
                  </div>
                </motion.div>
              );

              return isActive ? (
                <Link key={giveaway.id} to={`/giveaway/${giveaway.id}`}>
                  <CardContent />
                </Link>
              ) : (
                <div key={giveaway.id}>
                  <CardContent />
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Home;