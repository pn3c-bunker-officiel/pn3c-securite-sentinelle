'use client'
import { useState, useEffect } from 'react'
import { bluetoothMesh, MeshMessage } from '@/lib/bluetooth-mesh'

export default function CanaaChat({ canaaId }: { canaaId: string }) {
  const [messages, setMessages] = useState<MeshMessage[]>([])
  const [input, setInput] = useState('')
  const [tab, setTab] = useState<'ALERTE'|'CHAT'|'PUB'>('CHAT')

  useEffect(()=>{
    try {
      setMessages(JSON.parse(localStorage.getItem('CANAA_CHAT')||'[]'))
    } catch {}
    bluetoothMesh.init()
    bluetoothMesh.onMessage((m)=>{
      setMessages(prev => [...prev, m].slice(-100))
    })
    const onStorage = () => {
      try {
        const raw = localStorage.getItem('CANAA_CHAT')
        if(raw) setMessages(JSON.parse(raw))
      } catch {}
    }
    window.addEventListener('canaa-mesh-msg', onStorage)
    window.addEventListener('storage', onStorage)
    return ()=> {
      window.removeEventListener('canaa-mesh-msg', onStorage)
      window.removeEventListener('storage', onStorage)
    }
  },[])

  const send = async () => {
    if(!input.trim()) return
    const msg: MeshMessage = {
      type: tab,
      zone: 'ZONE-ABIDJAN',
      message: input,
      timestamp: Date.now(),
      id: canaaId,
      senderPlatform: 'Android'
    }
    await bluetoothMesh.broadcast(msg)
    setMessages(prev => [...prev, msg].slice(-100))
    setInput('')
  }

  return (
    <div className="p-3 bg-zinc-900 text-white rounded-xl mt-4 border border-zinc-800">
      <div className="flex gap-2 mb-3">
        {(['ALERTE','CHAT','PUB'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-full text-sm font-bold ${tab===t? 'bg-red-600' : 'bg-zinc-800'}`}>{t}</button>
        ))}
      </div>
      <div className="h-64 overflow-y-auto bg-black rounded p-2 mb-2 flex flex-col gap-2 border border-zinc-800">
        {messages.map((m,i)=>(
          <div key={i} className={`p-2 rounded text-sm ${m.type==='ALERTE'? 'bg-red-900 border border-red-500' : m.id===canaaId? 'bg-blue-900 self-end' : 'bg-zinc-800 self-start'} max-w-[80%]`}>
            <div className="text-[10px] opacity-60">{m.id.slice(0,10)} • {new Date(m.timestamp).toLocaleTimeString()}</div>
            <div>{m.message}</div>
          </div>
        ))}
        {messages.length===0 && <div className="text-center opacity-40 mt-20 text-xs">Aucun message. Envoie le premier!</div>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder={tab==='ALERTE'? 'ALERTE URGENTE...' : 'Message...'} className="flex-1 bg-black border border-zinc-700 rounded-full px-4 py-2 text-sm outline-none" onKeyDown={e=> e.key==='Enter' && send()} />
        <button onClick={send} className="bg-green-600 px-5 py-2 rounded-full font-bold text-sm">ENVOI</button>
      </div>
      <div className="text-[9px] mt-2 opacity-40 text-center">MESH OFFLINE • {messages.length} msgs</div>
    </div>
  )
}
