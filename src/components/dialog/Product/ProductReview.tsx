import { ProductDto, ProductFormValues } from 'features/product/interface';
import React from 'react';
import { useFormikContext } from 'formik';
import ProductDetails from '../ProductDetail/ProductDetails';

export interface ProductReviewProps {}

function ProductReview() {
  const { values } = useFormikContext<ProductFormValues>();

  return <ProductDetails product={values as ProductDto} filesToUpload={values.filesToUpload} />;
}

export default ProductReview;
