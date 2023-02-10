import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from 'src/room/room.module';
import { HotelModule } from 'src/hotel/hotel.module';
import { UsersModule } from 'src/users/users.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import {
  Reservations,
  ReservationsSchema,
} from './schemas/reservations.schemas';

@Module({
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
  imports: [
    HotelModule,
    UsersModule,
    RoomModule,
    MongooseModule.forFeature([
      { name: Reservations.name, schema: ReservationsSchema },
    ]),
  ],
})
export class ReservationsModule {}
