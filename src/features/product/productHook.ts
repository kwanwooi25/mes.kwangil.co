import { productActions, productSelector } from './productSlice';

import { ProductDto } from './interface';
import { useAppSelector } from 'app/store';

export const useProducts = () => {
  const productState = useAppSelector(productSelector);
  const products = productState.ids.map((id) => productState.entities[id] as ProductDto);

  return {
    ...productState,
    products,
    ...productActions,
  };
};
