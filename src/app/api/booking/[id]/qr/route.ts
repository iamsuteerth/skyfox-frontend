import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');
    if (!tokenCookie?.value) {
      return NextResponse.json({ status: "ERROR", message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/booking/${id}/qr`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.API_KEY || '',
          'Authorization': `Bearer ${tokenCookie.value}`,
        }
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Download ticket API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}