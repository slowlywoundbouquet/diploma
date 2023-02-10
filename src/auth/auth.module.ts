import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
dotenv.config();
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: { expiresIn: '1020s' },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
