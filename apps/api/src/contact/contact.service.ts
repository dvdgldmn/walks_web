import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { ContactRequestDto } from './dto/contact-request.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly configService: ConfigService) {}

  async submit(dto: ContactRequestDto) {
    const host = this.configService.get<string>('CONTACT_SMTP_HOST');
    const port = Number(this.configService.get<string>('CONTACT_SMTP_PORT') || '587');
    const user = this.configService.get<string>('CONTACT_SMTP_USER');
    const pass = this.configService.get<string>('CONTACT_SMTP_PASS');
    const secure =
      String(this.configService.get<string>('CONTACT_SMTP_SECURE') || 'false').toLowerCase() ===
      'true';
    const from =
      this.configService.get<string>('CONTACT_FROM_EMAIL') || user || 'no-reply@localhost';
    const to = this.configService.get<string>('CONTACT_TO_EMAIL');

    if (!host || !user || !pass || !to) {
      throw new ServiceUnavailableException('Contact form is not configured');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const subjectPrefix = dto.lang === 'az' ? '[Əlaqə forması]' : '[Contact form]';
    const subject = `${subjectPrefix} ${dto.subject?.trim() || dto.name.trim()}`;
    const phoneLine = dto.phone?.trim() ? `Phone: ${dto.phone.trim()}` : 'Phone: -';

    const text = [
      `Name: ${dto.name.trim()}`,
      `Email: ${dto.email.trim()}`,
      phoneLine,
      `Language: ${dto.lang || 'az'}`,
      '',
      'Message:',
      dto.message.trim(),
    ].join('\n');

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; color:#111; line-height:1.6">
        <h2 style="margin:0 0 16px">${subjectPrefix}</h2>
        <p><strong>Name:</strong> ${escapeHtml(dto.name.trim())}</p>
        <p><strong>Email:</strong> ${escapeHtml(dto.email.trim())}</p>
        <p><strong>Phone:</strong> ${escapeHtml(dto.phone?.trim() || '-')}</p>
        <p><strong>Language:</strong> ${escapeHtml(dto.lang || 'az')}</p>
        <div style="margin-top:24px">
          <strong>Message:</strong>
          <p style="white-space:pre-wrap">${escapeHtml(dto.message.trim())}</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from,
        to,
        replyTo: dto.email.trim(),
        subject,
        text,
        html,
      });
    } catch (error) {
      this.logger.error(
        'Failed to send contact email',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to send contact email');
    }

    return { success: true };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
