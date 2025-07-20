import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAF3E0] text-[#2B2B2B] font-sans">
      <main className="max-w-5xl mx-auto p-6">
        {/* Hero */}
        <section className="text-center py-16">
          <h2 className="text-4xl font-bold mb-4">Gestione intelligente dei tuoi rettili</h2>
          <p className="text-lg text-gray-700 mb-6">
            Con SnakeBee puoi tenere traccia di ogni aspetto dell’allevamento: dalla crescita, alla salute, fino alla riproduzione.
            Semplice, efficace e progettato su misura per allevatori moderni.
          </p>
          <Link
            to="/register"
            className="bg-[#FFD700] text-[#2B2B2B] px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
          >
            Inizia ora
          </Link>
        </section>

        {/* Chi siamo */}
        <section id="chi-siamo" className="py-12 border-t border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Chi siamo</h3>
          <p className="text-gray-700 leading-relaxed">
            SnakeBee è una piattaforma nata dalla passione per i rettili e dalla necessità di avere uno strumento professionale ma accessibile per
            chi alleva serpenti, gechi e altri animali esotici. Offriamo un gestionale moderno per controllare in modo chiaro e ordinato
            tutti gli aspetti della vita dei tuoi animali.
            <br /><br />
            Il nostro obiettivo? Migliorare il benessere dei rettili e supportare la crescita di una community consapevole e informata.
          </p>
        </section>

        {/* Servizi */}
        <section id="servizi" className="py-12 border-t border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Servizi</h3>
          <ul className="space-y-2 list-disc ml-6 text-gray-700">
            <li>📋 <strong>Gestione rettili:</strong> peso, alimentazione, interventi e molto altro.</li>
            <li>🧠 <strong>Consulenza:</strong> supporto su alimentazione e riproduzione.</li>
            <li>🛠 <strong>Supporto tecnico:</strong> assistenza per l’uso della piattaforma e nuove funzionalità.</li>
            <li>🐍 <strong>Riproduzione:</strong> organizza accoppiamenti, incubazione e cuccioli.</li>
          </ul>
        </section>

        {/* Donazioni */}
        <section className="py-12 border-t border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Supporta SnakeBee</h3>
          <p className="text-gray-700 mb-4">
            SnakeBee è un progetto indipendente, costruito con passione e senza grandi finanziamenti.
            Se apprezzi il nostro lavoro e vuoi contribuire alla sua evoluzione, puoi supportarci con una donazione libera.
            Ogni contributo ci aiuta a migliorare la piattaforma, aggiungere nuove funzionalità e rimanere attivi!
          </p>
          <a
            href="https://www.paypal.com/donate?hosted_button_id=TUO_ID_PAYPAL"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#228B22] text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Fai una donazione
          </a>
        </section>

        {/* Contatti */}
        <section id="contatti" className="py-12 border-t border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Contatti</h3>
          <p className="text-gray-700">
            Hai domande, suggerimenti o vuoi collaborare? Scrivici a{" "}
            <a href="mailto:info@snakebee.it" className="text-[#228B22] underline">info@snakebee.it</a>{" "}
            o seguici su <a href="https://www.instagram.com" className="underline text-[#228B22]" target="_blank">Instagram</a>.
          </p>
        </section>

        {/* Privacy Policy */}
        <section id="privacy-policy" className="py-12 border-t border-gray-300">
          <h3 className="text-2xl font-semibold mb-4">Privacy Policy</h3>
          <p className="text-gray-700 text-sm">
            SnakeBee raccoglie solo i dati strettamente necessari per offrire i suoi servizi.
            Nessuna informazione viene condivisa con terze parti. Tutti i dati sono protetti e trattati nel rispetto delle normative europee.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;
