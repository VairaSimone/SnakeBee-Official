import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ReptileEditModal = ({ show, handleClose, reptile, setReptiles, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', species: '', morph: '', image: '',
    birthDate: '', sex: '', isBreeder: false, notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (reptile) {
      setFormData({
        name: reptile.name || '',
        species: reptile.species || '',
        morph: reptile.morph || '',
        birthDate: reptile.birthDate?.split('T')[0] || '', // ⬅ migliora compatibilità input date
        sex: reptile.sex || '',
        isBreeder: !!reptile.isBreeder, // ⬅ assicurati che sia booleano
        notes: reptile.notes || '',
      });
    }
  }, [reptile]);

  const closeOnOverlayClick = (e) => {
    if (e.target.id === 'overlay') handleClose();
  };
useEffect(() => {
  if (show) {
    setToastMsg(null);      // ✅ reset messaggio toast
    setErrorMessage('');    // ✅ reset messaggi d’errore
    setImage(null);         // ✅ reset immagine se vuoi
  }
}, [show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type))
      return setErrorMessage('Formato immagine non valido');
    if (file.size > 5 * 1024 * 1024)
      return setErrorMessage("L'immagine supera i 5MB");
    setImage(file);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToastMsg(null);

    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach((r, i) =>
            Object.entries(r).forEach(([k, v]) =>
              formDataToSubmit.append(`${key}[${i}][${k}]`, v)
            )
          );
        } else {
          formDataToSubmit.append(key, val);
        }
      });
      if (image) formDataToSubmit.append('image', image);
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(`${key}:`, value);
    }
      const { data } = await api.put(`/reptile/${reptile._id}`, formDataToSubmit);
    console.log('API response:', data);
      setToastMsg({ type: 'success', text: 'Rettile aggiornato!' });
      setReptiles((prev) => prev.map((r) => (r._id === data._id ? data : r)));
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error(err);
      setToastMsg({ type: 'danger', text: 'Errore nella modifica' });
    } finally {
      setLoading(false);
    }
  };


  // 💡 Disabilita scroll sotto al modale
  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [show]);
  if (!show) return null;

  return (
    <div
      id="overlay"
      onClick={closeOnOverlayClick}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    >
      <div className="bg-white text-black w-full max-w-3xl rounded-xl p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold">
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Modifica Rettile</h2>
        {errorMessage && <p className="text-red-600 mb-2">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="border p-2 rounded bg-white text-black w-full" />
            <input type="text" name="species" value={formData.species} onChange={handleChange} placeholder="Specie" required className="border p-2 rounded bg-white text-black w-full" />
            <input type="text" name="morph" value={formData.morph} onChange={handleChange} placeholder="Morph" required className="border p-2 rounded bg-white text-black w-full" />
            <input type="date" name="birthDate" value={formData.birthDate} required onChange={handleChange} className="border p-2 rounded bg-white text-black w-full cursor-pointer" />
            <select name="sex" value={formData.sex} onChange={handleChange} className="border p-2 rounded bg-white text-black w-full">
              <option value="">Seleziona sesso</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
            <input type="file" name="image" onChange={handleFileChange} className="border p-2 rounded bg-white text-black w-full" />
          </div>

          <label className="flex items-center mt-2 space-x-2 cursor-pointer">
            <input type="checkbox" name="isBreeder" checked={formData.isBreeder} onChange={handleChange} />
            <span>È un riproduttore</span>
          </label>

          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Note veterinarie o generiche" className="border p-2 rounded bg-white text-black w-full" rows={2} />

          <div className="text-right mt-6">
            <button type="submit" disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
              {loading ? 'Salvataggio...' : 'Salva Rettile'}
            </button>
          </div>
        </form>

        {toastMsg && (
          <div className={`mt-4 p-2 text-center rounded ${toastMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {toastMsg.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReptileEditModal;
