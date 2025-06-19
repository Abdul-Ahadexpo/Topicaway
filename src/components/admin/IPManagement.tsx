import React, { useState, useEffect } from 'react';
import { Shield, Trash2, AlertTriangle, Clock, Globe, Ban } from 'lucide-react';
import { getIPRestrictions, removeIPRestriction, blockIPAddress } from '../../services/firebase';
import { IPRestriction } from '../../types';

interface IPManagementProps {
  onUpdate: () => void;
}

const IPManagement: React.FC<IPManagementProps> = ({ onUpdate }) => {
  const [restrictions, setRestrictions] = useState<IPRestriction[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockingIP, setBlockingIP] = useState<string>('');
  const [newBlockIP, setNewBlockIP] = useState('');

  useEffect(() => {
    fetchRestrictions();
  }, []);

  const fetchRestrictions = async () => {
    try {
      const data = await getIPRestrictions();
      setRestrictions(data);
    } catch (error) {
      console.error('Error fetching IP restrictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRestriction = async (restrictionId: string, ipAddress: string) => {
    if (window.confirm(`Are you sure you want to remove restrictions for IP ${ipAddress}? This will allow them to enter giveaways again.`)) {
      try {
        await removeIPRestriction(restrictionId);
        await fetchRestrictions();
        onUpdate();
      } catch (error) {
        console.error('Error removing restriction:', error);
        alert('Error removing restriction. Please try again.');
      }
    }
  };

  const handleBlockIP = async () => {
    if (!newBlockIP.trim()) return;
    
    if (window.confirm(`Are you sure you want to block IP address ${newBlockIP}? This will prevent them from entering any giveaways.`)) {
      setBlockingIP(newBlockIP);
      try {
        await blockIPAddress(newBlockIP.trim());
        setNewBlockIP('');
        await fetchRestrictions();
        onUpdate();
      } catch (error) {
        console.error('Error blocking IP:', error);
        alert('Error blocking IP address. Please try again.');
      } finally {
        setBlockingIP('');
      }
    }
  };

  const getDaysRemaining = (lastEntryDate: string): number => {
    const now = new Date();
    const lastEntry = new Date(lastEntryDate);
    const daysSince = (now.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 4 - daysSince);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">IP Address Management</h3>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">IP Address Management</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage IP restrictions and blocked addresses
        </p>
      </div>
      
      <div className="p-6">
        {/* Block New IP Section */}
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Ban className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Block IP Address</h4>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newBlockIP}
              onChange={(e) => setNewBlockIP(e.target.value)}
              placeholder="Enter IP address to block (e.g., 192.168.1.1)"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleBlockIP}
              disabled={!newBlockIP.trim() || blockingIP === newBlockIP}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {blockingIP === newBlockIP ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              Block IP
            </button>
          </div>
        </div>

        {/* IP Restrictions List */}
        {restrictions.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No IP restrictions found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              IP addresses will appear here when users enter giveaways or are blocked
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    IP Restriction Rules
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Users can only enter each giveaway once</li>
                    <li>• 4-day cooldown between entering different giveaways</li>
                    <li>• Blocked IPs cannot enter any giveaways</li>
                    <li>• Remove restrictions to allow users to participate again</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Entry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cooldown
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {restrictions.map((restriction) => {
                    const daysRemaining = getDaysRemaining(restriction.lastEntryDate);
                    const isBlocked = restriction.isBlocked;
                    const isInCooldown = daysRemaining > 0 && !isBlocked;
                    
                    return (
                      <tr key={restriction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {restriction.ipAddress}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isBlocked 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : isInCooldown
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {isBlocked ? 'Blocked' : isInCooldown ? 'In Cooldown' : 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {restriction.giveawayId === 'admin-block' ? (
                            <span className="text-red-600 dark:text-red-400">Admin Blocked</span>
                          ) : (
                            new Date(restriction.lastEntryDate).toLocaleDateString()
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {isBlocked ? (
                            <span className="text-red-600 dark:text-red-400">Permanently blocked</span>
                          ) : isInCooldown ? (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {Math.ceil(daysRemaining)} day(s) remaining
                            </div>
                          ) : (
                            <span className="text-green-600 dark:text-green-400">Can enter</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveRestriction(restriction.id, restriction.ipAddress)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                            title="Remove Restriction"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPManagement;