import { Movie } from 'src/core/models/movie';
import { RawMovie } from 'src/core/models/raw-movie';

export class CreateMovieDto {
  id: string;
  name: string;
  description: string;
  genre: Array<string>;
  languages: Array<string>;
  qualities: Array<string>;
  countries: Array<string>;
  stars: Array<string>;
  directors: Array<string>;
  images: Array<string>;
  download_links: Array<string>;
  date: string;
  imdb_score: string;
  rotten_score: string;
  video_links: Array<string>;

  constructor(rawMovie:RawMovie){
    this.name = this.cleanMovieName(rawMovie.name)
    this.description = rawMovie.description
    this.languages = rawMovie.languages
    this.qualities = rawMovie.qualities
    this.countries = rawMovie.countries
    this.stars = rawMovie.stars
    this.genre = rawMovie.genre
    this.images = rawMovie.images
    this.date = rawMovie.date
    this.imdb_score = rawMovie.imdb_score
    this.rotten_score = rawMovie.rotten_score
    this.video_links = rawMovie.video_links

  }

  cleanMovieName(name: string) {
    let str = this.removePersianCharacters(name);
    return str.replace(' ', '-');
  }

  private removePersianCharacters(str: string): string {
    const persianPattern =
      /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]/g;
    return str.replace(persianPattern, '');
  }

  createMovieInstance() {
    let movie = new Movie();
    movie = { ...this };
    return movie
  }
}
