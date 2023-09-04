import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SystemErrorEnum } from 'src/core/models/system-error';

export type SystemErrorDocument = mongoose.HydratedDocument<SystemError>;

export class SystemErrorData {}

@Schema({ id: true, timestamps: true })
export class SystemError {
  @Prop()
  id: string;

  @Prop()
  type: SystemErrorEnum;

  @Prop()
  message: string;

  @Prop()
  data: SystemErrorData;
}

export const SystemErrorSchema = SchemaFactory.createForClass(SystemError);
