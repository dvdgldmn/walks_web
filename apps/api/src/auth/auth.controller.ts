import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.login(dto);
    res.cookie(
      this.authService.getCookieName(),
      payload.accessToken,
      this.authService.getCookieOptions(),
    );
    return {
      user: payload.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(
      this.authService.getCookieName(),
      this.authService.getCookieOptions(),
    );
    return { success: true };
  }

  @Get('me')
  async me(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.authService.getProfile(userId);
  }
}
