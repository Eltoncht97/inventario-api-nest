import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Auth, CurrentUser, Public } from 'src/common/decorators';

interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    return this.authService.login(user);
  }

  @Auth()
  @Post('logout')
  async logout(@CurrentUser() user: { id: string }) {
    await this.authService.logout(user.id);
    return { message: 'Sesión cerrada correctamente' };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    const payload: JwtPayload | null = this.jwtService.decode(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.sub,
    );
    if (!user) {
      throw new UnauthorizedException('Token inválido');
    }

    return this.authService.login(user);
  }
}
