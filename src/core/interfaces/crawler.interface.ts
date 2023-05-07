import { MovieUrlDto } from '../dto/movie-url.dto';
import { Movie } from '../models/movie';
import { MovieUrl } from '../models/movie-url';

export interface ICrawler {
  siteIndexJob(): Promise<void>;
  getMoviesDataJob(): Promise<void>;
  crawlSite(
    siteUrl: string,
    visitedURLs: Array<string>,
    maxPages: number,
  ): Promise<Array<MovieUrlDto>>;
  crawlMovies(
    movieURLs: Array<MovieUrlDto>,
    maxPages: number,
  ): Promise<Array<Movie>>;
  saveSiteCrawledData(
    movieURLs: Array<MovieUrl>,
    site: string,
  ): Promise<void>;
  saveMoviesCrawledData(movieList: Array<Movie>): Promise<void>;
  getUrlData(url: string): Promise<any>;
}
