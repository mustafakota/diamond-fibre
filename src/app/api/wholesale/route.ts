import { NextResponse } from 'next/server';
import {
  getWholesaleEmailConfig,
  sendWholesaleEmail,
  WholesaleEmailPayload,
  ResendClientInterface,
} from '@/lib/email/wholesale-email';

export type WholesalePayload = WholesaleEmailPayload & {
  hp_field?: string;
};

export interface WholesaleSubmissionOptions {
  env?: NodeJS.ProcessEnv;
  resendClient?: ResendClientInterface;
}

/**
 * Handles wholesale enquiry submission with validation, honeypot protection,
 * zero PII logging, and delivery via Resend email boundary.
 */
export async function handleWholesaleSubmission(
  body: WholesalePayload,
  options: WholesaleSubmissionOptions = {}
): Promise<{ status: number; body: Record<string, unknown> }> {
  // 1. Spam Protection: Honeypot check
  if (body.hp_field && body.hp_field.trim() !== '') {
    // Silently discard automated bot submission without invoking email provider
    return {
      status: 200,
      body: { success: true, accepted: false },
    };
  }

  // 2. Strict Server-Side Validation
  if (!body.fullName || body.fullName.trim().length < 2) {
    return { status: 400, body: { error: 'Valid contact name is required' } };
  }
  if (!body.businessName || body.businessName.trim().length < 2) {
    return { status: 400, body: { error: 'Valid business name is required' } };
  }

  const cleanPhone = (body.mobileNumber || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      status: 400,
      body: { error: 'Valid 10-digit Indian mobile number is required' },
    };
  }

  if (!Array.isArray(body.categories) || body.categories.length === 0) {
    return {
      status: 400,
      body: { error: 'At least one product category must be selected' },
    };
  }

  if (!body.estimatedQuantity || body.estimatedQuantity.trim().length === 0) {
    return {
      status: 400,
      body: { error: 'Estimated quantity requirement is required' },
    };
  }

  if (!body.destinationLocation || body.destinationLocation.trim().length === 0) {
    return {
      status: 400,
      body: { error: 'Destination city and state is required' },
    };
  }

  // 3. Operational Logging (Zero PII: no names, phone numbers, destinations or full payloads)
  console.info('[Wholesale Form Submission Received]:', {
    timestamp: new Date().toISOString(),
    categoryCount: body.categories.length,
    hasNotes: Boolean(body.notes && body.notes.trim().length > 0),
    preferredContact: body.preferredContact,
  });

  // 4. Provider Verification: Strictly require configured, non-placeholder destination & credentials
  const env = options.env || process.env;
  const configResult = getWholesaleEmailConfig(env);

  if (!configResult.configured) {
    console.warn(
      `[Wholesale API Notice]: ${configResult.reason} Returning 503 Service Unavailable.`
    );
    return {
      status: 503,
      body: {
        success: false,
        accepted: false,
        code: configResult.code,
        message:
          'Online submission is not yet configured. Please contact our sales desk directly via WhatsApp.',
      },
    };
  }

  // 5. Safe Email Dispatch via Resend Boundary
  const sendResult = await sendWholesaleEmail(body, {
    config: configResult.config,
    resendClient: options.resendClient,
  });

  if (!sendResult.success) {
    return {
      status: 503,
      body: {
        success: false,
        accepted: false,
        code: sendResult.code || 'EMAIL_DISPATCH_FAILED',
        message:
          'We were unable to deliver your enquiry via email at this time. Please contact our sales desk directly via WhatsApp.',
      },
    };
  }

  // 6. Return 200 ONLY after provider accepts the message
  return {
    status: 200,
    body: {
      success: true,
      accepted: true,
      message: 'Enquiry accepted by transmission provider.',
    },
  };
}

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
