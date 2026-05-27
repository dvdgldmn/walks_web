import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { ContactRequestDto } from './dto/contact-request.dto';
import { ContactService } from './contact.service';

@Public()
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post()
  submit(@Body() dto: ContactRequestDto) {
    return this.contactService.submit(dto);
  }
}
