import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactRequestDto } from './dto/contact-request.dto';

interface ZohoTokenCache {
  token: string;
  expiresAt: number;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private tokenCache: ZohoTokenCache | null = null;

  constructor(private readonly configService: ConfigService) {}

  async submit(dto: ContactRequestDto) {
    const clientId = this.configService.get<string>('ZOHO_OAUTH_CLIENT_ID');
    const clientSecret = this.configService.get<string>('ZOHO_OAUTH_CLIENT_SECRET');
    const refreshToken = this.configService.get<string>('ZOHO_OAUTH_REFRESH_TOKEN');
    const accountId = this.configService.get<string>('ZOHO_MAIL_ACCOUNT_ID');
    const from = this.configService.get<string>('CONTACT_FROM_EMAIL');
    const to = this.configService.get<string>('CONTACT_TO_EMAIL');

    if (!clientId || !clientSecret || !refreshToken || !accountId || !from || !to) {
      throw new ServiceUnavailableException('Contact form is not configured');
    }

    const subjectPrefix = dto.lang === 'az' ? '[Əlaqə forması]' : '[Contact form]';
    const subject = `${subjectPrefix} ${dto.subject?.trim() || dto.name.trim()}`;

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; color:#111; line-height:1.6">
        <h2 style="margin:0 0 16px">${subjectPrefix}</h2>
        <p><strong>Name:</strong> ${escapeHtml(dto.name.trim())}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(dto.email.trim())}">${escapeHtml(dto.email.trim())}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(dto.phone?.trim() || '-')}</p>
        <p><strong>Language:</strong> ${escapeHtml(dto.lang || 'az')}</p>
        <div style="margin-top:24px">
          <strong>Message:</strong>
          <p style="white-space:pre-wrap">${escapeHtml(dto.message.trim())}</p>
        </div>
      </div>
    `;

    try {
      const accessToken = await this.getAccessToken(clientId, clientSecret, refreshToken);
      await this.sendViaZoho(accessToken, accountId, { from, to, subject, html });
    } catch (error) {
      this.logger.error(
        'Failed to send contact email',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to send contact email');
    }

    return { success: true };
  }

  private async getAccessToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
  ): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.expiresAt > now + 60_000) {
      return this.tokenCache.token;
    }

    const accountsBase =
      this.configService.get<string>('ZOHO_OAUTH_BASE_URL') || 'https://accounts.zoho.com';

    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    });

    const res = await fetch(`${accountsBase}/oauth/v2/token`, {
      method: 'POST',
      body: params,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Zoho token refresh failed: ${res.status} ${body}`);
    }

    const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
    if (!data.access_token) {
      throw new Error(`Zoho token refresh returned no access_token: ${JSON.stringify(data)}`);
    }

    const expiresInMs = (data.expires_in ?? 3600) * 1000;
    this.tokenCache = { token: data.access_token, expiresAt: now + expiresInMs };
    return data.access_token;
  }

  private async sendViaZoho(
    accessToken: string,
    accountId: string,
    msg: { from: string; to: string; subject: string; html: string },
  ): Promise<void> {
    const mailBase =
      this.configService.get<string>('ZOHO_MAIL_API_BASE_URL') || 'https://mail.zoho.com';

    const res = await fetch(`${mailBase}/api/accounts/${accountId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromAddress: msg.from,
        toAddress: msg.to,
        subject: msg.subject,
        content: msg.html,
        mailFormat: 'html',
        askReceipt: 'no',
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Zoho Mail send failed: ${res.status} ${body}`);
    }

    const data = (await res.json()) as { status?: { code?: number; description?: string } };
    if (data.status?.code && data.status.code !== 200) {
      throw new Error(`Zoho Mail send rejected: ${JSON.stringify(data.status)}`);
    }
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
