import { Module } from '@nestjs/common';
import { BotService } from './bot';

@Module({
  providers: [BotService],
})
export class BotModule {}
