import { MovieUrlDto } from '../dto/movie-url.dto';
import { Movie } from '../models/movie';
import { MovieUrl } from '../models/movie-url';

export interface ICrawler {
  siteIndexJob(): Promise<void>
  getMoviesDataJob(): Promise<void>
  crawlSite(siteUrl: string, maxPages: number): Promise<Array<MovieUrlDto>>;
  crawlMovies(maxPages: number): Promise<Array<Movie>>;
  saveSiteCrawledData(movieURLs: Array<MovieUrlDto>, site: string): Promise<void>
  saveMoviesCrawledData(movieList: Array<Movie>): Promise<void>;
  getUrlData(url: string): Promise<any>;
}
