import { sendEmail, EmailRequest } from '../src/capabilities/send-email';
import { createOAuthClient } from '../src/authentication/dynatrace-clients';

describe('Email functionality', () => {
  it('should create proper email request object', () => {
    const emailRequest: EmailRequest = {
      toRecipients: { emailAddresses: ['test@example.com'] },
      subject: 'Test Email',
      body: { contentType: 'text/plain', body: 'This is a test email' },
    };

    expect(emailRequest.toRecipients.emailAddresses).toEqual(['test@example.com']);
    expect(emailRequest.subject).toBe('Test Email');
    expect(emailRequest.body.contentType).toBe('text/plain');
    expect(emailRequest.body.body).toBe('This is a test email');
  });

  it('should handle optional CC and BCC recipients', () => {
    const emailRequest: EmailRequest = {
      toRecipients: { emailAddresses: ['to@example.com'] },
      ccRecipients: { emailAddresses: ['cc@example.com'] },
      bccRecipients: { emailAddresses: ['bcc@example.com'] },
      subject: 'Test Email with CC/BCC',
      body: { contentType: 'text/html', body: '<h1>Test</h1>' },
      notificationSettingsUrl: 'https://example.com/settings',
    };

    expect(emailRequest.ccRecipients?.emailAddresses).toEqual(['cc@example.com']);
    expect(emailRequest.bccRecipients?.emailAddresses).toEqual(['bcc@example.com']);
    expect(emailRequest.notificationSettingsUrl).toBe('https://example.com/settings');
  });
});
