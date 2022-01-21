import React, { ReactNode } from 'react';
import classnames from 'classnames';

export interface CustomListSubHeaderProps {
  className?: string;
  children?: ReactNode | ReactNode[];
}

function CustomListSubHeader({ className, children }: CustomListSubHeaderProps) {
  return (
    <li
      className={classnames(
        'flex sticky justify-between p-3 my-2 bg-blue-200/10 rounded-md',
        className,
      )}
    >
      {children}
    </li>
  );
}

export default CustomListSubHeader;
