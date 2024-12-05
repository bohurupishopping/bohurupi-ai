import { NextResponse } from 'next/server';

// Add interface for the Delhivery API response
interface DelhiveryShipment {
  Shipment: {
    Status: {
      Status: string;
      StatusDateTime: string;
      StatusLocation: string;
      Instructions: string;
    };
    Scans: Array<{
      ScanDetail: {
        Scan: string;
        ScanDateTime: string;
        ScanLocation: string;
        Instructions: string;
      };
    }>;
  };
}

interface DelhiveryResponse {
  ShipmentData: DelhiveryShipment[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const waybill = searchParams.get('waybill');

  if (!waybill) {
    return NextResponse.json(
      { error: 'Waybill is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://track.delhivery.com/api/v1/packages/json/?waybill=${waybill}`,
      {
        headers: {
          'Authorization': 'Token 572ba8d0f8fa11faf8fcebfe8f9a89bccbc6ba8b',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delhivery API Error:', errorText);
      throw new Error('Failed to fetch tracking data');
    }

    const data = await response.json();
    
    // Calculate estimated delivery date based on Delhivery's data
    const estimatedDelivery = calculateEstimatedDelivery(data);
    
    if (!data?.ShipmentData?.length) {
      return NextResponse.json({
        ShipmentData: [{
          Shipment: {
            Status: {
              Status: 'Not Found',
              StatusDateTime: new Date().toISOString(),
              StatusLocation: 'N/A',
              Instructions: 'No tracking information found for this waybill'
            },
            Scans: [],
            EstimatedDeliveryDate: null,
            PromisedDeliveryDate: null,
            ActualDeliveryDate: null
          }
        }]
      });
    }

    // Enhance the response with delivery dates
    const enhancedData = {
      ...data,
      ShipmentData: data.ShipmentData.map((shipment: DelhiveryShipment) => ({
        ...shipment,
        Shipment: {
          ...shipment.Shipment,
          EstimatedDeliveryDate: estimatedDelivery.estimated,
          PromisedDeliveryDate: estimatedDelivery.promised,
          ActualDeliveryDate: estimatedDelivery.actual
        }
      }))
    };

    return NextResponse.json(enhancedData);
    
  } catch (error) {
    console.error('Tracking API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}

function calculateEstimatedDelivery(data: DelhiveryResponse) {
  const shipment = data?.ShipmentData?.[0]?.Shipment;
  if (!shipment) return { estimated: null, promised: null, actual: null };

  const scans = shipment.Scans || [];
  const currentStatus = shipment.Status.Status.toLowerCase();
  const firstScanDate = scans[0]?.ScanDetail?.ScanDateTime;

  // If already delivered
  if (currentStatus.includes('delivered')) {
    const deliveryDate = shipment.Status.StatusDateTime;
    return {
      estimated: deliveryDate,
      promised: deliveryDate,
      actual: deliveryDate
    };
  }

  // Calculate estimated delivery based on first scan
  if (firstScanDate) {
    const pickupDate = new Date(firstScanDate);
    const estimatedDate = new Date(pickupDate);
    estimatedDate.setDate(pickupDate.getDate() + 3); // Standard 3-day delivery

    return {
      estimated: estimatedDate.toISOString(),
      promised: estimatedDate.toISOString(),
      actual: null
    };
  }

  return { estimated: null, promised: null, actual: null };
} 