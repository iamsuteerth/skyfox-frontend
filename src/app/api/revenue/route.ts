import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');
    if (!tokenCookie?.value) {
      return NextResponse.json({ status: "ERROR", message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const apiUrl = `${process.env.API_BASE_URL}/revenue${url.search}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.API_KEY || '',
        'Authorization': `Bearer ${tokenCookie.value}`,
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Revenue API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
