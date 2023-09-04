import { load, CheerioAPI } from 'cheerio';
import { IDataExtractor } from 'src/core/interfaces/data-extractor.interface';

export class F2MDataExtractor implements IDataExtractor {
  $: CheerioAPI;

  constructor(data: any) {
    this.$ = load(data);
  }

  getSitePaginationUrlList(): string[] {
    let paginationUrls = new Array<string>();
    this.$('.page-number a').each((index, element) => {
      paginationUrls.push(this.$(element).attr('href'));
    });
    return paginationUrls;
  }

  getPaginationUrlMovieList(): string[] {
    let movieUrls = new Array<string>();

    this.$('.m-helper  a').each((index, element) => {
      const movieUrl = this.$(element).attr('href');
      movieUrls.push(movieUrl);
    });
    return movieUrls;
  }

  getMovieTitle(): string {
    let movieTitle = '';
    this.$('.m-title a').each((index, element) => {
      movieTitle = this.$(element).html();
     // console.log('movie title:', movieTitle);
    });
    return movieTitle;
  }

  getMovieGenres(): string[] {
    let movieGenres = new Array<string>();
 //   console.log('genres:');
    this.$('.m-genres  .val a').each((index, element) => {
      let genre = this.$(element).html();
      movieGenres.push(genre);
     // console.log(genre);
    });
    return movieGenres;
  }

  getMovieIMScore(): string {
    let movieImdbScore = '';
    this.$('.imdb_row  .val').each((index, element) => {
      movieImdbScore = this.$(element).html();
    //  console.log('imdb:', movieImdbScore);
    });

    return movieImdbScore;
  }

  getMovieRottenScore(): string {
    let rottenTitle = '';
    this.$('.meta_row .pt-1').each((index, element) => {
      rottenTitle = this.$(element).html();
    //  console.log('rotten:', rottenTitle);
    });

    return rottenTitle;
  }

  getMovieLanguages(): string[] {
    let movieLanguages = new Array<string>();
    this.$('.m-lang  .val').each((index, element) => {
      let movieLang = this.$(element).html();
    //  console.log('language', movieLang);
      movieLanguages.push(movieLang);
    });

    return movieLanguages;
  }

  getMovieQualities(): string[] {
    let movieQualities = new Array<string>();
   // console.log('quality items:');
    this.$('.m-quality  .val').each((index, element) => {
      let qualityItem = this.$(element).html();
      movieQualities.push(qualityItem);
   //   console.log(qualityItem);
    });

    return movieQualities;
  }

  getMovieCountries(): string[] {
    let countries = new Array<string>();
  //  console.log('country items:');
    this.$('.m-country  .val').each((index, element) => {
      let countryItem = this.$(element).html();
      countries.push(countryItem);
   //   console.log(countryItem);
    });
    return countries;
  }

  getMovieStars(): string[] {
    let stars = new Array<string>();
   // console.log('stars items:');
    this.$('.m-stars  .val').each((index, element) => {
      let starItem = this.$(element).html();
      stars.push(starItem);
    //  console.log(starItem);
    });

    return stars;
  }

  getMovieDirectors(): string[] {
    let movieDirectors = new Array<string>();
 //   console.log('director:');
    this.$('.m-director  .val').each((index, element) => {
      let director = this.$(element).html();
      movieDirectors.push(director);
   //   console.log(director);
    });

    return movieDirectors;
  }

  getMoviePosters(): string[] {
    let moviePosters = new Array<string>();
   // console.log('posters:');
    this.$('.movie .m_poster  img').each((index, element) => {
      let foundSrc = element.attributes.find((attr) => {
        return attr.name === 'src';
      });
      moviePosters.push(foundSrc.value);
     // console.log(foundSrc.value);
    });

    return moviePosters;
  }

  getMovieDownloadLinks(): string[] {
    let downloadLinks = new Array<string>();
    this.$('.m-content a').each((index, element) => {
      const movieDownloadUrl = this.$(element).attr('href');
      if (movieDownloadUrl.includes('.mkv')) {
        downloadLinks.push(movieDownloadUrl);
      }
    });
  //  console.log('download url', downloadLinks.length);

    return downloadLinks;
  }

  getMovieDescription(): string {
    let movieDescription = '';
    this.$('.m_plot  p').each((index, element) => {
      movieDescription = this.$(element).html();
    //  console.log('description:', movieDescription);
    });

    return movieDescription;
  }

  getMovieDate(): string {
    let movieDate = '';
    this.$('.m-date  time').each((index, element) => {
      movieDate = this.$(element).attr('datetime');
    //  console.log('date:', movieDate);
    });

    return movieDate;
  }

  getMovieVideoLinks(): string[] {
    let videoLinks = new Array<string>();
    this.$('source').each((index, element) => {
      let videoLink = this.$(element).attr('src');
     // console.log(videoLink);
      videoLinks.push(videoLink);
    });
   // console.log('video links', videoLinks.length);

    return videoLinks;
  }
}
