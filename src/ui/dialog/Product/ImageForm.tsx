import { ImageDto, ProductFormValues } from 'features/product/interface';
import ProductImage from 'ui/modules/ProductImage/ProductImage';
import React from 'react';
import { useFormikContext } from 'formik';

function ImageForm() {
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
    <ProductImage.Container>
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
      <ProductImage.Input onChange={handleChangeImage} />
    </ProductImage.Container>
  );
}

export default ImageForm;
