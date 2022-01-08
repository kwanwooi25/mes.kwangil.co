import classnames from 'classnames';
import { useDialog } from 'features/dialog/dialogHook';
import { PlateDto } from 'features/plate/interface';
import { plateApi } from 'features/plate/plateApi';
import React, { memo } from 'react';
import { getPlateTitle } from 'utils/plate';
import { highlight } from 'utils/string';

import { createStyles, Link, makeStyles } from '@material-ui/core';

import PlateDetailDialog from './dialog/PlateDetail';

const useStyles = makeStyles(() =>
  createStyles({
    plateNameLink: {
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
      fontSize: '16px',
    },
    plateName: {},
  }),
);

export interface PlateNameProps {
  className?: string;
  linkClassName?: string;
  plate: PlateDto;
  searchText?: string;
}

function PlateName({ plate, className, linkClassName, searchText = '' }: PlateNameProps) {
  const classes = useStyles();
  const { openDialog, closeDialog } = useDialog();

  const openDetailDialog = async () => {
    const plateDetail = await plateApi.getPlate(plate.id);
    openDialog(<PlateDetailDialog plate={plateDetail} onClose={closeDialog} />);
  };

  return (
    <div className={className}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link
        className={classnames(classes.plateNameLink, linkClassName)}
        component="button"
        variant="h6"
        color="initial"
        onClick={openDetailDialog}
      >
        <span
          className={classes.plateName}
          dangerouslySetInnerHTML={{ __html: highlight(getPlateTitle(plate), searchText) }}
        />
      </Link>
    </div>
  );
}

export default memo(PlateName);
