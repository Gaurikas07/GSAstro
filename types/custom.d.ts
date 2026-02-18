declare module 'jsonwebtoken';
declare module 'multer';
declare namespace Express {
  namespace Multer {
    interface File {
      filename: string;
      originalname: string;
    }
  }
}
