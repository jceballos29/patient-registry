import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Aquí podrías agregar validaciones adicionales
    // como verificar la conexión a la base de datos

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Service unavailable',
      },
      { status: 503 }
    );
  }
}
