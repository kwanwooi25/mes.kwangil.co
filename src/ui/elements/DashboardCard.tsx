import React, { ReactElement } from 'react';
import classNames from 'classnames';

import { IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

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
      <div className="flex justify-between items-center p-2 bg-blue-300/10 rounded-t-md border-b border-b-blue-200/10">
        <div className="flex gap-1 items-center">
          <Typography className="text-blue-900" component="h3" variant="h6">
            {title}
          </Typography>
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
