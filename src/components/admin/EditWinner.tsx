import React, { useState } from 'react';
import { updateWinner } from '../../services/firebase';
import { Trophy, User, Calendar, Image, Save, X } from 'lucide-react';
import { Winner, Giveaway } from '../../types';

interface EditWinnerProps {
  winner: Winner;
  giveaways: Giveaway[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EditWinner: React.FC<EditWinnerProps> = ({ winner, giveaways, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: winner.name,
    giveawayTitle: winner.giveawayTitle,
    dateWon: winner.dateWon,
    imageUrl: winner.imageUrl
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Winner name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.giveawayTitle.trim()) {
      newErrors.giveawayTitle = 'Giveaway title is required';
    }

    if (!formData.dateWon) {
      newErrors.dateWon = 'Date won is required';
    } else {
      const dateWon = new Date(formData.dateWon);
      const now = new Date();
      if (dateWon > now) {
        newErrors.dateWon = 'Date won cannot be in the future';
      }
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = 'Please enter a valid image URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    
    try {
      await updateWinner(winner.id, {
        name: formData.name.trim(),
        giveawayTitle: formData.giveawayTitle.trim(),
        dateWon: formData.dateWon,
        imageUrl: formData.imageUrl.trim()
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating winner:', error);
      alert('Error updating winner. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Edit Winner</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Winner Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Winner's Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter winner's full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Giveaway Title */}
            <div>
              <label htmlFor="giveawayTitle" className="block text-sm font-medium text-gray-700 mb-2">
                <Trophy className="h-4 w-4 inline mr-1" />
                Giveaway Title *
              </label>
              <div className="space-y-2">
                <select
                  id="giveawayTitle"
                  value={formData.giveawayTitle}
                  onChange={(e) => handleInputChange('giveawayTitle', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.giveawayTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select existing giveaway...</option>
                  {giveaways.map((giveaway) => (
                    <option key={giveaway.id} value={giveaway.title}>
                      {giveaway.title}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-gray-500">Or enter custom title below:</div>
                <input
                  type="text"
                  value={formData.giveawayTitle}
                  onChange={(e) => handleInputChange('giveawayTitle', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.giveawayTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Or enter custom giveaway title"
                />
              </div>
              {errors.giveawayTitle && <p className="mt-1 text-sm text-red-600">{errors.giveawayTitle}</p>}
            </div>

            {/* Date Won */}
            <div>
              <label htmlFor="dateWon" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Won *
              </label>
              <input
                type="date"
                id="dateWon"
                value={formData.dateWon}
                onChange={(e) => handleInputChange('dateWon', e.target.value)}
                max={maxDate}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateWon ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateWon && <p className="mt-1 text-sm text-red-600">{errors.dateWon}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="h-4 w-4 inline mr-1" />
                Winner Photo URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/winner-photo.jpg"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
              
              {/* Image Preview */}
              {formData.imageUrl && !errors.imageUrl && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Winner preview"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                    onError={() => setErrors(prev => ({ ...prev, imageUrl: 'Failed to load image. Please check the URL.' }))}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 focus:ring-4 focus:ring-yellow-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Update Winner
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWinner;