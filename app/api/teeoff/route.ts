import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.teeoff.com/api/autocomplete/geocity/${encodeURIComponent(city)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from TeeOff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from TeeOff' },
      { status: 500 }
    );
  }
}