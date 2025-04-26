import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');

    if (!tokenCookie?.value) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const bookingData = await request.json();

    const response = await fetch(`${process.env.API_BASE_URL}/customer/booking/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenCookie.value}`,
        'X-Api-Key': process.env.API_KEY || ''
      },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Initialize customer booking API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
