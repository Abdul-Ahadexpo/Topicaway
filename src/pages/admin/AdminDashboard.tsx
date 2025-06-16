import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, Users, Trophy, Gift, Calendar, AlertCircle, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getGiveaways, getAllEntries, getWinners, deleteGiveaway, deleteWinner } from '../../services/firebase';
import { Giveaway, GiveawayEntry, Winner } from '../../types';
import CreateGiveaway from '../../components/admin/CreateGiveaway';
import CreateWinner from '../../components/admin/CreateWinner';
import ViewEntries from '../../components/admin/ViewEntries';
import EditGiveaway from '../../components/admin/EditGiveaway';
import EditWinner from '../../components/admin/EditWinner';

const AdminDashboard: React.FC = () => {
  const { isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'giveaways' | 'entries' | 'winners' | 'create-giveaway' | 'create-winner'>('overview');
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [allEntries, setAllEntries] = useState<{ [giveawayId: string]: GiveawayEntry[] }>({});
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGiveaway, setEditingGiveaway] = useState<Giveaway | null>(null);
  const [editingWinner, setEditingWinner] = useState<Winner | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [giveawayData, entriesData, winnersData] = await Promise.all([
          getGiveaways(),
          getAllEntries(),
          getWinners()
        ]);
        
        setGiveaways(giveawayData);
        setAllEntries(entriesData);
        setWinners(winnersData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdminAuthenticated) {
      fetchData();
    }
  }, [isAdminAuthenticated]);

  const handleDeleteGiveaway = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all entries for this giveaway. This action cannot be undone.`)) {
      try {
        await deleteGiveaway(id);
        setGiveaways(prev => prev.filter(g => g.id !== id));
        // Remove entries from state as well
        setAllEntries(prev => {
          const newEntries = { ...prev };
          delete newEntries[id];
          return newEntries;
        });
      } catch (error) {
        console.error('Error deleting giveaway:', error);
        alert('Error deleting giveaway. Please try again.');
      }
    }
  };

  const handleDeleteWinner = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete winner "${name}"? This action cannot be undone.`)) {
      try {
        await deleteWinner(id);
        setWinners(prev => prev.filter(w => w.id !== id));
      } catch (error) {
        console.error('Error deleting winner:', error);
        alert('Error deleting winner. Please try again.');
      }
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [giveawayData, entriesData, winnersData] = await Promise.all([
        getGiveaways(),
        getAllEntries(),
        getWinners()
      ]);
      
      setGiveaways(giveawayData);
      setAllEntries(entriesData);
      setWinners(winnersData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    setEditingGiveaway(null);
    setEditingWinner(null);
    refreshData();
  };

  if (!isAdminAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalEntries = Object.values(allEntries).reduce((sum, entries) => sum + entries.length, 0);
  const activeGiveaways = giveaways.filter(g => {
    const now = new Date();
    const endDate = new Date(g.endDate);
    const entryCount = allEntries[g.id]?.length || 0;
    return g.isActive && now < endDate && entryCount < g.maxParticipants;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage giveaways, view entries, and upload winners</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Gift },
              { id: 'giveaways', label: 'Giveaways', icon: Gift },
              { id: 'entries', label: 'Entries', icon: Users },
              { id: 'winners', label: 'Winners', icon: Trophy },
              { id: 'create-giveaway', label: 'Create Giveaway', icon: Plus },
              { id: 'create-winner', label: 'Add Winner', icon: Trophy }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Gift className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Giveaways</p>
                    <p className="text-2xl font-semibold text-gray-900">{giveaways.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Gift className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Giveaways</p>
                    <p className="text-2xl font-semibold text-gray-900">{activeGiveaways}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Entries</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalEntries}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Winners</p>
                    <p className="text-2xl font-semibold text-gray-900">{winners.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Giveaways</h3>
              </div>
              <div className="p-6">
                {giveaways.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No giveaways created yet</p>
                ) : (
                  <div className="space-y-4">
                    {giveaways.slice(0, 5).map((giveaway) => {
                      const entryCount = allEntries[giveaway.id]?.length || 0;
                      const isActive = giveaway.isActive && new Date() < new Date(giveaway.endDate) && entryCount < giveaway.maxParticipants;
                      
                      return (
                        <div key={giveaway.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{giveaway.title}</h4>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Ends: {new Date(giveaway.endDate).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <Users className="h-4 w-4 mr-1" />
                              <span>{entryCount} / {giveaway.maxParticipants} entries</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isActive ? 'Active' : 'Ended'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'giveaways' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Giveaways</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your giveaways - edit, delete, or view details</p>
            </div>
            <div className="p-6">
              {giveaways.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No giveaways created yet</p>
                  <button
                    onClick={() => setActiveTab('create-giveaway')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Create Your First Giveaway
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giveaway
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entries
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {giveaways.map((giveaway) => {
                        const entryCount = allEntries[giveaway.id]?.length || 0;
                        const isActive = giveaway.isActive && new Date() < new Date(giveaway.endDate) && entryCount < giveaway.maxParticipants;
                        
                        return (
                          <tr key={giveaway.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{giveaway.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{giveaway.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entryCount} / {giveaway.maxParticipants}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(giveaway.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isActive ? 'Active' : 'Ended'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => setEditingGiveaway(giveaway)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Edit Giveaway"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab('entries');
                                }}
                                className="text-green-600 hover:text-green-900 mr-3"
                                title="View Entries"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGiveaway(giveaway.id, giveaway.title)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Giveaway"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'entries' && (
          <ViewEntries giveaways={giveaways} allEntries={allEntries} onEntriesUpdate={refreshData} />
        )}

        {activeTab === 'winners' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Winners</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your winners - edit, delete, or view details</p>
            </div>
            <div className="p-6">
              {winners.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No winners added yet</p>
                  <button
                    onClick={() => setActiveTab('create-winner')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Your First Winner
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {winners.map((winner) => (
                    <div key={winner.id} className="border border-gray-200 rounded-lg p-4 relative group">
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          onClick={() => setEditingWinner(winner)}
                          className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Edit Winner"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteWinner(winner.id, winner.name)}
                          className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          title="Delete Winner"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center mb-4">
                        {winner.imageUrl && (
                          <img
                            src={winner.imageUrl}
                            alt={winner.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{winner.name}</h4>
                          <p className="text-sm text-gray-500">{winner.giveawayTitle}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Won on: {new Date(winner.dateWon).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create-giveaway' && (
          <CreateGiveaway onSuccess={() => { refreshData(); setActiveTab('giveaways'); }} />
        )}

        {activeTab === 'create-winner' && (
          <CreateWinner giveaways={giveaways} onSuccess={() => { refreshData(); setActiveTab('winners'); }} />
        )}

        {/* Edit Modals */}
        {editingGiveaway && (
          <EditGiveaway
            giveaway={editingGiveaway}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingGiveaway(null)}
          />
        )}

        {editingWinner && (
          <EditWinner
            winner={editingWinner}
            giveaways={giveaways}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingWinner(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;