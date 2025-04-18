import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies;
    const tokenCookie = cookies.get('auth-token');
    
    if (!tokenCookie?.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const profileResponse = await fetch(`${new URL(request.url).origin}/api/customer/profile-image`, {
      headers: {
        Cookie: request.headers.get('cookie') || ''
      }
    });
    
    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch profile image data' },
        { status: profileResponse.status }
      );
    }
    
    const profileData = await profileResponse.json();
    
    if (!profileData.data?.presigned_url) {
      return NextResponse.json(
        { error: 'No presigned URL found' },
        { status: 500 }
      );
    }
    
    const presignedUrl = profileData.data.presigned_url;
    
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
        'Cache-Control': 'public, max-age=240',
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
