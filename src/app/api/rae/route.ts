import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json(
      { error: 'Palabra no proporcionada' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://rae-api.com/api/words/${encodeURIComponent(word)}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error al buscar en la RAE:', error);
    return NextResponse.json(
      { error: 'Error al buscar en la RAE' },
      { status: 500 }
    );
  }
}