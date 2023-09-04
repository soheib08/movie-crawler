import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IMovieRepository } from 'src/core/interfaces/IMovie-repository';
import { IRawMovieRepository } from 'src/core/interfaces/IRawMovie-repository';
import { RawMovie } from 'src/core/models/raw-movie';
import { CreateMovieDto } from './dto/movie.dto';
import { SystemError, SystemErrorEnum } from 'src/core/models/system-error';
import { ISystemErrorRepository } from 'src/core/interfaces/ISystem-error-repository';

@Injectable()
export class MovieService implements OnModuleInit {
  private readonly logger = new Logger(MovieService.name);
  constructor(
    @Inject(IMovieRepository)
    private readonly movieRepository: IMovieRepository,
    @Inject(IRawMovieRepository)
    private readonly rawMovieRepository: IRawMovieRepository,
    @Inject(ISystemErrorRepository)
    private readonly systemErrorRepository: ISystemErrorRepository,
  ) {}

  async onModuleInit() {
    this.logger.debug('movie service registered');
    this.importingMovies();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async importingMovies() {
    this.logger.debug('import movie service job starting...');
    let rawMovieList = await this.rawMovieRepository.find();
    rawMovieList = rawMovieList.filter((element) => {
      return element.is_checked !== true;
    });
    for await (const rawMovie of rawMovieList) {
      await this.importMovie(rawMovie);
      rawMovie.is_checked = true;
      await this.rawMovieRepository.updateOne(rawMovie.name, rawMovie);
    }
    this.logger.debug('done with importing movies...');
  }
  async importMovie(rawMovie: RawMovie) {
    let movieDto = new CreateMovieDto(rawMovie);
    let movie = movieDto.createMovieInstance();

    let movieList = await this.movieRepository.find();
    let isMovieExists = movieList.find((element) => {
      return element.name === movie.name;
    });
    if (!isMovieExists) {
      await this.movieRepository.createOne(movie);
    } else {
      let systemError = new SystemError();
      systemError.type = SystemErrorEnum.ImportMovieError;
      systemError.message = `${movie.name} is already exists with name ${isMovieExists.name} and ${isMovieExists.id}`;
      await this.systemErrorRepository.createOne(systemError)
      this.logger.debug(`${movie.name} is already exists`);
    }
  }
}
