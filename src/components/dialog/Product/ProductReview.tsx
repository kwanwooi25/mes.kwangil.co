import ProductDetails from '../ProductDetail/ProductDetails';
import { ProductDto } from 'features/product/interface';
import { ProductFormValues } from '.';
import React from 'react';
import { useFormikContext } from 'formik';

export interface ProductReviewProps {}

const ProductReview = (props: ProductReviewProps) => {
  const { values } = useFormikContext<ProductFormValues>();

  return <ProductDetails product={values as ProductDto} filesToUpload={values.filesToUpload} />;
};

export default ProductReview;
