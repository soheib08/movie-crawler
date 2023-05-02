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
  genre: string;

  @Prop()
  images: Array<string>;

  @Prop()
  download_links: Array<string>;

  @Prop()
  createdAt: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
