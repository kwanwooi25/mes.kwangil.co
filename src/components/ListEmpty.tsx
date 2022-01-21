import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ListEmptyProps {
  message?: string;
}

function ListEmpty({ message }: ListEmptyProps) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col justify-center items-center py-16 px-8 w-full h-full">
      <ErrorOutlineIcon className="!text-5xl" color="primary" />
      <p className="text-primary">{message || t('listEmpty')}</p>
    </div>
  );
}

export default ListEmpty;
