import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = process.env.WOO_URL || 'https://bohurupi.com';
  const consumerKey = process.env.WOO_CONSUMER_KEY || '';
  const consumerSecret = process.env.WOO_CONSUMER_SECRET || '';

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const queryString = searchParams.toString();
    
    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/orders${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`WooCommerce API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const total = response.headers.get('X-WP-Total');
    const totalPages = response.headers.get('X-WP-TotalPages');

    // Create response with headers
    const nextResponse = NextResponse.json(data);
    
    // Forward WooCommerce pagination headers
    if (total) nextResponse.headers.set('X-WP-Total', total);
    if (totalPages) nextResponse.headers.set('X-WP-TotalPages', totalPages);

    return nextResponse;
  } catch (error) {
    console.error('WooCommerce API Request Failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 