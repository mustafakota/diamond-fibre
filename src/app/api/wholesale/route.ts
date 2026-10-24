import { NextResponse } from 'next/server';
import {
  handleWholesaleSubmission,
  type WholesalePayload,
} from '@/lib/email/wholesale-email';

export { handleWholesaleSubmission, type WholesalePayload };

export async function POST(request: Request) {
  try {
    const body: WholesalePayload = await request.json();
    const result = await handleWholesaleSubmission(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    console.error('[Wholesale Form Internal Error]: Exception caught in handler.');
    return NextResponse.json(
      { error: 'Enquiry processing encountered an internal server error' },
      { status: 500 }
    );
  }
}
