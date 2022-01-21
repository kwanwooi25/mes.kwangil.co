import classNames from 'classnames';
import { useDialog } from 'features/dialog/dialogHook';
import { PlateDto } from 'features/plate/interface';
import { plateApi } from 'features/plate/plateApi';
import React, { memo, useMemo } from 'react';
import { getPlateTitle } from 'utils/plate';
import { highlight } from 'utils/string';
import { LoadingButton } from '@mui/lab';
import PlateDetailDialog from './dialog/PlateDetail';

export interface PlateNameProps {
  className?: string;
  linkClassName?: string;
  plate: PlateDto;
  searchText?: string;
}

function PlateName({ plate, className, linkClassName, searchText = '' }: PlateNameProps) {
  const { openDialog, closeDialog } = useDialog();

  const plateNameHTML = useMemo(
    () => highlight(getPlateTitle(plate), searchText),
    [plate, searchText],
  );

  const openDetailDialog = async () => {
    const plateDetail = await plateApi.getPlate(plate.id);
    openDialog(<PlateDetailDialog plate={plateDetail} onClose={closeDialog} />);
  };

  return (
    <LoadingButton
      className={classNames('!justify-start !min-w-0 max-w-max', className)}
      onClick={openDetailDialog}
      loadingPosition="end"
      endIcon={<span />}
      color="inherit"
    >
      <p
        className={classNames('truncate', linkClassName)}
        dangerouslySetInnerHTML={{ __html: plateNameHTML }}
      />
    </LoadingButton>
  );
}

export default memo(PlateName);
