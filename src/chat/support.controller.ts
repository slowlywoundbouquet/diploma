import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CurrentUser } from 'src/auth/decorators/current.user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { IFindSearchParams } from 'src/hotel/interfaces/find-search.params.interface';
import { Role } from 'src/users/enums/roles.enum';
import { User } from 'src/users/schemas/user.schemas';
import { ChatGateway } from './chat.gateway';
import { ChartService } from './chat.service';
import { CreateSupportRequestDto } from './dto/create.support.request.dto';
import { SupportService } from './support.service';

@Controller('chat')
export class SupportController {
  constructor(
    private supportService: SupportService,
    private chartService: ChartService,
    private chatGateway: ChatGateway,

    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(new RolesGuard([Role.Client]))
  @UseGuards(JwtAuthGuard)
  @Post('/api/client/chat-requests')
  async createSupportRequest(
    @Body() data: CreateSupportRequestDto,
    @CurrentUser() user: User & { _id: TID },
  ) {
    return await this.supportService.createSupportRequest(data, user);
  }

  @UseGuards(new RolesGuard([Role.Client]))
  @UseGuards(JwtAuthGuard)
  @Get('/api/client/chat-requests/')
  async getSupportCallsClient(
    @Query() params: Omit<IFindSearchParams & { isActive: boolean }, 'hotel'>,
  ) {
    try {
      const result = await this.supportService.getSupportCallsClient(params);
      return result;
    } catch (error) {
      return error;
    }
  }

  @UseGuards(new RolesGuard([Role.Manager]))
  @UseGuards(JwtAuthGuard)
  @Get('/api/manager/chat-requests/')
  async getSupportCallsManager(
    @Query() params: Omit<IFindSearchParams & { isActive: boolean }, 'hotel'>,
  ) {
    try {
      const result = await this.supportService.getSupportCallsManager(params);
      return result;
    } catch (error) {
      return error;
    }
  }

  @UseGuards(new RolesGuard([Role.Manager, Role.Client]))
  @UseGuards(JwtAuthGuard)
  @Get('/api/common/chat-requests/:id/messages')
  async getHistoryMessageSupportCalls(@Param('id') id: string) {
    try {
      return await this.supportService.getHistoryMessageSupportCalls(id);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(new RolesGuard([Role.Manager, Role.Client]))
  @UseGuards(JwtAuthGuard)
  @Post('/common/chat-requests/:id/messages')
  async sendMessage(
    @Body() data: CreateSupportRequestDto,
    @CurrentUser() user: User & { _id: TID },
    @Param('id') id: string,
  ) {
    data['author'] = user._id;
    data['supportRequest'] = id;
    this.eventEmitter.emit('message.create', id);

    return await this.chartService.sendMessage(data);
  }

  @OnEvent('message.create')
  subscribeToChat(chatId: string) {
    console.log('подписались на сообщение', chatId);
    this.chatGateway.sendMessage();
  }

  @UseGuards(new RolesGuard([Role.Manager, Role.Client]))
  @UseGuards(JwtAuthGuard)
  @Post('/api/common/chat-requests/:id/messages/read')
  async markMessagesAsRead(
    @Param('id') id: string,
    @Body() data: { createdBefore: string },
  ) {
    try {
      return await this.supportService.markMessagesAsRead(
        id,
        data.createdBefore,
      );
    } catch (error) {
      return error;
    }
  }

  @UseGuards(new RolesGuard([Role.Manager]))
  @UseGuards(JwtAuthGuard)
  @Post('/api/manager/chat-requests/:id')
  async closeRequest(@Param('id') id: string) {
    try {
      return await this.supportService.closeRequest(id);
    } catch (error) {
      return error;
    }
  }
}
