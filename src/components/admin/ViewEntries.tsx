import React, { useState } from 'react';
import { Users, Mail, MapPin, Calendar, Search, Trash2, AlertTriangle } from 'lucide-react';
import { Giveaway, GiveawayEntry } from '../../types';
import { deleteGiveawayEntry } from '../../services/firebase';

interface ViewEntriesProps {
  giveaways: Giveaway[];
  allEntries: { [giveawayId: string]: GiveawayEntry[] };
  onEntriesUpdate: () => void;
}

const ViewEntries: React.FC<ViewEntriesProps> = ({ giveaways, allEntries, onEntriesUpdate }) => {
  const [selectedGiveaway, setSelectedGiveaway] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingEntry, setDeletingEntry] = useState<string | null>(null);

  const handleDeleteEntry = async (giveawayId: string, entryId: string, participantName: string) => {
    if (window.confirm(`Are you sure you want to reject/delete the entry from "${participantName}"? This action cannot be undone.`)) {
      setDeletingEntry(entryId);
      try {
        await deleteGiveawayEntry(giveawayId, entryId);
        onEntriesUpdate();
      } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Error deleting entry. Please try again.');
      } finally {
        setDeletingEntry(null);
      }
    }
  };

  const getFilteredEntries = () => {
    let entries: (GiveawayEntry & { giveawayTitle?: string })[] = [];

    if (selectedGiveaway === 'all') {
      // Get all entries from all giveaways
      Object.keys(allEntries).forEach(giveawayId => {
        const giveaway = giveaways.find(g => g.id === giveawayId);
        const giveawayEntries = allEntries[giveawayId].map(entry => ({
          ...entry,
          giveawayTitle: giveaway?.title || 'Unknown Giveaway'
        }));
        entries.push(...giveawayEntries);
      });
    } else {
      // Get entries for selected giveaway
      const giveaway = giveaways.find(g => g.id === selectedGiveaway);
      if (giveaway && allEntries[selectedGiveaway]) {
        entries = allEntries[selectedGiveaway].map(entry => ({
          ...entry,
          giveawayTitle: giveaway.title
        }));
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      entries = entries.filter(entry =>
        entry.name.toLowerCase().includes(term) ||
        entry.email.toLowerCase().includes(term) ||
        (entry.giveawayTitle && entry.giveawayTitle.toLowerCase().includes(term))
      );
    }

    // Sort by submission date (newest first)
    return entries.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  };

  const filteredEntries = getFilteredEntries();
  const totalEntries = Object.values(allEntries).reduce((sum, entries) => sum + entries.length, 0);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Giveaway Entries</h3>
        <p className="text-sm text-gray-600 mt-1">View and manage all giveaway submissions</p>
      </div>
      
      <div className="p-6">
        {totalEntries === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No entries submitted yet</p>
            <p className="text-sm text-gray-400 mt-1">Entries will appear here once people start participating in your giveaways</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Giveaway Filter */}
              <div className="flex-1">
                <label htmlFor="giveaway-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Giveaway
                </label>
                <select
                  id="giveaway-filter"
                  value={selectedGiveaway}
                  onChange={(e) => setSelectedGiveaway(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Giveaways ({totalEntries} entries)</option>
                  {giveaways.map((giveaway) => {
                    const entryCount = allEntries[giveaway.id]?.length || 0;
                    return (
                      <option key={giveaway.id} value={giveaway.id}>
                        {giveaway.title} ({entryCount} entries)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Entries
                </label>
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or giveaway..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Showing {filteredEntries.length} of {totalEntries} total entries
              </p>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Entry Management</h4>
                  <p className="text-sm text-yellow-700">
                    You can reject/delete entries by clicking the trash icon. This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Entries Table */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No entries match your current filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      {selectedGiveaway === 'all' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giveaway
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                Location: {entry.locationNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-2" />
                            <a href={`mailto:${entry.email}`} className="hover:text-blue-600">
                              {entry.email}
                            </a>
                          </div>
                        </td>
                        {selectedGiveaway === 'all' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {entry.giveawayTitle}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(entry.submittedAt).toLocaleDateString()} at{' '}
                            {new Date(entry.submittedAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteEntry(entry.giveawayId, entry.id, entry.name)}
                            disabled={deletingEntry === entry.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            title="Reject/Delete Entry"
                          >
                            {deletingEntry === entry.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEntries;