import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/transcriptions', request.url));
  }

  // Exchange the code for an access token
  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    // Redirect to the transcriptions page
    return NextResponse.redirect(new URL('/transcriptions', request.url));
  } catch (error) {
    console.error('Error in Discord callback:', error);
    return NextResponse.redirect(new URL('/transcriptions', request.url));
  }
} 