import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './schemas/site.schema';
import {
  PaginationUrl,
  PaginationUrlSchema,
} from './schemas/pagination-url.schema';
import { MovieUrl, MovieUrlSchema } from './schemas/movie-url.schema';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { SiteRepository } from './repo/site.repository';
import { PaginationUrlRepository } from './repo/pagination-url.repository';
import { MovieUrlRepository } from './repo/movie-url.repository';
import { MovieRepository } from './repo/movie.repository';
import { IMovieRepository } from 'src/core/interfaces/IMovie-repository';
import { IMovieUrlRepository } from 'src/core/interfaces/IMovieUrl-repository';
import { ISiteRepository } from 'src/core/interfaces/ISite-repository';
import { IPaginationUrlRepository } from 'src/core/interfaces/IPaginationUrl-repository';
import { IRawMovieRepository } from 'src/core/interfaces/IRawMovie-repository';
import { RawMovieRepository } from './repo/raw-movie.repository';
import { RawMovie, RawMovieSchema } from './schemas/raw-movie.schema';
import { SystemError, SystemErrorSchema } from './schemas/system-error.schema';
import { ISystemErrorRepository } from 'src/core/interfaces/ISystem-error-repository';
import { SystemErrorRepository } from './repo/system-error.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://crawler_admin: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@localhost:27017/admin'),
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: PaginationUrl.name, schema: PaginationUrlSchema },
      { name: MovieUrl.name, schema: MovieUrlSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: RawMovie.name, schema: RawMovieSchema },
      { name: SystemError.name, schema: SystemErrorSchema },
    ]),
  ],
  providers: [
    {
      provide: IMovieRepository,
      useClass: MovieRepository,
    },
    {
      provide: IRawMovieRepository,
      useClass: RawMovieRepository,
    },
    {
      provide: IMovieUrlRepository,
      useClass: MovieUrlRepository,
    },
    {
      provide: IPaginationUrlRepository,
      useClass: PaginationUrlRepository,
    },
    {
      provide: ISiteRepository,
      useClass: SiteRepository,
    },
    {
      provide: ISystemErrorRepository,
      useClass: SystemErrorRepository,
    },
  ],
  exports: [
    ISiteRepository,
    IPaginationUrlRepository,
    IMovieUrlRepository,
    IMovieRepository,
    IRawMovieRepository,
    ISystemErrorRepository
  ],
})
export class DataModule {}
