import { Module } from '@nestjs/common';
import { DataModule } from '../data/data.module';
import { F2mModule } from './f2m/f2m.module';
import { MovieModule } from './movie/dto/movie.module';

@Module({
  imports: [
    DataModule,
    F2mModule,
    MovieModule,
    // BotModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
