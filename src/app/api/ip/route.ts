import { NextResponse } from 'next/server';
import os from 'os';
export async function GET() {
  const nets:any = os.networkInterfaces();
  let ips:any[] = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' &&!net.internal) {
        ips.push(`${name}: ${net.address}`);
      }
    }
  }
  return NextResponse.json({ ips });
}
