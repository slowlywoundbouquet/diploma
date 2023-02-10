import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schemas/hotel.schemas';

@Module({
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
  ],
})
export class HotelModule {}
