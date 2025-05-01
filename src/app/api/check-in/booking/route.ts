import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = `${process.env.API_BASE_URL}/check-in/booking`;

    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.API_KEY || ''
    };

    if (tokenCookie?.value) {
      headers['Authorization'] = `Bearer ${tokenCookie.value}`;
    }

    const body = await request.json();

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Check-in bulk POST error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
