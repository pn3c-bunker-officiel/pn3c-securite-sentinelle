"use client";
import { useState } from "react";

export default function Page() {
  const [alerte, setAlerte] = useState(false);
  
  const posts = [
    { id: 1, user: "Sékou | Abidjan", zone: "Plateau", text: "Le nouveau spot au Plateau! Les gars on se retrouve ce soir pour le cypher! #Abidjan #CANAAOS", likes: 1200 },
    { id: 2, user: "Aïcha | Cocody", zone: "Cocody", text: "Qui a le bon plan attiéké poisson ce soir? J'ai faim oh!", likes: 890 },
  ];

  const doAlert = () => {
    setAlerte(true);
    setTimeout(() => setAlerte(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-orange-500/20 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-black text-orange-500">CANAA-OS</h1>
        <span className="text-xs bg-orange-500 px-2 py-1 rounded-full text-black font-bold">BETA</span>
      </div>

      {alerte && (
        <div className="bg-red-600 p-3 text-center font-bold animate-pulse">
          🚨 ALERTE ENVOYÉE ZONE 4 - ENFANT EN DANGER
        </div>
      )}

      <div className="p-4 space-y-4">
        <button onClick={doAlert} className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-xl font-black text-lg">
          🚨 ALERTE ZONE 4
        </button>

        {posts.map(p => (
          <div key={p.id} className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm">{p.user}</span>
              <span className="text-xs text-orange-400">{p.zone}</span>
            </div>
            <p className="text-sm mb-3">{p.text}</p>
            <div className="text-xs text-white/50">❤️ {p.likes} likes</div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-full bg-black border-t border-white/10 flex justify-around py-3 text-xs">
        <span className="text-orange-500 font-bold">⌂ Feed</span>
        <span>💬 Chats</span>
        <span className="bg-orange-500 w-10 h-10 flex items-center justify-center rounded-full -mt-2 text-xl">+</span>
        <span>◭ Mesh</span>
        <span>👤 Profil</span>
      </div>
    </div>
  );
}
