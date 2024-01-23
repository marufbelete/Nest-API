import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}
  private AWS_REGION = this.configService.get<string>('AWS_REGION');
  private AWS_BUCKET_NAME = this.configService.get<string>('AWS_BUCKET_NAME');
  private AWS_ACCESS_KEY_ID =
    this.configService.get<string>('AWS_ACCESS_KEY_ID');
  private AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );
  private s3 = new S3Client({
    region: this.AWS_REGION,
    credentials: {
      accessKeyId: this.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
    },
  });

  async fileUpload(file: Express.Multer.File, folder: string) {
    const uniquePrefix = Date.now();
    const imagetype = file.mimetype.split('/')[1];
    const path = file.originalname;
    const fullpath = `${folder}/${uniquePrefix}-${path}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.AWS_BUCKET_NAME,
        Key: fullpath,
        Body: await sharp(file.buffer)
          .resize({ width: 400, fit: 'contain' })
          // .webp() this make the real type other is just view
          //.toFromat() if not provided Sharp will use the format of the input image by default
          .toBuffer(),
        ContentType: imagetype,
      }),
    );
    return fullpath;
  }

  async fileRetrive(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 36000 });
    return url;
  }

  async fileDelete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.AWS_BUCKET_NAME,
      Key: key,
    });
    await this.s3.send(command);
    return true;
  }

  async filesUpload(files: Express.Multer.File[], folder: string):Promise<string[]> {
    const imgurl: string[] = [];
    for (let f = 0; f < files.length; f++) {
      const uniquePrefix = Date.now();
      const imagetype = files[f].mimetype.split('/')[1];
      const path = files[f].originalname;
      const fullpath = `${folder}/${uniquePrefix}-${path}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.AWS_BUCKET_NAME,
          Key: fullpath,
          Body: await sharp(files[f].buffer)
            .resize({ width: 400, fit: 'contain' })
            // .webp() this make the real type other is just view
            //.toFromat() if not provided Sharp will use the format of the input image by default
            .toBuffer(),
          ContentType: imagetype,
        }),
      );
      imgurl.push(fullpath);
    }
    return imgurl;
  }
}
