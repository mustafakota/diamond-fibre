import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWholesaleEmailConfig,
  buildWholesaleEmailText,
  buildWholesaleEmailHtml,
  escapeHtml,
  sendWholesaleEmail,
  handleWholesaleSubmission,
} from '../src/lib/email/wholesale-email.ts';

// Mock Resend Client factory for isolated, zero-network tests
function createMockResendClient(options = {}) {
  const calls = [];
  return {
    calls,
    emails: {
      async send(params) {
        calls.push(params);
        if (options.shouldThrow) {
          throw new Error(options.errorMessage || 'Network timeout connecting to provider');
        }
        if (options.shouldReturnError) {
          return {
            data: null,
            error: {
              name: 'validation_error',
              message: options.errorMessage || 'Sender domain not verified in Resend',
            },
          };
        }
        return {
          data: { id: options.messageId || 'resend_msg_test_abc123' },
          error: null,
        };
      },
    },
  };
}

const validPayload = {
  fullName: 'Rajesh Sharma',
  businessName: 'Sharma Textiles Ratlam',
  mobileNumber: '9876543210',
  preferredContact: 'whatsapp',
  categories: ['mattresses', 'pillows'],
  estimatedQuantity: '50 units',
  destinationLocation: 'Indore, MP',
  customSizes: true,
  privateLabel: false,
  notes: 'Requires delivery before festive season.',
};

const validEnv = {
  RESEND_API_KEY: 're_test_live_key_99999999999',
  WHOLESALE_RECIPIENT_EMAIL: 'owner.diamondfibre@gmail.com',
  WHOLESALE_FROM_EMAIL: 'Diamond Fibre <wholesale@diamondfibre.com>',
};

test('Wholesale Configuration Guard: enforces strict credential and domain requirements', () => {
  // Missing API key
  const missingKey = getWholesaleEmailConfig({
    WHOLESALE_RECIPIENT_EMAIL: 'owner@gmail.com',
    WHOLESALE_FROM_EMAIL: 'orders@diamondfibre.com',
  });
  assert.equal(missingKey.configured, false);
  assert.equal(missingKey.code, 'PROVIDER_CREDENTIALS_MISSING');

  // Placeholder recipient email
  const placeholderRecipient = getWholesaleEmailConfig({
    RESEND_API_KEY: 're_123456789',
    WHOLESALE_RECIPIENT_EMAIL: 'placeholder-pending-confirmation@example.com',
    WHOLESALE_FROM_EMAIL: 'orders@diamondfibre.com',
  });
  assert.equal(placeholderRecipient.configured, false);
  assert.equal(placeholderRecipient.code, 'PROVIDER_NOT_CONFIGURED');

  // Missing or invalid sender email
  const missingSender = getWholesaleEmailConfig({
    RESEND_API_KEY: 're_123456789',
    WHOLESALE_RECIPIENT_EMAIL: 'owner@gmail.com',
    WHOLESALE_FROM_EMAIL: '',
  });
  assert.equal(missingSender.configured, false);
  assert.equal(missingSender.code, 'PROVIDER_NOT_CONFIGURED');

  // Valid configuration
  const valid = getWholesaleEmailConfig(validEnv);
  assert.equal(valid.configured, true);
  if (valid.configured) {
    assert.equal(valid.config.recipientEmail, 'owner.diamondfibre@gmail.com');
    assert.equal(valid.config.fromEmail, 'Diamond Fibre <wholesale@diamondfibre.com>');
    assert.equal(valid.config.apiKey, 're_test_live_key_99999999999');
  }
});

test('Wholesale Submission: valid payload invokes mocked sender exactly once with safe parameters', async () => {
  const mockClient = createMockResendClient();

  const response = await handleWholesaleSubmission(validPayload, {
    env: validEnv,
    resendClient: mockClient,
  });

  // Verify response
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.accepted, true);

  // Verify sender was invoked exactly once (no duplicate emails)
  assert.equal(mockClient.calls.length, 1);
  const sent = mockClient.calls[0];

  assert.equal(sent.to, 'owner.diamondfibre@gmail.com');
  assert.equal(sent.from, 'Diamond Fibre <wholesale@diamondfibre.com>');
  assert.ok(sent.subject.includes('New Diamond Fibre Wholesale Enquiry'));
  assert.ok(sent.subject.includes('Sharma Textiles Ratlam'));

  // Assert Reply-To is NOT set when no customer email was collected
  assert.equal(sent.replyTo, undefined);

  // Assert plain-text and HTML formatting
  assert.ok(sent.text.includes('Rajesh Sharma'));
  assert.ok(sent.text.includes('Sharma Textiles Ratlam'));
  assert.ok(sent.text.includes('9876543210'));
  assert.ok(sent.html.includes('Sharma Textiles Ratlam'));
  assert.ok(sent.html.includes('Mattresses (Gaddas)'));
});

test('Wholesale Submission: rejects invalid inputs without invoking sender', async () => {
  const testCases = [
    { payload: { ...validPayload, fullName: '' }, errorSubstr: 'contact name' },
    { payload: { ...validPayload, fullName: 'a' }, errorSubstr: 'contact name' },
    { payload: { ...validPayload, mobileNumber: '12345' }, errorSubstr: 'mobile number' },
    { payload: { ...validPayload, mobileNumber: 'abcdefghij' }, errorSubstr: 'mobile number' },
    { payload: { ...validPayload, categories: [] }, errorSubstr: 'category' },
  ];

  for (const tc of testCases) {
    const mockClient = createMockResendClient();
    const res = await handleWholesaleSubmission(tc.payload, {
      env: validEnv,
      resendClient: mockClient,
    });
    assert.equal(res.status, 400, `Expected 400 for payload error: ${tc.errorSubstr}`);
    assert.ok(res.body.error.toLowerCase().includes(tc.errorSubstr.toLowerCase()));
    assert.equal(mockClient.calls.length, 0, 'Sender must not be invoked for invalid inputs');
  }
});

test('Wholesale Submission: allows optional business name, estimated quantity, and destination location', async () => {
  const minimalPayload = {
    fullName: 'Rajesh Sharma',
    mobileNumber: '9876543210',
    preferredContact: 'whatsapp',
    categories: ['mattresses'],
  };

  const mockClient = createMockResendClient();
  const res = await handleWholesaleSubmission(minimalPayload, {
    env: validEnv,
    resendClient: mockClient,
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.accepted, true);
  assert.equal(mockClient.calls.length, 1);
});

test('Wholesale Submission: silently discards honeypot bot payloads without sending email', async () => {
  const mockClient = createMockResendClient();
  const botPayload = {
    ...validPayload,
    fullName: 'Spam Bot',
    hp_field: 'http://malicious-link.ru/offer',
  };

  const response = await handleWholesaleSubmission(botPayload, {
    env: validEnv,
    resendClient: mockClient,
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.accepted, false);
  assert.equal(mockClient.calls.length, 0, 'Email must never be sent for honeypot bot submissions');
});

test('Wholesale Submission: unconfigured provider returns 503 and preserves WhatsApp fallback', async () => {
  const mockClient = createMockResendClient();

  // Test missing API key
  const res1 = await handleWholesaleSubmission(validPayload, {
    env: { WHOLESALE_RECIPIENT_EMAIL: 'owner@gmail.com' },
    resendClient: mockClient,
  });
  assert.equal(res1.status, 503);
  assert.equal(res1.body.success, false);
  assert.equal(res1.body.accepted, false);
  assert.equal(res1.body.code, 'PROVIDER_CREDENTIALS_MISSING');
  assert.ok(res1.body.message.includes('WhatsApp'));
  assert.equal(mockClient.calls.length, 0);

  // Test placeholder recipient email
  const res2 = await handleWholesaleSubmission(validPayload, {
    env: {
      RESEND_API_KEY: 're_123456789',
      WHOLESALE_RECIPIENT_EMAIL: 'placeholder-pending-confirmation@example.com',
    },
    resendClient: mockClient,
  });
  assert.equal(res2.status, 503);
  assert.equal(res2.body.success, false);
  assert.equal(res2.body.accepted, false);
  assert.equal(res2.body.code, 'PROVIDER_NOT_CONFIGURED');
  assert.ok(res2.body.message.includes('WhatsApp'));
  assert.equal(mockClient.calls.length, 0);
});

test('Wholesale Submission: provider rejection produces truthful failure response with WhatsApp fallback', async () => {
  const mockClient = createMockResendClient({
    shouldReturnError: true,
    errorMessage: 'Domain diamondfibre.com is not verified in Resend',
  });

  const response = await handleWholesaleSubmission(validPayload, {
    env: validEnv,
    resendClient: mockClient,
  });

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.accepted, false);
  assert.equal(response.body.code, 'EMAIL_DISPATCH_FAILED');
  assert.ok(response.body.message.includes('WhatsApp'));
  assert.equal(mockClient.calls.length, 1);
});

test('Wholesale Submission: transport/network exception returns safe 503 without leaking credentials', async () => {
  const mockClient = createMockResendClient({
    shouldThrow: true,
    errorMessage: 'ETIMEDOUT connecting to api.resend.com',
  });

  const response = await handleWholesaleSubmission(validPayload, {
    env: validEnv,
    resendClient: mockClient,
  });

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.accepted, false);
  assert.equal(response.body.code, 'EMAIL_DISPATCH_FAILED');
  assert.ok(response.body.message.includes('WhatsApp'));
});

test('Wholesale Zero-PII Log Guard: customer name, phone, and location are never logged', async () => {
  const mockClient = createMockResendClient();
  const loggedMessages = [];

  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  const captureLog = (...args) => {
    loggedMessages.push(JSON.stringify(args));
  };

  console.info = captureLog;
  console.warn = captureLog;
  console.error = captureLog;

  try {
    await handleWholesaleSubmission(validPayload, {
      env: validEnv,
      resendClient: mockClient,
    });
  } finally {
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  }

  const allLogs = loggedMessages.join(' ');

  // Customer PII must NEVER appear in server logs
  assert.equal(allLogs.includes('9876543210'), false, 'Customer phone number must not be logged');
  assert.equal(allLogs.includes('Rajesh Sharma'), false, 'Customer name must not be logged');
  assert.equal(allLogs.includes('Indore, MP'), false, 'Customer location must not be logged');
  assert.equal(allLogs.includes('re_test_live_key'), false, 'API key must not be logged');
});

test('Wholesale HTML Security: properly escapes all untrusted user content', () => {
  const xssPayload = {
    ...validPayload,
    fullName: '<script>alert("XSS")</script>',
    businessName: 'Sharma & "Sons" <Bedding>',
    destinationLocation: "City's Central & West <District>",
    notes: 'Hello <img src=x onerror=alert(1)> & goodbye',
  };

  const html = buildWholesaleEmailHtml(xssPayload);

  // Unescaped tags must NOT be present
  assert.equal(html.includes('<script>'), false);
  assert.equal(html.includes('<img src=x'), false);

  // Escaped entities must be present
  assert.ok(html.includes('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'));
  assert.ok(html.includes('Sharma &amp; &quot;Sons&quot; &lt;Bedding&gt;'));
  assert.ok(html.includes('City&#39;s Central &amp; West &lt;District&gt;'));
});
