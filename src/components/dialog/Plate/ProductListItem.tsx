import { IconButton, ListItem } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ProductDto } from 'features/product/interface';
import React from 'react';
import { getProductSize } from 'utils/product';

export interface ProductListItemProps {
  product: ProductDto;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

function ProductListItem({
  product,
  isSelected = false,
  onSelect,
  onDelete,
}: ProductListItemProps) {
  return (
    <ListItem
      className="flex !justify-between items-center !mb-2 h-[90px] !rounded-xl !border !border-blue-200/10 !border-solid"
      selected={isSelected}
      onClick={onSelect}
      button
    >
      <div className="flex flex-col">
        <span className="text-xs">{product.account.name}</span>
        <span className="text-base truncate">{product.name}</span>
        <span className="text-sm">{getProductSize(product)}</span>
      </div>
      <div>
        {onSelect && (
          <IconButton onClick={onSelect} color="primary">
            <AddIcon />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={onDelete} color="inherit">
            <CloseIcon />
          </IconButton>
        )}
      </div>
    </ListItem>
  );
}

export default ProductListItem;
