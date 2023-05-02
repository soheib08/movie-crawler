import { Module } from '@nestjs/common';
import { F2mModule } from './f2m/f2m.module';
import { DataModule } from '../data/data.module';

@Module({
  imports: [DataModule, F2mModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
