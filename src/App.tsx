import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import GiveawayForm from './pages/GiveawayForm';
import Winners from './pages/Winners';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/giveaway/:id" element={<GiveawayForm />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;