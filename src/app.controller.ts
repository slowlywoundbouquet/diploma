import { Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt.auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  Home() {
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/test')
  async test() {
    return { msg: 'test' };
  }
}
