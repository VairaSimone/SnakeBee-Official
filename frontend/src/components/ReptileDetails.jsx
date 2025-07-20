import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useParams } from 'react-router-dom';

const ReptileDetails = () => {
  const { reptileId } = useParams();
  const [reptile, setReptile] = useState(null);
  const [feedings, setFeedings] = useState([]);
  const [breeding, setBreeding] = useState([]);
  const [loading, setLoading] = useState(true);
const [visibleFeedings, setVisibleFeedings] = useState(0);
const handleShowMore = () => {
  setVisibleFeedings(prev => prev + 5);
};

const handleShowLess = () => {
  setVisibleFeedings(5);
};

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Dati del rettile
        const { data: reptileData } = await api.get(`/reptile/${reptileId}`);
        setReptile(reptileData);

        // Alimentazione
        const { data: feedingData } = await api.get(`/feedings/${reptileId}?page=1`);
        setFeedings(feedingData.dati || []);
        console.log(feedingData.dati)
        // Riproduzione (nuovo endpoint specifico)
        const { data: breedingData } = await api.get(`/breeding/reptile/${reptileId}`);
        setBreeding(breedingData || []);

        setLoading(false);
      } catch (err) {
        console.error('Errore nel caricamento:', err);
        setLoading(false);
      }
    };

    fetchAll();
  }, [reptileId]);
useEffect(() => {
  // Ogni volta che cambia la lista dei feedings, resetta il conteggio visibile
  if (feedings.length > 0) {
    setVisibleFeedings(5);
  }
}, [feedings]);


  if (loading) return <div className="text-center mt-10">🌀 Caricamento...</div>;
  if (!reptile) return <div className="text-red-600 text-center mt-10">❌ Rettile non trovato</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#FAF3E0] min-h-screen text-[#2B2B2B] font-sans">
      <Link to="/dashboard" className="text-green-700 hover:underline mb-4 inline-block">← Torna indietro</Link>

      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
        {/* LEFT COLUMN */}
        <div>
          <img src={reptile.image || 'https://placehold.co/300x200'}
            className="w-full h-auto object-cover rounded-md border border-[#EDE7D6]" />

          <h2 className="text-3xl font-bold mt-4 text-[#228B22]">{reptile.name}</h2>

          <div className="mt-2 space-y-2">
            <p><strong>Specie:</strong> {reptile.species}</p>
            <p><strong>Morph:</strong> {reptile.morph || 'Non specificato'}</p>
            <p><strong>Data di nascita:</strong> {new Date(reptile.birthDate).toLocaleDateString()}</p>
            <p><strong>Sesso:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-white text-sm ${reptile.sex === 'M' ? 'bg-blue-600' : 'bg-pink-500'}`}>
                {reptile.sex === 'M' ? 'Maschio' : 'Femmina'}
              </span>
            </p>
            <p><strong>Riproduttore:</strong>
              <span className={`ml-2 px-2 py-1 rounded-full text-white text-sm ${reptile.isBreeder ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                {reptile.isBreeder ? 'Sì' : 'No'}
              </span>
            </p>
            {reptile.notes && <p><strong>Note:</strong> {reptile.notes}</p>}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Feedings */}

       <div>
  <h3 className="text-xl font-semibold mb-2 border-b border-gray-300 pb-1">🍖 Alimentazione</h3>
  {feedings.length > 0 ? (
    <>
      <ul className="space-y-2">
        {feedings.slice(0, visibleFeedings).map((feed, i) => (
          <li key={i} className="bg-[#EDE7D6] p-2 rounded">
            <p><strong>Data:</strong> {new Date(feed.date).toLocaleDateString()}</p>
            <p><strong>Tipo cibo:</strong> {feed.foodType}</p>
            <p><strong>Quantità:</strong> {feed.quantity || 'N/A'}</p>
            <p><strong>Prossimo pasto:</strong> {new Date(feed.nextFeedingDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

      {/* Bottoni paginazione */}
      <div className="mt-3 space-x-2">
        {visibleFeedings < feedings.length && (
          <button
            onClick={handleShowMore}
            className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Carica altri
          </button>
        )}
        {visibleFeedings > 5 && (
          <button
            onClick={handleShowLess}
            className="px-4 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Mostra meno
          </button>
        )}
      </div>
    </>
  ) : (
    <p className="text-sm text-gray-600">Nessun pasto registrato.</p>
  )}
</div>   
</div>

      </div>
    </div>
  );
};

export default ReptileDetails;
