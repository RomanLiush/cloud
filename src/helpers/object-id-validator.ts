import { Types } from 'mongoose';
import { HttpException } from '@nestjs/common';

export const objectIdValidator = (id: Types.ObjectId) => {
  const validId = Types.ObjectId.isValid(id);
  if (!validId) throw new HttpException('Invalid request data.', 400);
};
