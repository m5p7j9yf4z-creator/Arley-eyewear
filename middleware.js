import { NextResponse } from 'next/server';

export function middleware(request) {
  const authHeader = request.headers.get('authorization');

  // Voit vaihtaa tähän haluamasi tunnuksen ja salasanan.
  // Nykyisellään tunnus on: arley ja salasana on: salasana123
  if (authHeader !== 'Basic ' + btoa('arley:salasana123')) {
    return new NextResponse('Suojattu tilausportaali', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Syota salasana"',
      },
    });
  }

  return NextResponse.next();
}

// Tämä sääntö varmistaa, että suojaus koskee aivan jokaista sivua, kuvaa ja tiedostoa
export const config = {
  matcher: '/:path*',
};