import { createStyles, makeStyles } from '@material-ui/core';

import { ImageDto, ProductFormValues } from 'features/product/interface';
import ProductImage from 'components/ProductImage/ProductImage';
import ProductImageContainer from 'components/ProductImage/ProductImageContainer';
import ProductImageInput from 'components/ProductImage/ProductImageInput';
import React from 'react';
import { useFormikContext } from 'formik';

const useStyles = makeStyles(() =>
  createStyles({
    images: {},
  }),
);

function ImageForm() {
  const classes = useStyles();
  const { values, setFieldValue } = useFormikContext<ProductFormValues>();

  const handleChangeImage = (file: File) => {
    const { filesToUpload = [] } = values;
    setFieldValue('filesToUpload', [...filesToUpload, file]);
  };

  const removeImageFromImages = (image: ImageDto) => () => {
    const { images, imagesToDelete = [] } = values;
    setFieldValue('imagesToDelete', [...imagesToDelete, image]);
    setFieldValue(
      'images',
      images.filter((img) => img.id !== image.id),
    );
  };

  const removeImageFromFiles = (index: number) => () => {
    const { filesToUpload = [] } = values;
    setFieldValue(
      'filesToUpload',
      filesToUpload.filter((file, i) => i !== index),
    );
  };

  return (
    <div className={classes.images}>
      <ProductImageContainer>
        {values.images?.map((image) => (
          <ProductImage
            key={image.imageUrl}
            imageUrl={image.imageUrl}
            onRemove={removeImageFromImages(image)}
          />
        ))}
        {values.filesToUpload?.map((file, index) => (
          <ProductImage key={file.name} file={file} onRemove={removeImageFromFiles(index)} />
        ))}
        <ProductImageInput onChange={handleChangeImage} />
      </ProductImageContainer>
    </div>
  );
}

export default ImageForm;
