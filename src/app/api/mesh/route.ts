import { NextResponse } from 'next/server';
let alerts: any[] = [];

export async function GET() {
  return NextResponse.json(alerts);
}
export async function POST(req: Request) {
  const body = await req.json();
  alerts.unshift({...body, time: new Date().toLocaleTimeString() });
  if (alerts.length > 20) alerts.pop();
  return NextResponse.json({ ok: true });
}
