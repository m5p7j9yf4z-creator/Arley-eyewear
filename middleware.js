import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // 1. Ohitetaan salasanasuojaus täysin, jos sivua ajetaan paikallisesti omalla koneella
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  // 2. Napataan selaimen lähettämä tunnistautumisyritys
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    // Luetaan käyttäjätunnus ja salasana Base64-muodosta
    const authValue = authHeader.split(' ')[1];
    const [username, password] = atob(authValue).split(':');

    // Määritetään vaadittu salasana (käyttäjätunnuksella ei ole väliä, jätetään se tyhjäksi tai miksi vain)
    if (password === 'arley2026') {
      return NextResponse.next();
    }
  }

  // 3. Jos salasanaa ei ole annettu tai se on väärin, pyydetään selainta avaamaan kirjautumisikkuna
  return new NextResponse('Pääsy evätty. Syötä oikea salasana.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Suojattu tilausportaali"',
    },
  });
}

// Tämä määritys varmistaa, että suojaus koskee kaikkia sivuston osia (paitsi staattisia tiedostoja kuten kuvia)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};