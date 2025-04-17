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

    const imageData = await request.json();

    const response = await fetch(`${process.env.API_BASE_URL}/customer/update-profile-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.API_KEY || '',
        'Authorization': `Bearer ${tokenCookie.value}`
      },
      body: JSON.stringify(imageData)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Update profile image API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
