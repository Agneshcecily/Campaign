export class SendMailDto {
  to: string[];        // Recipients
  subject: string;     // Email subject
  html: string;        // Email body (HTML content)
}
