import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type PaginationUrlDocument = mongoose.HydratedDocument<Movie>;

@Schema({ id: true, timestamps: true })
export class Movie {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  genre: Array<string>;

  @Prop()
  languages: Array<string>;

  @Prop()
  qualities: Array<string>;

  @Prop()
  countries: Array<string>;

  @Prop()
  stars: Array<string>;

  @Prop()
  directors: Array<string>;

  @Prop()
  images: Array<string>;

  @Prop()
  download_links: Array<string>;

  @Prop()
  date: string;

  @Prop()
  imdb_score: string;

  @Prop()
  rotten_score: string;

  @Prop()
  video_links: Array<string>;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
