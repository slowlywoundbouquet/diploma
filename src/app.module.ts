import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SupportModule } from './chat/support.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://root:example@mongo:27017/'),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    HotelModule,
    ReservationsModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
