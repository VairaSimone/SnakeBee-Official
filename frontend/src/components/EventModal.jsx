// components/EventModal.jsx
import React, { useState, useEffect } from 'react';
import { postEvent, getEvents, deleteEvent } from '../services/api';

const EventModal = ({ show, handleClose, reptileId }) => {
  const [events, setEvents] = useState([]);
  const [type, setType] = useState('shed');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const [expandedNotes, setExpandedNotes] = useState({});
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const eventTypeLabels = {
    shed: 'Muta',
    feces: 'Feci',
    vet: 'Visita veterinaria'
  };
  useEffect(() => {
    if (reptileId && show) {
      getEvents(reptileId).then(res => setEvents(res.data));
    }
  }, [reptileId, show]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-bg')) {
      handleClose();
    }
  };
  const toggleNote = (id) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSubmit = async () => {
    if (!date) return;
    await postEvent({ reptileId, type, date, notes });
    const updated = await getEvents(reptileId);
    setEvents(updated.data);
    setDate('');
    setNotes('');
  };

  const handleDelete = async (eventId) => {
    await deleteEvent(eventId);
    const updated = await getEvents(reptileId);
    setEvents(updated.data);
  };

  if (!show) return null;

  return (
    <div onClick={handleOutsideClick} className="modal-bg fixed inset-0 z-50 bg-opacity-100 flex items-center justify-center backdrop-blur-sm">

      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg relative">
        {/* X in alto a destra */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-black text-xl font-bold hover:text-red-600"
          aria-label="Chiudi"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4  text-black">📆 Eventi Rettile</h2>

        <div className="mb-2">
          <label className="block text-sm font-medium text-black">Tipo evento</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded bg-white text-black">
            <option value="shed">Muta</option>
            <option value="feces">Feci</option>
            <option value="vet">Visita veterinaria</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-black">Data evento</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-black">Note (opzionale)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded bg-white text-black" />
        </div>

        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded w-full mb-4">Aggiungi evento</button>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {currentEvents.length > 0 ? (
            currentEvents.map((e) => {
              const isExpanded = expandedNotes[e._id];
              const displayedNote = isExpanded || (e.notes?.length ?? 0) <= 100
                ? e.notes
                : e.notes.slice(0, 100) + '...';

              return (
                <div key={e._id} className="border border-gray-300 bg-white shadow-sm rounded-md p-3 max-w-full">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm font-bold text-purple-700">{eventTypeLabels[e.type]}</span>
                      <p className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Elimina
                    </button>
                  </div>

                  {e.notes && (
                    <div className="text-sm text-gray-800 whitespace-pre-wrap break-words overflow-hidden">
                      {displayedNote}
                      {e.notes.length > 100 && (
                        <button
                          onClick={() => toggleNote(e._id)}
                          className="ml-1 text-blue-600 text-xs hover:underline"
                        >
                          {isExpanded ? 'Mostra meno' : 'Mostra di più'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">Nessun evento registrato.</p>
          )}
        </div>


      </div>
    </div>
  );
};

export default EventModal;
