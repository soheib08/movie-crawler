import { Module } from '@nestjs/common';
import { F2mModule } from './f2m/f2m.module';
import { DataModule } from '../data/data.module';
import { MovieModule } from './movie/dto/movie.module';
import { BotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [
    DataModule,
    //  F2mModule,
    //  MovieModule,
    // BotModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
