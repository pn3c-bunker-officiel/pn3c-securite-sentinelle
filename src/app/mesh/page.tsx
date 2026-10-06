"use client";
import { useState, useEffect } from "react";
export default function MeshPage(){
  const [msgs, setMsgs] = useState<any[]>(()=>{
    if(typeof window!=='undefined'){
      const s=localStorage.getItem('MESH_CHAT');
      return s?JSON.parse(s):[{id:1,user:"GUARDIAN",text:"Réseau MESH activé - Fonctionne sans internet à 200m. 8e Tranche connectée.",time:"maintenant"}]
    }
    return [];
  });
  const [txt, setTxt] = useState("");
  useEffect(()=>{localStorage.setItem('MESH_CHAT',JSON.stringify(msgs))},[msgs]);
  useEffect(()=>{
    const ch = new BroadcastChannel('canaa-mesh');
    ch.onmessage = (e)=>{ setMsgs(m=>[...m, e.data]) };
    return ()=>ch.close();
  },[]);
  const send = ()=>{
    if(!txt.trim()) return;
    const m={id:Date.now(),user:"Toi • 8e Tranche",text:txt,time:new Date().toLocaleTimeString(),mesh:true};
    setMsgs(prev=>[...prev,m]);
    const ch = new BroadcastChannel('canaa-mesh'); ch.postMessage(m); ch.close();
    if(navigator.vibrate) navigator.vibrate(50);
    setTxt("");
  };
  return(
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[480px] mx-auto min-h-screen flex flex-col border-x border-white/10 bg-black">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-950">
          <a href="/" className="text-xs opacity-50">← RETOUR</a>
          <h1 className="font-black">MESH <span className="text-orange-500">• P2P</span></h1>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        <div className="p-3 bg-orange-500/10 border-b border-orange-500/20 text-[11px] text-orange-300 text-center">⚡ MODE AVION OK • 200M • CHIFFRÉ</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m:any)=><div key={m.id} className={`max-w-[80%] rounded-2xl p-3 ${m.user.includes('Toi')?'ml-auto bg-white text-black':'bg-zinc-900 border border-white/10'}`}><p className="text-[10px] opacity-50">{m.user} • {m.time}</p><p className="text-[13px] mt-1">{m.text}</p></div>)}
        </div>
        <div className="p-3 border-t border-white/10 flex gap-2 bg-zinc-950">
          <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Message mesh..." className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-3 text-sm outline-none"/>
          <button onClick={send} className="bg-white text-black w-12 h-12 rounded-full font-black">↗</button>
        </div>
      </div>
    </div>
  )
}
