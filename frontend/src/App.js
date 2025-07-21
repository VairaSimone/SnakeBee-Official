import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectUser } from './features/userSlice';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import GoogleCallback from './pages/GoogleCallback';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import Notifications from './components/Notifications';
import ReptileDetails from './components/ReptileDetails';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedLayout from './components/ProtectedLayout';
import Breeding from './pages/Breeding';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import api from './services/api';
import CookieConsent from 'react-cookie-consent';
import DonationBanner from './components/DonationBanner';
import ReptileTipBanner from './components/ReptileTipBanner';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          dispatch(loginUser(res.data));
        })
        .catch((err) => {
          console.error('Errore recupero dati utente:', err);
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Redirezione iniziale */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Pagine pubbliche */}
        <Route path="/home" element={
          <>
            <NavBar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login-google-callback" element={<GoogleCallback />} />

        {/* Pagine protette */}
        <Route path="/dashboard" element={<ProtectedRoute>      <ProtectedLayout>
          <Dashboard />      </ProtectedLayout>
        </ProtectedRoute>} />
        <Route path="/breeding" element={<ProtectedRoute><ProtectedLayout><Breeding /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProtectedLayout><UserProfile /></ProtectedLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/reptiles/:reptileId" element={<ProtectedRoute><ReptileDetails /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      
      
      </Routes>
              <CookieConsent
    location="bottom"
    buttonText="Accetto"
    cookieName="cookieConsent"
    style={{ background: "#2B373B", zIndex: 9999 }}
    buttonStyle={{ color: "#fff", background: "#4CAF50", fontSize: "14px", padding: '8px 16px', borderRadius: '4px' }}
    expires={365}
  >
    Questo sito utilizza cookie tecnici per migliorare l'esperienza utente. <a href="/privacy-policy" style={{ color: "#aaa" }}>Scopri di più</a>.
  </CookieConsent>
    <DonationBanner />
    <ReptileTipBanner />

    </Router>
  );
}

export default App;
