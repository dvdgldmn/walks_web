import { NextRequest, NextResponse } from 'next/server';

// Smart download link (replaces the retired AppsFlyer OneLink): iOS -> App Store,
// Android -> Google Play, anything else (desktop) -> the website.
const APP_STORE_URL = 'https://apps.apple.com/az/app/dosty-walks-step-counter/id6759555431';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=app.dosty.walks';

const SITE_URL = 'https://walks.az/';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';
  let target: string | null = null;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile/i.test(ua))) {
    target = APP_STORE_URL;
  } else if (/Android/i.test(ua)) {
    target = GOOGLE_PLAY_URL;
  }

  if (target) {
    return NextResponse.redirect(target, 302);
  }

  return NextResponse.redirect(SITE_URL, 302);
}
