import { PlateFilter } from 'features/plate/interface';
import { ProductDto } from 'features/product/interface';
import React, { memo, ReactNode } from 'react';
import { getProductTitle } from 'utils/product';
import { highlight } from 'utils/string';

export interface PlateProductListItemProps {
  product: ProductDto;
  filter: PlateFilter;
  children?: ReactNode | false | null;
}

const PlateProductListItem: React.FC<PlateProductListItemProps> = ({
  product,
  filter,
  children,
}) => {
  const productName = getProductTitle(product);
  return (
    <li className="flex gap-2 text-xs truncate">
      <span
        dangerouslySetInnerHTML={{
          __html: highlight(product.account.name, filter.accountName),
        }}
      />
      <span
        dangerouslySetInnerHTML={{
          __html: highlight(productName, filter.productName),
        }}
      />
      {children}
    </li>
  );
};

export default memo(PlateProductListItem);
