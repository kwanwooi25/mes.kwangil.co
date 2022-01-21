import { format } from 'date-fns';
import { CreateImageDto, ImageDto } from 'features/product/interface';
import ReactS3Client from 'react-aws-s3-typescript';

import { removeFileExtension } from './string';

const s3 = new ReactS3Client({
  bucketName: process.env.REACT_APP_S3_IMAGE_BUCKET_NAME as string,
  region: process.env.REACT_APP_AWS_REGION as string,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY as string,
});

export async function uploadImage(file: File): Promise<CreateImageDto> {
  try {
    const fileName = `${removeFileExtension(file.name)}_${format(new Date(), 'yyyyMMddHHmmss')}`;
    const { key, location } = await s3.uploadFile(file, fileName);
    return {
      fileName: key,
      imageUrl: location,
    };
  } catch (error) {
    throw new Error(`Upload Failed: ${error}`);
  }
}

export async function deleteImage(image: ImageDto): Promise<number> {
  try {
    await s3.deleteFile(image.fileName);
    return image.id;
  } catch (error) {
    throw new Error(`Upload Failed: ${error}`);
  }
}
