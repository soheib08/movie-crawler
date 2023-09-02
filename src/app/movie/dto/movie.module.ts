import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { DataModule } from 'src/data/data.module';
import { MovieService } from '../movie.service';

@Module({
  imports: [
    DataModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [MovieService],
})
export class MovieModule {}
