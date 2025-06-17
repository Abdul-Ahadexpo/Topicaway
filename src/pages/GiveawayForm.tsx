import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Shield, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGiveaway, createGiveawayEntry, getGiveawayEntries } from '../services/firebase';
import { Giveaway } from '../types';
import { useConfetti } from '../hooks/useConfetti';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import CountdownTimer from '../components/ui/CountdownTimer';

const GiveawayForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerConfetti } = useConfetti();
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phoneNumber: '',
    email: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchGiveaway = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        const giveawayData = await getGiveaway(id);
        if (!giveawayData) {
          navigate('/');
          return;
        }

        setGiveaway(giveawayData);
        
        const entries = await getGiveawayEntries(id);
        setEntryCount(entries.length);

        // Check if giveaway is still active and accepting entries
        const now = new Date();
        const endDate = new Date(giveawayData.endDate);
        
        if (!giveawayData.isActive || now >= endDate || entries.length >= giveawayData.maxParticipants) {
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error fetching giveaway:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchGiveaway();
  }, [id, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{7,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !giveaway || !id) return;

    setSubmitting(true);
    
    try {
      await createGiveawayEntry({
        giveawayId: id,
        name: formData.name.trim(),
        location: formData.location.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        submittedAt: new Date().toISOString()
      });

      // Trigger confetti animation
      triggerConfetti();

      // Success - redirect with success message after confetti
      setTimeout(() => {
        alert('🎉 Your entry has been submitted successfully! Good luck!');
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert('Sorry, there was an error submitting your entry. Please try again.');
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

  if (!giveaway) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Giveaway Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 relative">
      <AnimatedBackground />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Giveaways
        </motion.button>

        {/* Form Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 sm:px-8 py-8 text-white">
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {giveaway.title}
            </motion.h1>
            <motion.p 
              className="text-blue-100 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {giveaway.description}
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="bg-white/20 rounded-full px-3 py-1">
                {entryCount} / {giveaway.maxParticipants} entries
              </span>
              <CountdownTimer 
                endDate={giveaway.endDate}
                className="bg-white/20 rounded-full px-3 py-1 text-white"
              />
            </motion.div>
          </div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="px-6 sm:px-8 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-500 shake' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <motion.p 
                    className="mt-1 text-sm text-red-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </motion.div>

              {/* Location Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your location (city, area, etc.)"
                />
                {errors.location && (
                  <motion.p 
                    className="mt-1 text-sm text-red-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.location}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone Number Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <motion.p 
                    className="mt-1 text-sm text-red-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.phoneNumber}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <motion.p 
                    className="mt-1 text-sm text-red-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Privacy Notice */}
              <motion.div 
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Privacy Notice</h3>
                    <p className="text-sm text-blue-700">
                      We value your privacy. This information is only used to send you the giveaway prize and is not shared or used for any other purpose.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-teal-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Entry
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default GiveawayForm;