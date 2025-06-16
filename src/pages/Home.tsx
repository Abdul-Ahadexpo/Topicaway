import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { getGiveaways, getGiveawayEntries } from '../services/firebase';
import { Giveaway } from '../types';

const Home: React.FC = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [entryCounts, setEntryCounts] = useState<{ [key: string]: number }>({});
  const [participantNames, setParticipantNames] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const giveawayData = await getGiveaways();
        setGiveaways(giveawayData);

        // Fetch entry counts and participant names for each giveaway
        const counts: { [key: string]: number } = {};
        const names: { [key: string]: string[] } = {};

        for (const giveaway of giveawayData) {
          const entries = await getGiveawayEntries(giveaway.id);
          counts[giveaway.id] = entries.length;
          names[giveaway.id] = entries.map(entry => entry.name);
        }

        setEntryCounts(counts);
        setParticipantNames(names);
      } catch (error) {
        console.error('Error fetching giveaways:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isGiveawayActive = (giveaway: Giveaway): boolean => {
    const now = new Date();
    const endDate = new Date(giveaway.endDate);
    const entryCount = entryCounts[giveaway.id] || 0;
    
    return giveaway.isActive && now < endDate && entryCount < giveaway.maxParticipants;
  };

  const getGiveawayStatus = (giveaway: Giveaway): string => {
    const now = new Date();
    const endDate = new Date(giveaway.endDate);
    const entryCount = entryCounts[giveaway.id] || 0;

    if (!giveaway.isActive) return 'Deactivated';
    if (now >= endDate) return 'Time Expired';
    if (entryCount >= giveaway.maxParticipants) return 'Max Entries Reached';
    return 'Active';
  };

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
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          🎁 Amazing <span className="text-blue-600">Giveaways</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our exciting giveaways and win incredible prizes! Browse active contests below and enter for your chance to win.
        </p>
      </div>

      {/* Giveaways Grid */}
      {giveaways.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Giveaways Yet</h2>
          <p className="text-gray-500">Stay tuned for exciting giveaways coming soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giveaways.map((giveaway) => {
            const isActive = isGiveawayActive(giveaway);
            const status = getGiveawayStatus(giveaway);
            const entryCount = entryCounts[giveaway.id] || 0;
            const names = participantNames[giveaway.id] || [];

            const CardContent = () => (
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full ${
                isActive ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-75'
              }`}>
                {/* Status Badge */}
                <div className="relative">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          {status}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {giveaway.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {giveaway.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{entryCount} / {giveaway.maxParticipants} entries</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Ends: {new Date(giveaway.endDate).toLocaleDateString()}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(entryCount / giveaway.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="mt-6">
                    {isActive ? (
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-blue-800 font-medium text-sm mb-2">Ready to enter? Click to join!</p>
                        <div className="text-blue-600 font-semibold">Enter Giveaway →</div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-600 font-medium text-sm text-center mb-3">
                          This giveaway has ended. Stay tuned for the next one! 🎉
                        </p>
                        
                        {names.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Participants:</h4>
                            <div className="max-h-20 overflow-y-auto">
                              <div className="flex flex-wrap gap-1">
                                {names.map((name, index) => (
                                  <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700">
                                    {name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
        </div>
      )}
    </div>
  );
};

export default Home;