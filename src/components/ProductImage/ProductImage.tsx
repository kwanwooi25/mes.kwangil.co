import { IconButton, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import CloseIcon from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    productImage: {
      '& > img': {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '100%',
        maxHeight: '100%',
      },
    },
    removeButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      transform: 'translate(50%, -50%)',
      background: theme.palette.grey[100],
    },
    openInNewButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      height: '50%',
      color: 'transparent',
      '&:hover': {
        background: '#ffffffbf',
        color: theme.palette.grey[700],
      },
    },
  })
);

export interface ProductImageProps {
  imageUrl?: string;
  file?: File;
  onClick?: () => void;
  onRemove?: () => void;
}

const ProductImage = ({ imageUrl, file, onClick, onRemove }: ProductImageProps) => {
  const classes = useStyles();
  const [imageDataUrl, setImageDataUrl] = useState<string>();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function (e) {
        setImageDataUrl((e?.target?.result as ArrayBuffer).toString());
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className={classes.productImage}>
      <img src={imageUrl || imageDataUrl} alt="product" />
      {onClick && (
        <IconButton className={classes.openInNewButton} onClick={onClick}>
          <OpenInNewIcon />
        </IconButton>
      )}
      {onRemove && (
        <IconButton className={classes.removeButton} onClick={onRemove}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ProductImage;
