import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const showId = id;

    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');

    if (!tokenCookie?.value) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_BASE_URL}/customer/booking/${showId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenCookie.value}`,
        'X-Api-Key': process.env.API_KEY || ''
      }
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Customer booking cancel API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
