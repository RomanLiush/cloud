import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BucketDocument = Bucket & Document;

@Schema()
export class Bucket {
  _id?: Types.ObjectId;

  @Prop()
  user_id: Types.ObjectId;

  @Prop()
  folders_count: number;

  @Prop({ unique: true })
  name: string;
}

export const BucketSchema = SchemaFactory.createForClass(Bucket);
