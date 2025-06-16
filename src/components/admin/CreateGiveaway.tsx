import React, { useState } from 'react';
import { createGiveaway } from '../../services/firebase';
import { Calendar, Users, FileText, Save } from 'lucide-react';

interface CreateGiveawayProps {
  onSuccess: () => void;
}

const CreateGiveaway: React.FC<CreateGiveawayProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxParticipants: '',
    endDate: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.maxParticipants) {
      newErrors.maxParticipants = 'Maximum participants is required';
    } else if (parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Maximum participants must be at least 1';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const endDate = new Date(formData.endDate);
      const now = new Date();
      if (endDate <= now) {
        newErrors.endDate = 'End date must be in the future';
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
      await createGiveaway({
        title: formData.title.trim(),
        description: formData.description.trim(),
        maxParticipants: parseInt(formData.maxParticipants),
        endDate: formData.endDate,
        createdAt: new Date().toISOString(),
        isActive: true
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        maxParticipants: '',
        endDate: ''
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating giveaway:', error);
      alert('Error creating giveaway. Please try again.');
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

  // Set minimum date to tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Create New Giveaway</h3>
        <p className="text-sm text-gray-600 mt-1">Set up a new giveaway for your audience</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Giveaway Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter an exciting giveaway title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe what this giveaway is for and what prizes are available..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Max Participants */}
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-1" />
              Maximum Participants *
            </label>
            <input
              type="number"
              id="maxParticipants"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter maximum number of participants"
              min="1"
            />
            {errors.maxParticipants && <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={minDateString}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Giveaway
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGiveaway;