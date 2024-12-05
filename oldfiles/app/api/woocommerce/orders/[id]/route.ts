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
    
    // Fetch order details
    const response = await fetch(
      `${baseUrl}/wp-json/wc/v3/orders/${params.id}`,
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
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      throw new Error(`WooCommerce API Error: ${response.statusText}`);
    }

    const order = await response.json();

    // Fetch order notes
    const notesResponse = await fetch(
      `${baseUrl}/wp-json/wc/v3/orders/${params.id}/notes`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!notesResponse.ok) {
      throw new Error(`WooCommerce API Error: ${notesResponse.statusText}`);
    }

    const notes = await notesResponse.json();

    // Combine order data with notes
    const orderWithNotes = {
      ...order,
      notes
    };

    return NextResponse.json(orderWithNotes);
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
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
} 