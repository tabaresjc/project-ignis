/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import config from '../../../config';
import { MAX_FILE_SIZE } from '../constants';
import { generateUUID } from './utils';


export const audioFileUploaParsePipe = () =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
    ],
  });

export const fileInterceptorOptions = (): MulterOptions => {
  return {
    storage: diskStorage({
      destination: config.dataPath,
      /**
       * override the original filename to avoid overlapping
       * @param req 
       * @param file 
       * @param cb 
       */
      filename: (req: any, file, cb) => {
        const extension = file.originalname.split('.').pop();
        // TODO: implement a job to cleanup tmp files after X seconds
        cb(null, `tmp_upload_${generateUUID()}.${extension}`);
      },
    }),
  };
};
