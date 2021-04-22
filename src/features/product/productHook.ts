import { productActions, productSelector } from './productSlice';

import { ProductDto } from './interface';
import { useAppSelector } from 'app/store';

export const useProducts = () => {
  const productState = useAppSelector(productSelector);
  const { ids, entities, selectedIds } = productState;
  const products = ids.map((id) => entities[id] as ProductDto);
  const isSelectMode = !!selectedIds.length;

  return {
    ...productState,
    products,
    isSelectMode,
    ...productActions,
  };
};
