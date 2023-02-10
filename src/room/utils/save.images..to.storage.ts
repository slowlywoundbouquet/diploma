import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImagesToStorage = {
  storage: diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
      const fileExtension: string = file.originalname;
      const fileName = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  filter: (req, file, cb) => {
    const allowedMimeTypes = validMimeTypes;
    allowedMimeTypes.includes(file.mimeType) ? cb(null, true) : cb(null, false);
  },
};
