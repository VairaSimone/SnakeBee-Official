import React from "react";
import { HashLink as Link } from 'react-router-hash-link';

const Footer = () => {
  return (
    <footer className="bg-[#EDE7D6] text-[#2B2B2B] py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Sezione Informazioni */}
        <div>
          <h5 className="text-xl font-semibold font-poppins mb-4">Informazioni</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/home#chi-siamo" className="hover:text-[#228B22] transition">Chi siamo</Link></li>
            <li><Link to="/home#contatti" className="hover:text-[#228B22] transition">Contatti</Link></li>
            <li><Link to="/home#privacy-policy" className="hover:text-[#228B22] transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Sezione Servizi */}
        <div>
          <h5 className="text-xl font-semibold font-poppins mb-4">Servizi</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/home#servizi" className="hover:text-[#228B22] transition">Gestione rettili</Link></li>
            <li><Link to="/home#servizi" className="hover:text-[#228B22] transition">Consulenza</Link></li>
            <li><Link to="/home#servizi" className="hover:text-[#228B22] transition">Supporto tecnico</Link></li>
          </ul>
        </div>

        {/* Sezione Social */}
        <div>
          <h5 className="text-xl font-semibold font-poppins mb-4">Seguici</h5>
          <div className="flex space-x-4 text-2xl">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-[#FFD700] transition">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-[#FFD700] transition">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-[#FFD700] transition">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm border-t border-[#d0caba] pt-4">
        © 2025 SnakeBee. Tutti i diritti riservati.
      </div>
    </footer>
  );
};

export default Footer;
