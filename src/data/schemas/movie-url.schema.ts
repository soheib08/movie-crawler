import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PaginationUrl } from './pagination-url.schema';

export type PaginationUrlDocument = mongoose.HydratedDocument<MovieUrl>;

@Schema({ id: true, timestamps: true })
export class MovieUrl {
  @Prop()
  id: string;

  @Prop()
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PaginationUrl' })
  pagination_url: string;

  @Prop({
    required: true,
    default: false
  })
  is_visited: boolean

  @Prop()
  createdAt: Date;
}

export const MovieUrlSchema = SchemaFactory.createForClass(MovieUrl);
