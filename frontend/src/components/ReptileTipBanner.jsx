import React, { useState, useEffect } from 'react';

const tips = [
  "Alcuni rettili hanno bisogno di spot UVB per metabolismo e ossa forti 🦎☀️",
  "Hai mai pensato all’arricchimento ambientale? Tunnels e nascondigli riducono lo stress 🐢",
  "Ricorda: metà del terrario deve essere più fresca, l’altra calda 🌡️ per termoregolazione",
  "Lucertole e gechi amano salire! Aggiungi gradini o rami per stimolarli 🦎",
  "Pressatura di calcio su insetti? No: meglio spolverarli ogni volta 🐛🧂",
  "Pulizia frequente evita muffe: rimuovi feci e vecchie pelli quotidianamente 🧼",
  "La lingua biforcuta dei serpenti serve a 'sniffare' l'ambiente, non solo per stile 😏",
  "I camaleonti non cambiano colore per 'mimetizzarsi' — lo fanno per regolare la temperatura o comunicare 🎨",
  "Mai toccare un serpente subito dopo che ha mangiato. Ha appena fatto un pranzo da re 👑🐍",
  "Non mettere due maschi nello stesso terrario. Se non litigano, si ignorano… o peggio 👊",
  "L’umidità per un pitone reale deve stare tra il 50–60%. Troppa può causare muffa e infezioni 💧",
  "Durante la muta, non forzare la pelle del serpente. Meglio offrire una vaschetta d’acqua tiepida 🛁",
  "Le tartarughe NON ibernano a caso. Serve temperatura e controllo o rischiano la vita ❄️",
  "Lo sapevi? I serpenti non hanno palpebre. Quello che vedi è una 'squama oculare' 🐍👁️",
  "Mai mettere le mani in un terrario subito dopo aver maneggiato cibo. Sei tu lo snack ora 🍗➡️🖐️",
  "Alcune specie di lucertole rigenerano la coda, ma non è un trucco illimitato. Attenzione! 🔁",
  "Pulisci regolarmente la ciotola dell'acqua: molti batteri amano i beverini stagnanti 🚰",
  "I rettili non sono 'freddi': sono eterotermi! Usano il calore esterno per funzionare 🌞",
    "Mai dare cibo più grande della testa del serpente. È una bocca, non una valigia 🧳🐍",
  "Un terrario senza nascondigli è come una casa senza bagno: non vivibile 😅",
  "Non tutti i rettili mordono… ma quelli che lo fanno hanno perfetta mira 😬🎯",
  "Alcuni serpenti fischiano o soffiano. Non sono arrabbiati. Sono solo drama queen 🐍💨",
  "Non usare substrati profumati. I rettili non vogliono vivere in un deodorante per auto 🌲😵",

];

const ReptileTipBanner = () => {
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('hideReptileTipBanner')) return;

    const chance = Math.random();
    if (chance < 0.4) { // 30% di probabilità
      const idx = Math.floor(Math.random() * tips.length);
      setTip(tips[idx]);
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('hideReptileTipBanner', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 left-4 bg-green-100 border border-green-300 text-green-900 px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">Reptile Tip</p>
          <p className="text-xs mt-1">{tip}</p>
        </div>
        <button onClick={handleClose} className="ml-4 text-sm text-green-700 hover:text-green-900">✕</button>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ReptileTipBanner;
