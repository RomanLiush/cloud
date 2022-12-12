import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId,
  name: string,
  sure_name: string,
  email: string,
  password: string
}