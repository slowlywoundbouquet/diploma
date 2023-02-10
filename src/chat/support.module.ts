import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChartService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schemas/support.request .schema';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  controllers: [SupportController],
  providers: [SupportService, ChatGateway, ChartService],
  exports: [SupportService, ChatGateway, ChartService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
})
export class SupportModule {}
