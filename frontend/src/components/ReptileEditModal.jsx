import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
        birthDate: reptile.birthDate?.split('T')[0] || '',
        sex: reptile.sex || '',
        isBreeder: !!reptile.isBreeder,
        notes: reptile.notes || '',
      });
    }
  }, [reptile]);

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

  const validateBirthDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);

    const birth = new Date(formData.birthDate);
    if (birth > today) {
      setErrorMessage('La data di nascita non può essere nel futuro');
      return false;
    } else if (birth < minDate) {
      setErrorMessage('La data di nascita è troppo antica (max 100 anni fa)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToastMsg(null);
    setErrorMessage('');
    if (!validateBirthDate()) {
      setLoading(false);
      return;
    }
    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        formDataToSubmit.append(key, val);
      });
      if (image) formDataToSubmit.append('image', image);

      const { data } = await api.put(`/reptile/${reptile._id}`, formDataToSubmit);
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

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#228B22] focus:border-[#228B22] bg-white text-gray-800";
  const labelClasses = "block font-medium text-sm mb-1 text-gray-800";

  return (
    <Transition show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-800">Modifica Rettile</Dialog.Title>

                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
                >
                  &times;
                </button>

                {errorMessage && <p className="text-red-600 mb-2 text-sm">{errorMessage}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Nome</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label className={labelClasses}>Specie *</label>
                      <input type="text" name="species" value={formData.species} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                      <label className={labelClasses}>Morph *</label>
                      <input type="text" name="morph" value={formData.morph} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div>
                      <label className={labelClasses}>Data di nascita *</label>
                      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={`${inputClasses} text-sm`} max={new Date().toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className={labelClasses}>Sesso *</label>
                      <select name="sex" value={formData.sex} onChange={handleChange} className={`${inputClasses} max-h-[48px] text-sm`}>
                        <option value="">Seleziona</option>
                        <option value="M">Maschio</option>
                        <option value="F">Femmina</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        name="isBreeder"
                        checked={formData.isBreeder}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#228B22] rounded focus:ring-[#228B22]"
                      />
                      <label className="text-sm text-gray-800">È un riproduttore</label>
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Note</label>
                    <textarea name="notes" rows={2} value={formData.notes} onChange={handleChange} className={inputClasses} />
                  </div>

                  <div>
                    <label className={labelClasses}>Immagine</label>
                    <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded file:bg-[#228B22] file:text-white file:rounded file:px-4 file:py-1" />
                  </div>

                  <hr className="my-4" />

                  <div className="mt-6 text-right">
                    <button type="submit" className="bg-[#228B22] text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>
                      {loading ? 'Salvataggio...' : 'Salva Rettile'}
                    </button>
                  </div>
                </form>

                {toastMsg && (
                  <p className={`mt-4 text-center text-sm ${toastMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{toastMsg.text}</p>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReptileEditModal;
