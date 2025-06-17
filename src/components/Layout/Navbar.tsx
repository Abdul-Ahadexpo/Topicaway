import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Gift, Trophy, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Gift className="h-6 w-6" />
              </motion.div>
              <span>Topicaway</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/winners"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/winners') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Winners
              </Link>
            </motion.div>
            {isAdminAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Admin Panel
                  </Link>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/admin/login') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Admin Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50/80 backdrop-blur-sm rounded-lg my-2">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/winners"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive('/winners') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    Winners
                  </Link>
                </motion.div>
                {isAdminAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive('/admin') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                        }`}
                      >
                        <Shield className="h-5 w-5 mr-2" />
                        Admin Panel
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/admin/login"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/admin/login') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Admin Login
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;