import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser } from '../features/userSlice';
import api from '../services/api';
import Notifications from './Notifications';

const Navbar = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarMenuRef = useRef();

  const handleLogout = async () => {
    try {
      await api.post('/api/v1/logout', null, { withCredentials: true });
      dispatch(logoutUser());
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Errore logout:', err);
    }
  };

  const fetchNotificationsCount = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/notifications/unread/count');
      setNotificationsCount(data.unreadCount);
    } catch (err) {
      console.error('Errore notifiche:', err);
    }
  };

  useEffect(() => {
    fetchNotificationsCount();
    const interval = setInterval(fetchNotificationsCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#FAF3E0] text-[#2B2B2B] shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[#228B22] flex items-center gap-2">
          🐍 SnakeBee
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden text-2xl"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className="hidden sm:flex gap-6 items-center font-medium">
          {!user ? (
            <>
              <NavLink to="/login" className="hover:text-[#228B22]">Login</NavLink>
              <NavLink to="/register" className="hover:text-[#228B22]">Registrati</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className="hover:text-[#228B22]">Dashboard</NavLink>
              <NavLink to="/breeding" className="hover:text-[#228B22]">Riproduzione</NavLink>

              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <FaBell className="text-xl" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FFD700] text-xs font-bold text-black rounded-full px-1">
                    {notificationsCount}
                  </span>
                )}
              </button>

              <div className="relative" ref={avatarMenuRef}>
                <button onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}>
                  <img
 src={user?.avatar?.trim() ? user.avatar : '/default-avatar.png'}
  onError={(e) => { e.target.src = '/default-avatar.png'; }}                    alt="Avatar"
                    className="w-9 h-9 rounded-full border-2 border-[#228B22]"
                  />
                </button>
                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 hover:bg-[#F1F1F1]"
                      onClick={() => setAvatarMenuOpen(false)}
                    >
                      Profilo
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-[#F1F1F1]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </ul>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden px-4 py-3 space-y-3 bg-[#EDE7D6] flex flex-col text-base">
          {!user ? (
            <>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMobileMenuOpen(false)}>Registrati</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/breeding" onClick={() => setMobileMenuOpen(false)}>Riproduzione</NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Profilo</NavLink>
              <button
                onClick={handleLogout}
                className="text-left text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {showNotifications && user && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}>
          <div
            className="absolute top-20 right-4 bg-white border shadow-md rounded-md z-50 w-80 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Notifiche</h2>
              <button onClick={() => setShowNotifications(false)} className="text-sm text-gray-500">Chiudi</button>
            </div>
            <Notifications onNotificationRead={fetchNotificationsCount} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
