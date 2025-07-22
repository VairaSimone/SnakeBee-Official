import React, { useState, useEffect } from 'react';
import api from '../services/api';

const FeedingModal = ({ show, handleClose, reptileId, onFeedingAdded, onSuccess }) => {
  const [feedings, setFeedings] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    foodType: '',
    quantity: '',
    nextFeedingDate: '',
    notes: '',
    daysUntilNextFeeding: '',
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  useEffect(() => {
    if (show && reptileId) fetchFeedings(page);
  }, [show, reptileId, page]);

  const fetchFeedings = async (page) => {
    try {
      const { data } = await api.get(`/feedings/${reptileId}?page=${page}`);
      setFeedings(data.dati);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Errore nel caricare i pasti:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date' && new Date(value) > new Date()) return;
    if (name === 'notes' && value.length > 300) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = async (feedingId) => {
    try {
      await api.delete(`/feedings/${feedingId}`);
      setFeedings(feedings.filter((f) => f._id !== feedingId));
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/feedings/${reptileId}`, formData);
      onSuccess?.();
      setFeedings([...feedings, data]);
      setFormData({
        date: '', foodType: '', quantity: '', nextFeedingDate: '', notes: '', daysUntilNextFeeding: '',
      });
      onFeedingAdded?.();
    } catch (err) {
      console.error('Errore nell\'aggiunta:', err);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-red-600 font-bold">&times;</button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestione Pasti</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-white" />
          <input type="text" name="foodType" value={formData.foodType} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-white" placeholder="Tipo di alimento (es. Topo adulto)" />
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-white" placeholder="Quantità" />
          <input type="number" name="daysUntilNextFeeding" value={formData.daysUntilNextFeeding} onChange={handleChange} required className="w-full border rounded px-3 py-2 bg-white" placeholder="Giorni al prossimo pasto" />
          <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} maxLength={300} className="md:col-span-2 border rounded px-3 py-2 bg-white" placeholder="Note (max 300 caratteri)" />
          <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
            Aggiungi Pasto
          </button>
        </form>

        {/* CRONOLOGIA */}
        <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Cronologia Pasti</h3>
        <div className="overflow-x-auto text-sm">
          <table className="w-full border text-gray-800 min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Data</th>
                <th className="p-2 text-left">Cibo</th>
                <th className="p-2 text-left">Quantità</th>
                <th className="p-2 text-left">Prossimo Pasto</th>
                <th className="p-2 text-left">Note</th>
                <th className="p-2 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {feedings.map((f) => (
                <tr key={f._id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 whitespace-nowrap">{new Date(f.date).toLocaleDateString()}</td>
                  <td className="p-2 whitespace-nowrap">{f.foodType}</td>
                  <td className="p-2">{f.quantity || '—'}</td>
                  <td className="p-2 whitespace-nowrap">{new Date(f.nextFeedingDate).toLocaleDateString()}</td>
                  <td className="p-2 max-w-xs truncate" title={f.notes}>{f.notes || '—'}</td>
                  <td className="p-2">
                    <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:text-red-700 font-semibold">Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAZIONE */}
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded transition-all ${
                page === i + 1 ? 'bg-yellow-400 font-bold text-gray-800' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedingModal;
