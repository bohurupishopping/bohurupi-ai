import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const baseUrl = process.env.WOO_URL || 'https://bohurupi.com';
  const consumerKey = process.env.WOO_CONSUMER_KEY || '';
  const consumerSecret = process.env.WOO_CONSUMER_SECRET || '';

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/products/${params.id}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      throw new Error(`WooCommerce API Error: ${response.statusText}`);
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error('WooCommerce API Request Failed:', error);
    
    // Handle different error types
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
} 