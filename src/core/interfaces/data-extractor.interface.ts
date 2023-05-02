export interface IDataExtractor {
  getSitePaginationUrlList(): Array<string>;
  getPaginationUrlMovieList(): Array<string>;
  getMovieTitle(): string;
  getMovieGenres(): Array<string>;
  getMovieIMScore(): string;
  getMovieRottenScore(): string;
  getMovieLanguages(): Array<string>;
  getMovieQualities(): Array<string>;
  getMovieCountries(): Array<string>;
  getMovieStars(): Array<string>;
  getMovieDirectors(): Array<string>;
  getMoviePosters(): Array<string>;
  getMovieDownloadLinks(): Array<string>;
  getMovieDescription(): string;
  getMovieDate(): string;
  getMovieVideoLinks(): Array<string>;
}
