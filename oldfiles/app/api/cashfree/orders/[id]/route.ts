import { NextResponse } from 'next/server';

const CASHFREE_BASE_URL = 'https://api.cashfree.com/pg';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cashfreeApiKey = process.env.CASHFREE_API_KEY;
  const cashfreeAppId = process.env.CASHFREE_APP_ID;

  if (!cashfreeApiKey || !cashfreeAppId) {
    return NextResponse.json(
      { error: 'Cashfree credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${CASHFREE_BASE_URL}/orders/${params.id}`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-version': '2023-08-01',
          'x-client-id': cashfreeAppId,
          'x-client-secret': cashfreeApiKey,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cashfree API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      throw new Error(
        errorData.message || 
        `Cashfree API Error: ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cashfree API Request Failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
} 