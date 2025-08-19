import { _OAuthHttpClient } from '@dynatrace-sdk/http-client';

export interface EmailRecipients {
  emailAddresses: string[];
}

export interface EmailBody {
  contentType: 'text/plain' | 'text/html';
  body: string;
}

export interface EmailRequest {
  toRecipients: EmailRecipients;
  ccRecipients?: EmailRecipients;
  bccRecipients?: EmailRecipients;
  subject: string;
  body: EmailBody;
  notificationSettingsUrl?: string;
}

export interface EmailResponse {
  requestId: string;
  message: string;
  rejectedDestinations: {
    bouncingDestinations: string[];
    complainingDestinations: string[];
  };
  invalidDestinations: string[];
}

export const sendEmail = async (
  dtClient: _OAuthHttpClient,
  emailRequest: EmailRequest,
): Promise<string> => {
  try {
    const response = await dtClient.send({
      method: 'POST',
      url: '/platform/email/v1/emails',
      body: emailRequest,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      statusValidator: (status: number) => {
        return [202].includes(status);
      },
    });

    const result = await response.body('json') as EmailResponse;
    if (result) {
      let responseMessage = `Email sent successfully! Request ID: ${result.requestId}\n`;
      responseMessage += `Message: ${result.message}\n`;
      
      if (result.invalidDestinations && result.invalidDestinations.length > 0) {
        responseMessage += `Invalid destinations: ${result.invalidDestinations.join(', ')}\n`;
      }
      
      if (result.rejectedDestinations.bouncingDestinations.length > 0) {
        responseMessage += `Bouncing destinations: ${result.rejectedDestinations.bouncingDestinations.join(', ')}\n`;
      }
      
      if (result.rejectedDestinations.complainingDestinations.length > 0) {
        responseMessage += `Complaining destinations: ${result.rejectedDestinations.complainingDestinations.join(', ')}\n`;
      }
      
      return responseMessage;
    }

    return 'Email sent successfully, but no response data received.';
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error;
      
      if (errorData) {
        let errorMessage = `Failed to send email (${status}): ${errorData.message}`;
        
        if (errorData.details?.errorCode) {
          errorMessage += ` (Error Code: ${errorData.details.errorCode})`;
        }
        
        if (errorData.details?.additionalDetails) {
          const details = errorData.details.additionalDetails;
          if (details.limit && details.value) {
            errorMessage += ` - Current: ${details.value}, Limit: ${details.limit}`;
          }
        }
        
        if (errorData.retryAfterSeconds) {
          errorMessage += ` - Retry after ${errorData.retryAfterSeconds} seconds`;
        }
        
        return errorMessage;
      }
      
      return `Failed to send email: HTTP ${status}`;
    }
    
    return `Error sending email: ${error.message}`;
  }
};
