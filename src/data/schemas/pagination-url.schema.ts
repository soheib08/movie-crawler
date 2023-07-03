import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  * as mongoose from 'mongoose';

export type PaginationUrlDocument = mongoose.HydratedDocument<PaginationUrl>;

@Schema({ id: true, timestamps: true })
export class PaginationUrl {
  @Prop()
  id: string;

  @Prop()
  url: string;

  @Prop({
    required: true,
    default: false
  })
  is_visited: boolean

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Site' })
  site: string;

  @Prop()
  createdAt: Date;
}

export const PaginationUrlSchema = SchemaFactory.createForClass(PaginationUrl);
