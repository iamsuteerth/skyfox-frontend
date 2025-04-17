import { NextRequest, NextResponse } from 'next/server';
import { decodeToken } from '@/utils/jwt-utils';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');

    if (!tokenCookie?.value) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const token = tokenCookie.value;

    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Invalid token' },
        { status: 401 }
      );
    }

    let endpoint = '';
    switch (decodedToken.role) {
      case 'customer':
        endpoint = `${process.env.API_BASE_URL}/customer/profile`;
        break;
      case 'admin':
        endpoint = `${process.env.API_BASE_URL}/admin/profile`;
        break;
      case 'staff':
        endpoint = `${process.env.API_BASE_URL}/staff/profile`;
        break;
      default:
        return NextResponse.json(
          { status: 'ERROR', message: 'Invalid user role' },
          { status: 403 }
        );
    }

    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.API_KEY || '',
        'Authorization': `Bearer ${tokenCookie.value}`
      }
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile fetch API error:', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
