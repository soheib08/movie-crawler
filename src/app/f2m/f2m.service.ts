import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IMovieUrlRepository } from 'src/core/interfaces/IMovieUrl-repository';
import { IPaginationUrlRepository } from 'src/core/interfaces/IPaginationUrl-repository';
import { ISiteRepository } from 'src/core/interfaces/ISite-repository';
import { ICrawler } from 'src/core/interfaces/crawler.interface';
import { MovieUrl } from 'src/core/models/movie-url';
import { PaginationUrl } from 'src/core/models/pagination-url';
import { Site } from 'src/core/models/site';
import { F2MDataExtractor } from './f2m-data-extractor.service';
import { F2MUrl } from './f2m.constants';
import { MovieUrlDto } from 'src/core/dto/movie-url.dto';
import { RawMovie } from 'src/core/models/raw-movie';
import { IRawMovieRepository } from 'src/core/interfaces/IRawMovie-repository';

@Injectable()
export class F2MService implements OnModuleInit, ICrawler {
  private readonly logger = new Logger(F2MService.name);
  constructor(
    @Inject(ISiteRepository) private readonly siteRepository: ISiteRepository,
    @Inject(IPaginationUrlRepository)
    private readonly paginationUrlRepository: IPaginationUrlRepository,
    @Inject(IMovieUrlRepository)
    private readonly movieUrlRepository: IMovieUrlRepository,
    @Inject(IRawMovieRepository)
    private readonly rawMovieRepository: IRawMovieRepository,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    this.logger.debug('f2m crawler registered');
    // await this.getMoviesDataJob();
  }

   @Cron(CronExpression.EVERY_HOUR)
  async siteIndexJob() {
    this.logger.debug('start crawling f2m...');
    let foundSite = await this.siteRepository.findOne(F2MUrl);
    if (!foundSite) {
      let siteName = F2MUrl.split('https://www.')[1].split('.')[0];
      foundSite = await this.siteRepository.createOne(
        new Site(F2MUrl, siteName),
      );
      console.log(siteName, 'website created');
    }
    console.log('site is:', foundSite);

    let isPaginatedUrlExists = await this.paginationUrlRepository.findOne(
      F2MUrl,
    );
    console.log('is url exists:', isPaginatedUrlExists);

    if (!isPaginatedUrlExists) {
      let newUrl = new PaginationUrl(F2MUrl, foundSite.id, false);
      await this.paginationUrlRepository.createOne(newUrl);
      console.log(F2MUrl, 'pagination url created');
    }

    let visitedUrls = await this.paginationUrlRepository.find();
    visitedUrls = visitedUrls.filter((element) => {
      return element.is_visited === true;
    });
    console.log('visited urls', visitedUrls.length);

    const moviesUrls = await this.crawlSite(
      F2MUrl,
      visitedUrls.map((element) => element.url),
      50,
    );

    console.log('start importing data...');
    await this.saveSiteCrawledData(moviesUrls, foundSite.url);
    console.log('end of importing data');
  }

   @Cron(CronExpression.EVERY_10_MINUTES)
  async getMoviesDataJob() {
    this.logger.debug('start crawl from movie urls...');
    let foundMovieLinks = await this.movieUrlRepository.find();
    const movies = await this.crawlMovies(foundMovieLinks, 10);
    this.logger.debug('start save crawled movies');
    await this.saveMoviesCrawledData(movies);
  }

  async crawlSite(
    paginationUrl: string,
    visitedURLs: Array<string>,
    maxPages = 50,
  ): Promise<Array<MovieUrlDto>> {
    const paginationURLsToVisit = [paginationUrl];
    console.log('paginationURLsToVisit', paginationURLsToVisit.length);
    let counter = 0;
    const movies = new Array<MovieUrlDto>();
    console.log('movies count', visitedURLs.length);

    while (paginationURLsToVisit.length !== 0 && counter <= maxPages) {
      const currentPaginationUrl = paginationURLsToVisit.pop();
      console.log('current paginate url', currentPaginationUrl);

      if (visitedURLs.includes(currentPaginationUrl)) {
        this.logger.log(currentPaginationUrl, 'crawled before.....*');
        break;
      }
      const data = await this.getUrlData(currentPaginationUrl);
      visitedURLs.push(currentPaginationUrl);
      counter += 1;
      console.log('visited count extended with ', counter);

      let dataExtractor = new F2MDataExtractor(data);
      let paginationUrls = dataExtractor.getSitePaginationUrlList();
      paginationUrls.forEach((element) => {
        if (
          !visitedURLs.includes(element) &&
          !paginationURLsToVisit.includes(element)
        ) {
          paginationURLsToVisit.push(element);
          console.log('new Paginate url added', element);
        }
      });

      let movieUrls = dataExtractor.getPaginationUrlMovieList();
      movieUrls.forEach((movieUrl) => {
        movies.push({ url: movieUrl, pagination_url: currentPaginationUrl });
        console.log('new movie url added', movieUrl);
      });
      console.log('========end of iteration============', visitedURLs.length);
    }

    this.logger.debug('========this crawler round is ended=======');
    return movies;
  }

  async crawlMovies(
    movieUrls: Array<MovieUrl>,
    maxPages: number,
  ): Promise<Array<RawMovie>> {
    let counter = 0;
    console.log('movie url count', movieUrls.length);
    let movies = new Array<RawMovie>();
    for await (const movieUrlItem of movieUrls) {
      console.log('movie url item', movieUrlItem.url, counter);
      if (counter >= maxPages) {
        this.logger.log('reach limiting...');
        break;
      }
      if (!movieUrlItem.is_visited) {
        console.log('start get movie url information...');

        let movie = await this.getMovieInformation(movieUrlItem.url);
        movieUrlItem.is_visited = true;
        await this.movieUrlRepository.updateOne(
          movieUrlItem.url.toString(),
          movieUrlItem,
        );
        counter += 1;
        movies.push(movie);
      }
    }
    return movies;
  }

  async saveSiteCrawledData(
    movieURLs: Array<{ url: string; pagination_url: string }>,
    site: string,
  ) {
    for await (const movieUrlItem of movieURLs) {
      let isUrlExists = await this.movieUrlRepository.findOne(movieUrlItem.url);
      let foundPaginationUrl = await this.paginationUrlRepository.findOne(
        movieUrlItem.pagination_url,
      );
      if (!foundPaginationUrl) {
        let foundSite = await this.siteRepository.findOne(site);
        let newUrl = new PaginationUrl(
          movieUrlItem.pagination_url,
          foundSite.id,
          true,
        );
        foundPaginationUrl = await this.paginationUrlRepository.createOne(
          newUrl,
        );
      }
      if (!isUrlExists) {
        await this.movieUrlRepository.createOne(
          new MovieUrl(movieUrlItem.url, foundPaginationUrl.id),
        );
      }
    }
  }

  async getMovieInformation(movieUrl: string) {
    let movie = new RawMovie();
    const data = await this.getUrlData(movieUrl);
    let dataExtractor = new F2MDataExtractor(data);

    //get movie name
    movie.name = dataExtractor.getMovieTitle();

    //get movie genres
    movie.genre = dataExtractor.getMovieGenres();

    //get scores
    movie.imdb_score = dataExtractor.getMovieIMScore();

    movie.rotten_score = dataExtractor.getMovieRottenScore();

    //get movie language
    movie.languages = dataExtractor.getMovieLanguages();

    //qualities
    movie.qualities = dataExtractor.getMovieQualities();

    //get countries
    movie.countries = dataExtractor.getMovieCountries();

    //get stars
    movie.stars = dataExtractor.getMovieStars();

    //get directors
    movie.directors = dataExtractor.getMovieDirectors();

    //get posters
    movie.images = dataExtractor.getMoviePosters();

    //get download links
    movie.download_links = dataExtractor.getMovieDownloadLinks();

    //get movie description
    movie.description = dataExtractor.getMovieDescription();

    //get movie date
    movie.date = dataExtractor.getMovieDate();

    //get video links
    movie.video_links = dataExtractor.getMovieVideoLinks();

    return movie;
  }

  async saveMoviesCrawledData(movieList: Array<RawMovie>): Promise<void> {
    for await (const rawMovie of movieList) {
      let foundMovie = await this.rawMovieRepository.findOne(rawMovie.name);
      if (foundMovie) {
        break;
      }
      await this.rawMovieRepository.createOne(rawMovie);
    }
    console.log('end of saving raw movies');
  }

  async getUrlData(url: string): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.get(url);

      return response.data;
    } catch (err) {
      console.log('error in get request', err);
    }
  }
}
