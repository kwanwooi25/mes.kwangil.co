import React from 'react';
import classnames from 'classnames';

export interface ProductImageContainerProps {
  className?: string;
  children: any;
}

function ProductImageContainer({ className, children }: ProductImageContainerProps) {
  return (
    <div
      className={classnames(
        'grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ProductImageContainer;
