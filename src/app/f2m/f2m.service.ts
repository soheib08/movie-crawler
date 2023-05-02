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
import { Movie } from 'src/core/models/movie';

@Injectable()
export class F2MService implements OnModuleInit, ICrawler {
  private readonly logger = new Logger(F2MService.name);
  constructor(
    @Inject(ISiteRepository) private readonly siteRepository: ISiteRepository,
    @Inject(IPaginationUrlRepository)
    private readonly paginationUrlRepository: IPaginationUrlRepository,
    @Inject(IMovieUrlRepository)
    private readonly movieUrlRepository: IMovieUrlRepository,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    this.logger.debug('start crawl from movie urls...');
    // this.crawlMoviesFromMovieLinks(2);
  }

  // @Cron(CronExpression.EVERY_10_MINUTES)
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
      let newUrl = new PaginationUrl(F2MUrl, foundSite.id);
      await this.paginationUrlRepository.createOne(newUrl);
      console.log(F2MUrl, 'pagination url created');
    }
    const moviesUrls = await this.crawlSite(F2MUrl, 20);

    console.log('start importing data...');
    await this.saveSiteCrawledData(moviesUrls, foundSite.url);
    console.log('end of importing data');
  }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  async getMoviesDataJob() {
    this.logger.debug('start crawl from movie urls...');
    const movies = await this.crawlMovies(2);
    await this.saveMoviesCrawledData(movies);
  }

  async crawlSite(
    paginationUrl: string,
    maxPages = 50,
  ): Promise<Array<MovieUrlDto>> {
    const paginationURLsToVisit = [paginationUrl];
    console.log('paginationURLsToVisit', paginationURLsToVisit.length);

    const visitedURLs = new Array<string>();

    const movies = new Array<MovieUrlDto>();
    console.log('movies count', visitedURLs.length);

    while (
      paginationURLsToVisit.length !== 0 &&
      visitedURLs.length <= maxPages
    ) {
      const currentPaginationUrl = paginationURLsToVisit.pop();
      console.log('current paginate url', currentPaginationUrl);

      const data = await this.getUrlData(currentPaginationUrl);
      visitedURLs.push(currentPaginationUrl);
      console.log('visited count extended with ', currentPaginationUrl);

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
        console.log('new movie url created', movieUrl);
      });
      console.log('========end of iteration============', visitedURLs.length);
    }

    this.logger.debug('========this crawler round is ended=======');
    return movies;
  }

  async crawlMovies(maxPages: number): Promise<Array<Movie>> {
    let foundMovieLinks = await this.movieUrlRepository.find();
    let visitedURLs = new Array<string>();
    console.log('movie url count', foundMovieLinks.length);
    let movies = new Array<Movie>();
    for await (const movieUrlItem of foundMovieLinks) {
      console.log('movie url item', movieUrlItem.url, visitedURLs.length);
      if (visitedURLs.length >= maxPages) {
        this.logger.log('reach limiting...');
        break;
      }
      if (!movieUrlItem.is_visited) {
        console.log('start get movie url information...');

        let movie = new Movie();
        await this.getMovieInformation(movieUrlItem.url);
        movieUrlItem.is_visited = true;
        await this.movieUrlRepository.updateOne(
          movieUrlItem.id.toString(),
          movieUrlItem,
        );
        visitedURLs.push(movieUrlItem.url);
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
    const data = await this.getUrlData(movieUrl);
    let dataExtractor = new F2MDataExtractor(data);

    //get movie name
    let movieTitle = dataExtractor.getMovieTitle();
    console.log('movie title:', movieTitle);

    //get movie genres
    let movieGenres = dataExtractor.getMovieGenres();
    console.log('genres:', movieGenres.length);

    //get scores
    let movieImdbScore = dataExtractor.getMovieIMScore();
    console.log('imdb:', movieImdbScore);

    let rottenTitle = dataExtractor.getMovieRottenScore();
    console.log('rotten:', rottenTitle);

    //get movie language
    let movieLanguages = dataExtractor.getMovieLanguages();
    console.log('language', movieLanguages.length);

    //qualities
    let movieQualities = dataExtractor.getMovieQualities();
    console.log('quality items:', movieQualities.length);

    //get countries
    let countries = dataExtractor.getMovieCountries();
    console.log('country items:', countries.length);

    //get stars
    let stars = dataExtractor.getMovieStars();
    console.log('stars items:', stars.length);

    //get directors
    let movieDirectors = dataExtractor.getMovieDirectors();
    console.log('directors:', movieDirectors.length);

    //get posters
    let moviePosters = dataExtractor.getMoviePosters();
    console.log('posters:', moviePosters);

    //get download links
    let downloadLinks = dataExtractor.getMovieDownloadLinks();
    console.log('download url', downloadLinks.length);

    //get movie description
    let movieDescription = dataExtractor.getMovieDescription();
    console.log('description:', movieDescription);

    //get movie date
    let movieDate = dataExtractor.getMovieDate();
    console.log('date:', movieDate);

    //get video links
    let videoLinks = dataExtractor.getMovieVideoLinks();
    console.log('video links', videoLinks.length);
  }

  async saveMoviesCrawledData(movieList: Array<Movie>): Promise<void> {}

  async getUrlData(url: string): Promise<any> {
    try {
      const response = await this.httpService.axiosRef.get(url);

      return response.data;
    } catch (err) {
      console.log('error in get request', err);
    }
  }
}
