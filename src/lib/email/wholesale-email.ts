import { Resend } from 'resend';

export interface WholesaleEmailPayload {
  fullName: string;
  businessName?: string;
  mobileNumber: string;
  preferredContact: 'whatsapp' | 'phone';
  categories: string[];
  estimatedQuantity?: string;
  destinationLocation?: string;
  purchaseType?: string;
  customSizes?: boolean;
  privateLabel?: boolean;
  notes?: string;
  customerEmail?: string;
}

export type WholesalePayload = WholesaleEmailPayload & {
  hp_field?: string;
};

export interface WholesaleEmailConfig {
  apiKey: string;
  recipientEmail: string;
  fromEmail: string;
}

export type EmailConfigResult =
  | { configured: true; config: WholesaleEmailConfig }
  | {
      configured: false;
      code: 'PROVIDER_NOT_CONFIGURED' | 'PROVIDER_CREDENTIALS_MISSING';
      reason: string;
    };

export interface ResendSendResponse {
  data: { id: string } | null;
  error: { message: string; name?: string } | null;
}

export interface ResendClientInterface {
  emails: {
    send(params: {
      from: string;
      to: string | string[];
      subject: string;
      html: string;
      text: string;
      replyTo?: string;
      headers?: Record<string, string>;
    }): Promise<ResendSendResponse>;
  };
}

/**
 * Escapes untrusted user input for safe embedding inside HTML emails.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  mattresses: 'Mattresses (Gaddas)',
  pillows: 'Pillows',
  razais: 'Razais',
  blankets: 'Blankets',
};

export function formatCategoryList(categories: string[]): string {
  if (!Array.isArray(categories)) return '';
  return categories
    .map((cat) => CATEGORY_DISPLAY_NAMES[cat] || cat)
    .join(', ');
}

/**
 * Validates and retrieves server-side environment configuration.
 *
 * Requirements:
 * - RESEND_API_KEY: Resend API token (re_...)
 * - WHOLESALE_RECIPIENT_EMAIL: The owner's destination inbox (e.g. Gmail)
 * - WHOLESALE_FROM_EMAIL: A verified sending identity (e.g. wholesale@diamondfibre.com or onboarding@resend.dev)
 *
 * NOTE: Senders must use a domain or address authorized in Resend. A personal @gmail.com
 * address cannot be used as the FROM sender because of SPF/DKIM restrictions.
 */
export function getWholesaleEmailConfig(env = process.env): EmailConfigResult {
  const apiKey = env.RESEND_API_KEY?.trim();
  const recipientEmail = env.WHOLESALE_RECIPIENT_EMAIL?.trim();
  const fromEmail = env.WHOLESALE_FROM_EMAIL?.trim();

  // Validate recipient email
  const isRecipientMissingOrPlaceholder =
    !recipientEmail ||
    recipientEmail.includes('placeholder-pending-confirmation') ||
    recipientEmail.includes('@example.com') ||
    !recipientEmail.includes('@');

  if (isRecipientMissingOrPlaceholder) {
    return {
      configured: false,
      code: 'PROVIDER_NOT_CONFIGURED',
      reason: 'Wholesale recipient email destination is unconfigured or a placeholder.',
    };
  }

  // Validate API key
  if (!apiKey || apiKey.length < 5) {
    return {
      configured: false,
      code: 'PROVIDER_CREDENTIALS_MISSING',
      reason: 'Resend API key credentials are not configured.',
    };
  }

  // Validate from address
  const isFromMissingOrPlaceholder =
    !fromEmail ||
    fromEmail.includes('placeholder') ||
    !fromEmail.includes('@');

  if (isFromMissingOrPlaceholder) {
    return {
      configured: false,
      code: 'PROVIDER_NOT_CONFIGURED',
      reason: 'Wholesale from email address is unconfigured or a placeholder.',
    };
  }

  return {
    configured: true,
    config: {
      apiKey,
      recipientEmail,
      fromEmail,
    },
  };
}

/**
 * Builds clean plain-text content for the wholesale enquiry email.
 */
export function buildWholesaleEmailText(
  payload: WholesaleEmailPayload,
  timestamp = new Date().toISOString()
): string {
  const categoriesText = formatCategoryList(payload.categories);
  const safeBusiness = payload.businessName?.replace(/[\r\n]+/g, ' ').trim() || '(Not provided)';
  const safeName = payload.fullName.replace(/[\r\n]+/g, ' ').trim();
  const safePhone = payload.mobileNumber.replace(/[\r\n]+/g, ' ').trim();
  const safeLocation = payload.destinationLocation?.replace(/[\r\n]+/g, ' ').trim() || 'To be confirmed';
  const safeQuantity = payload.estimatedQuantity?.replace(/[\r\n]+/g, ' ').trim() || 'Not specified';
  const safeNotes = payload.notes?.trim() || '(None provided)';

  return `NEW DIAMOND FIBRE WHOLESALE ENQUIRY
========================================

Contact Name:        ${safeName}
Business / Firm:     ${safeBusiness}
Mobile Number:       ${safePhone}
Preferred Contact:   ${payload.preferredContact === 'phone' ? 'Phone Call' : 'WhatsApp'}

Selected Categories: ${categoriesText}
Estimated Quantity:  ${safeQuantity}
Delivery Location:   ${safeLocation}

Additional Notes:
${safeNotes}

========================================
Submitted at: ${timestamp}
Platform: Diamond Fibre Official Website (B2B Wholesale Ingestion Desk)
`;
}

/**
 * Builds HTML content for the wholesale enquiry email with full HTML escaping on user content.
 */
export function buildWholesaleEmailHtml(
  payload: WholesaleEmailPayload,
  timestamp = new Date().toISOString()
): string {
  const categoriesText = escapeHtml(formatCategoryList(payload.categories));
  const safeName = escapeHtml(payload.fullName.trim());
  const safeBusiness = escapeHtml(payload.businessName?.trim() || '(Not provided)');
  const safePhone = escapeHtml(payload.mobileNumber.trim());
  const safeLocation = escapeHtml(payload.destinationLocation?.trim() || 'To be confirmed');
  const safeQuantity = escapeHtml(payload.estimatedQuantity?.trim() || 'Not specified');
  const safeNotes = payload.notes?.trim()
    ? escapeHtml(payload.notes.trim()).replace(/\n/g, '<br/>')
    : '<em>(None provided)</em>';
  const safeContactPref = payload.preferredContact === 'phone' ? 'Phone Call' : 'WhatsApp';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Diamond Fibre Wholesale Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3efe7; color: #22231f; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5dcce; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background-color: #1a1b17; color: #fdf5f2; padding: 22px 28px; border-bottom: 3px solid #bf4d28;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff;">DIAMOND FIBRE</h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #d9ccb6;">New B2B Wholesale & Reseller Enquiry</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.5;">
        <tbody>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44; width: 38%;">Contact Name:</td>
            <td style="padding: 10px 0; color: #1a1b17; font-weight: 500;">${safeName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44;">Business / Firm:</td>
            <td style="padding: 10px 0; color: #1a1b17; font-weight: 700;">${safeBusiness}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44;">Mobile Number:</td>
            <td style="padding: 10px 0; color: #1a1b17; font-weight: 600; font-family: monospace, monospace;">${safePhone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44;">Preferred Contact:</td>
            <td style="padding: 10px 0; color: #1a1b17; font-weight: 500;">${safeContactPref}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44;">Categories:</td>
            <td style="padding: 10px 0; color: #1a1b17;">${categoriesText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44;">Estimated Quantity:</td>
            <td style="padding: 10px 0; color: #1a1b17; font-weight: 600;">${safeQuantity}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3efe7;">
            <td style="padding: 10px 0; font-weight: 600; color: #4a4b44;">Destination City & State:</td>
            <td style="padding: 10px 0; color: #1a1b17;">${safeLocation}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0 6px; font-weight: 600; color: #4a4b44; vertical-align: top;">Additional Notes:</td>
            <td style="padding: 12px 0 6px; color: #1a1b17; line-height: 1.6;">${safeNotes}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background-color: #faf8f4; border-top: 1px solid #e5dcce; padding: 16px 28px; font-size: 12px; color: #4a4b44; line-height: 1.4;">
      <div>Submitted at ${escapeHtml(timestamp)} UTC</div>
      <div style="margin-top: 2px; color: #76776e;">Diamond Fibre B2B Enquiry Desk • Ratlam, Madhya Pradesh</div>
    </div>
  </div>
</body>
</html>`;
}

export interface SendWholesaleEmailOptions {
  config?: WholesaleEmailConfig;
  resendClient?: ResendClientInterface;
  now?: () => string;
}

export type SendWholesaleEmailResult =
  | { success: true; messageId: string }
  | { success: false; code: string; error: string };

/**
 * Sends a wholesale enquiry notification email using Resend.
 *
 * Guarantees:
 * - Invokes client at most once per call (no duplicate sending).
 * - Leaves Reply-To undefined when customer email is not collected.
 * - Logs zero PII (no customer names, phone numbers, or addresses).
 */
export async function sendWholesaleEmail(
  payload: WholesaleEmailPayload,
  options: SendWholesaleEmailOptions = {}
): Promise<SendWholesaleEmailResult> {
  const config =
    options.config ||
    (getWholesaleEmailConfig().configured
      ? (getWholesaleEmailConfig() as { configured: true; config: WholesaleEmailConfig }).config
      : null);

  if (!config) {
    return {
      success: false,
      code: 'PROVIDER_NOT_CONFIGURED',
      error: 'Email delivery provider is not configured.',
    };
  }

  const timestamp = options.now ? options.now() : new Date().toISOString();
  const safeBusiness = payload.businessName ? payload.businessName.replace(/[\r\n]+/g, ' ').trim() : '';
  const subject = safeBusiness
    ? `New Diamond Fibre Wholesale Enquiry - ${safeBusiness}`
    : 'New Diamond Fibre Wholesale Enquiry';

  const textBody = buildWholesaleEmailText(payload, timestamp);
  const htmlBody = buildWholesaleEmailHtml(payload, timestamp);

  // Set Reply-To ONLY if an actual customer email was submitted and validated.
  // When not collected (standard form collects mobile number), leave replyTo undefined.
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const replyTo =
    payload.customerEmail && validEmailRegex.test(payload.customerEmail.trim())
      ? payload.customerEmail.trim()
      : undefined;

  const client: ResendClientInterface =
    options.resendClient || (new Resend(config.apiKey) as unknown as ResendClientInterface);

  try {
    const response = await client.emails.send({
      from: config.fromEmail,
      to: config.recipientEmail,
      subject,
      html: htmlBody,
      text: textBody,
      ...(replyTo ? { replyTo } : {}),
      headers: {
        'X-Entity-Ref-ID': `diamond-fibre-wholesale-${Date.now()}`,
      },
    });

    if (response.error) {
      // Log sanitized error indicator without exposing PII or credentials
      console.error('[Wholesale Email Delivery Error]: Provider rejected message.', {
        errorName: response.error.name || 'ResendError',
      });
      return {
        success: false,
        code: 'EMAIL_DISPATCH_FAILED',
        error: response.error.message || 'Email delivery provider rejected message.',
      };
    }

    if (!response.data?.id) {
      console.error('[Wholesale Email Delivery Error]: No message ID returned from provider.');
      return {
        success: false,
        code: 'EMAIL_DISPATCH_FAILED',
        error: 'No message ID returned from provider.',
      };
    }

    // Operational logging with zero customer PII
    console.info('[Wholesale Email Sent Successfully]:', {
      messageId: response.data.id,
      categoryCount: payload.categories.length,
      hasNotes: Boolean(payload.notes && payload.notes.trim().length > 0),
    });

    return {
      success: true,
      messageId: response.data.id,
    };
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    console.error('[Wholesale Email Delivery Exception]: Caught unexpected error during dispatch.', {
      errorName: error?.name || 'UnknownError',
    });
    return {
      success: false,
      code: 'EMAIL_DISPATCH_FAILED',
      error: error?.message || 'Unexpected error occurred during email delivery.',
    };
  }
}

export interface WholesaleSubmissionOptions {
  env?: NodeJS.ProcessEnv;
  resendClient?: ResendClientInterface;
  now?: () => string;
}

export interface WholesaleSubmissionResult {
  status: number;
  body: {
    success?: boolean;
    accepted?: boolean;
    error?: string;
    code?: string;
    message?: string;
  };
}

/**
 * Handles wholesale enquiry submission with validation, honeypot protection,
 * zero PII logging, and delivery via Resend email boundary.
 */
export async function handleWholesaleSubmission(
  body: WholesalePayload,
  options: WholesaleSubmissionOptions = {}
): Promise<WholesaleSubmissionResult> {
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
    now: options.now,
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
