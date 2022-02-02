/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_S3_IMAGE_BUCKET_NAME: string;
  VITE_AWS_REGION: string;
  VITE_AWS_ACCESS_KEY_ID: string;
  VITE_AWS_SECRET_ACCESS_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
