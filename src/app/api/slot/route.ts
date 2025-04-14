import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let url = `${process.env.API_BASE_URL}/slot`;
    
    const date = searchParams.get('date');
    if (date) {
      url += `?date=${date}`;
    }
    
    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.API_KEY || ''
    };
    
    if (tokenCookie?.value) {
      headers['Authorization'] = `Bearer ${tokenCookie.value}`;
    }
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Slots API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
