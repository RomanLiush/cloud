import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FolderDocument = Folder & Document;

@Schema()
export class Folder {
  _id?: Types.ObjectId;

  @Prop()
  user_id: Types.ObjectId;

  @Prop()
  bucket_id: Types.ObjectId;

  @Prop({ unique: true })
  folder_name: string;

  @Prop()
  folder_path: string;

  @Prop()
  files_count: number;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
