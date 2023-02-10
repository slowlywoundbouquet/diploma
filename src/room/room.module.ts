import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelModule } from 'src/hotel/hotel.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { HotelRoom, HotelRoomSchema } from './schemas/hotelRoom.schemas';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
  imports: [
    HotelModule,
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
})
export class RoomModule {}
