// src/components/ProtectedLayout.jsx
import React from 'react';
import NavBar from './Navbar';
import Footer from './Footer';

const ProtectedLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#FAF3E0]">{children}</main>
      <Footer />
    </>
  );
};

export default ProtectedLayout;
