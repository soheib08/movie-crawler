import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteDocument = HydratedDocument<Site>;

@Schema({ id: true, timestamps: true })
export class Site {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  createdAt: Date;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
