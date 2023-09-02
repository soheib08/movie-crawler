import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';

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
