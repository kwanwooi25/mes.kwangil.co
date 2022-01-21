import classNames from 'classnames';
import React, { ReactElement } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';

export interface DashboardCardProps {
  className?: string;
  title: string;
  onRefresh?: () => void;
  headerButton?: ReactElement;
  children?: ReactElement | ReactElement[];
}

function DashboardCard({
  className,
  title,
  onRefresh,
  headerButton,
  children,
}: DashboardCardProps) {
  return (
    <div className={classNames('border border-blue-800/10 rounded-md w-full', className)}>
      <div className="flex justify-between items-center py-2 px-4 bg-blue-300/10 rounded-t-md border-b border-b-blue-200/10">
        <div className="flex gap-1 items-center">
          <h3 className="text-xl text-blue-900">{title}</h3>
          {!!onRefresh && (
            <IconButton size="small" onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          )}
        </div>
        {headerButton}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

export default DashboardCard;
