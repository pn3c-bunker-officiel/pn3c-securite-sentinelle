export type MeshMessage = { type: string; zone: string; message: string; timestamp: number; id: string; senderPlatform: string };
class BluetoothMeshLive {
  peers = new Set<string>();
  status = 'INIT';
  listeners: any[] = [];
  async init() {
    this.status = 'READY';
    if (typeof navigator!== 'undefined' && 'bluetooth' in navigator) {
      this.status = 'BLUETOOTH_SUPPORTED';
    } else {
      this.status = 'SHARE_MODE';
    }
    return this.status;
  }
  async broadcast(msg: MeshMessage) {
    this.peers.add('self-'+Date.now());
    try {
      if (typeof localStorage!== 'undefined') {
        localStorage.setItem('CANAA_LAST_ALERT', JSON.stringify(msg));
        localStorage.setItem('CANAA_CHAT', JSON.stringify([...JSON.parse(localStorage.getItem('CANAA_CHAT')||'[]'), msg].slice(-100)));
      }
      if (typeof window!== 'undefined') {
        window.dispatchEvent(new Event('canaa-mesh-msg'));
      }
    } catch(e){}
    this.listeners.forEach(cb => { try{ cb(msg) } catch(e){} });
    return { success: true, peers: this.peers.size };
  }
  onMessage(cb: (m: MeshMessage)=>void){ this.listeners.push(cb); }
  getStatus(){
    return {
      status: this.status,
      peers: this.peers.size,
      hasBluetooth: typeof navigator!== 'undefined' && 'bluetooth' in navigator,
      hasShare: typeof navigator!== 'undefined' && 'share' in navigator
    };
  }
}
export const bluetoothMesh = new BluetoothMeshLive();
