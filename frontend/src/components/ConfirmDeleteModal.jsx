import React from 'react';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, reptileName }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      
      <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full text-center">
        <h3 className="text-lg font-bold mb-2 text-black">Conferma eliminazione</h3>
        <p className='text-black'>Sei sicuro di voler eliminare <strong>{reptileName}</strong>? Questa azione è irreversibile.</p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-300 rounded text-black" onClick={onClose}>Annulla</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>Elimina</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;