import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  _id?: Types.ObjectId;

  @Prop()
  user_id: Types.ObjectId;

  @Prop()
  bucket_id: Types.ObjectId;

  @Prop()
  folder_id: Types.ObjectId;

  @Prop()
  file_name: string;

  @Prop()
  file_size: string;

  @Prop()
  mimetype: string;

}

export const FileSchema = SchemaFactory.createForClass(File);
