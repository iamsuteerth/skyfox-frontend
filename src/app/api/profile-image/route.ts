import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/utils/jwt-utils';
import { getProfileImageUrl } from '@/services/profile-service';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');
    
    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = tokenCookie.value;
    
    const user = getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const presignedUrl = await getProfileImageUrl(token);
    
    const imageResponse = await fetch(presignedUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: imageResponse.status }
      );
    }

    const imageData = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error proxying profile image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
