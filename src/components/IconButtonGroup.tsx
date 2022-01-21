import classnames from 'classnames';
import React, { forwardRef, ReactElement } from 'react';

export interface IconButtonGroupProps {
  className?: string;
  children?: ReactElement | ReactElement[];
}

const IconButtonGroup = forwardRef(({ children, className }: IconButtonGroupProps, ref: any) => (
  <div ref={ref} className={classnames('bg-blue-100/20 rounded-full', className)}>
    {children}
  </div>
));

export default IconButtonGroup;
