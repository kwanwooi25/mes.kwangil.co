import { Link, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import { PlateDto } from 'features/plate/interface';
import classnames from 'classnames';
import { getPlateTitle } from 'utils/plate';
import { highlight } from 'utils/string';
import { plateApi } from 'features/plate/plateApi';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    plateNameLink: {
      maxWidth: '200px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    plateName: {},
  })
);

export interface PlateNameProps {
  className?: string;
  linkClassName?: string;
  plate: PlateDto;
  searchText?: string;
}

const PlateName = ({ plate, className, linkClassName, searchText = '' }: PlateNameProps) => {
  const classes = useStyles();

  const openDetailDialog = async () => {
    const plateDetail = await plateApi.getPlate(plate.id);
    console.log(plateDetail);
    // TODO: open detail dialog
  };

  return (
    <div className={className}>
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
};

export default memo(PlateName);
