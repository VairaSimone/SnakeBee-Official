import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice.jsx';
import { Link } from 'react-router-dom';
import ReptileCreateModal from '../components/ReptileCreateModal.jsx';
import ReptileEditModal from '../components/ReptileEditModal.jsx';
import FeedingModal from '../components/FeedingModal.jsx';
import BreedingModal from '../components/BreedingModal.jsx';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.jsx';
import { FaMars, FaVenus } from 'react-icons/fa';

const Dashboard = () => {
  const user = useSelector(selectUser);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [pendingDelete, setPendingDelete] = useState(null);
  const [allReptiles, setAllReptiles] = useState([]);
  const [sortedReptiles, setSortedReptiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const [selectedReptile, setSelectedReptile] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [showBreedingModal, setShowBreedingModal] = useState(false);

  const fetchReptiles = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/reptile/${user._id}/allreptile`, { params: { page } });

      const enriched = await Promise.all(
        data.dati.map(async (r) => {
          const feedings = await api.get(`/feedings/${r._id}`).then(res => res.data.dati || []);
          const nextDate = feedings.length
            ? new Date(Math.min(...feedings.map(x => new Date(x.nextFeedingDate))))
            : null;
          return { ...r, nextFeedingDate: nextDate };
        })
      );

      setAllReptiles(enriched);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError('Impossibile caricare i rettili');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if (user?._id) {
    fetchReptiles();
  } else {
      return (
    <div className="p-4 text-center">
      <p className="text-gray-600">Utente non disponibile. Attendere o rifare il login.</p>
    </div>
  );
  }
}, [user, page]);
useEffect(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible' && user?._id) {
      fetchReptiles();
    }
  }, 1000 * 60 * 2); // ogni 2 minuti

  return () => clearInterval(interval); // pulizia
}, [user]);
  useEffect(() => {
    const sorted = [...allReptiles].sort((a, b) => {
      if (sortKey === 'nextFeedingDate') return new Date(a.nextFeedingDate) - new Date(b.nextFeedingDate);
      return a[sortKey]?.localeCompare(b[sortKey]);
    });
    setSortedReptiles(sorted);
  }, [sortKey, allReptiles]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/reptile/${id}`);
      fetchReptiles(); // refetch dopo eliminazione
    } catch (err) {
      console.error('Errore eliminazione rettile', err);
    }
  };

  return (
    <div className="p-4 bg-[#FAF3E0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2B2B2B]">La tua Dashboard</h2>
          <p className="text-sm text-gray-700">Hai {allReptiles.length} rettil{allReptiles.length !== 1 ? 'i' : 'e'} registrat{allReptiles.length !== 1 ? 'i' : 'o'}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button onClick={() => setShowCreateModal(true)} className="bg-[#228B22] text-white px-4 py-2 rounded hover:bg-green-700">+ Aggiungi rettile</button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Ordina per:</label>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="block w-60 rounded-md border-gray-300 shadow-sm focus:ring-[#228B22] focus:border-[#228B22] bg-white text-[#2B2B2B]"
        >
          <option value="name">Nome</option>
          <option value="species">Specie</option>
          <option value="nextFeedingDate">Prossimo pasto</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-green-400 border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-gray-600">Caricamento in corso...</p>
        </div>
      ) : allReptiles.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Non hai ancora registrato nessun rettile.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-[#228B22] text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Aggiungi il primo rettile
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedReptiles.map(reptile => (
<Link
  to={`/reptiles/${reptile._id}`}
  key={reptile._id}
  className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer relative block"
>
  <div className="aspect-w-16 aspect-h-10 mb-2">
    <img
      src={reptile.image || 'https://placehold.co/300x200'}
      alt={reptile.name}
      className="object-cover w-full h-full rounded"
    />
  </div>
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-semibold">{reptile.name}</h3>
    <span title={reptile.gender}>
      {reptile.sex === 'M' && <FaMars className="text-blue-600" />}
      {reptile.sex === 'F' && <FaVenus className="text-pink-500" />}
    </span>
  </div>
  <p className="text-sm text-gray-700">Specie: {reptile.species}</p>
  <p className="text-sm text-gray-700">Morph: {reptile.morph || 'N/A'}</p>
  <p className="text-sm text-gray-700">
    Prossimo pasto: {reptile.nextFeedingDate ? new Date(reptile.nextFeedingDate).toLocaleDateString() : 'Nessuno'}
  </p>

  <div className="flex gap-2 mt-3">
    <button
      onClick={(e) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedReptile(reptile); setShowEditModal(true);
      }}
      className="flex-1 bg-blue-600 text-white py-1 rounded"
    >
      Modifica
    </button>
    <button
      onClick={(e) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedReptile(reptile); setShowFeedingModal(true);
      }}
      className="flex-1 bg-orange-400 text-white py-1 rounded"
    >
      Pasti
    </button>
    <button
      onClick={(e) => {
        e.preventDefault(); e.stopPropagation();
        setPendingDelete(reptile); setShowDeleteModal(true);
      }}
      className="flex-1 bg-red-500 text-white py-1 rounded"
    >
      Elimina
    </button>
  </div>
</Link>

          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${i + 1 === page ? 'bg-[#228B22] text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <ReptileCreateModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        setReptiles={setAllReptiles}
        onSuccess={fetchReptiles}
      />
      <ReptileEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        reptile={selectedReptile}
        setReptiles={setAllReptiles}
          onSuccess={fetchReptiles}

      />
      <FeedingModal
        show={showFeedingModal}
        handleClose={() => setShowFeedingModal(false)}
        reptileId={selectedReptile?._id}
        onSuccess={fetchReptiles}
      />
      <BreedingModal
        show={showBreedingModal}
        handleClose={() => setShowBreedingModal(false)}
      />
    </div>
  );
};

export default Dashboard;
