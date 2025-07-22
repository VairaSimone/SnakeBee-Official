import React from 'react';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, reptileName }) => {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    // Chiude solo se clicchi sull’overlay, non se clicchi dentro il contenuto
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-black">Conferma eliminazione</h3>
        <p className="text-black text-sm md:text-base">
          Sei sicuro di voler eliminare <strong>{reptileName}</strong>?<br />
          Questa azione è <span className="text-red-600 font-semibold">irreversibile</span>.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded text-black hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Annulla
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
