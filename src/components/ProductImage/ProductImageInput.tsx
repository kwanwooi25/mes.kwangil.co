import { Button, Theme, createStyles, makeStyles } from '@material-ui/core';
import React, { ChangeEvent, createRef } from 'react';

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageUploadButton: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: theme.spacing(2),
      borderStyle: 'dashed',
    },
  })
);

export interface ProductImageInputProps {
  onChange: (file: File) => void;
}

const ProductImageInput = ({ onChange }: ProductImageInputProps) => {
  const classes = useStyles();
  const fileInputRef = createRef<HTMLInputElement>();

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length) {
      const file = fileInputRef.current.files[0];
      if (file) {
        onChange(file);
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <Button
        className={classes.imageUploadButton}
        variant="outlined"
        color="primary"
        onClick={() => fileInputRef.current?.click()}
      >
        <AddIcon fontSize="large" />
      </Button>
      <input hidden ref={fileInputRef} type="file" accept="image/*" onChange={handleChangeFile} />
    </div>
  );
};

export default ProductImageInput;
