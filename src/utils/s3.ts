import { format } from 'date-fns';
import { CreateImageDto, ImageDto } from 'features/product/interface';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { removeFileExtension } from './string';

const bucketName = import.meta.env.VITE_S3_IMAGE_BUCKET_NAME;
const region = import.meta.env.VITE_AWS_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

export async function uploadImage(file: File): Promise<CreateImageDto> {
  try {
    const fileName = removeFileExtension(file.name);
    const timestamp = format(new Date(), 'yyyyMMddHHmmss');
    const fileExtension = file.type.split('/')[1];
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `${fileName}_${timestamp}.${fileExtension}`,
        Body: file,
        ContentType: file.type,
      }),
    );
    return {
      fileName,
      imageUrl: `https://${bucketName}.s3-${region}.amazonaws.com/${fileName}`,
    };
  } catch (error) {
    throw new Error(`Upload Failed: ${error}`);
  }
}

export async function deleteImage({ id, fileName }: ImageDto): Promise<number> {
  try {
    await client.send(new DeleteObjectCommand({ Key: fileName, Bucket: bucketName }));
    return id;
  } catch (error) {
    throw new Error(`Upload Failed: ${error}`);
  }
}
