// @ts-ignore
import S3 from 'aws-s3';
import { CreateImageDto, ImageDto } from 'features/product/interface';

import { removeFileExtension } from './string';

export async function uploadImage(file: File): Promise<CreateImageDto> {
  try {
    const s3 = new S3({
      bucketName: process.env.REACT_APP_S3_IMAGE_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });
    const fileName = removeFileExtension(file.name);
    const { key, location } = await s3.uploadFile(file, fileName);
    return {
      fileName: key,
      imageUrl: location,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteImage(image: ImageDto): Promise<number> {
  try {
    const s3 = new S3({
      bucketName: process.env.REACT_APP_S3_IMAGE_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });
    const res = await s3.deleteFile(image.fileName);
    return res.ok && image.id;
  } catch (error) {
    throw new Error(error);
  }
}
