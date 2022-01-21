import { Button } from '@mui/material';
import React, { useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';

export interface ProductImageInputProps {
  onChange: (file: File) => void;
}

function ProductImageInput({ onChange }: ProductImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = () => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length) {
      const file = fileInputRef.current.files[0];
      if (file) {
        onChange(file);
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="before:inline-block relative before:pb-[100%] before:content-['']">
      <Button
        className="!absolute w-full h-full !rounded-xl !border-dashed"
        variant="outlined"
        color="primary"
        onClick={() => fileInputRef.current?.click()}
      >
        <AddIcon fontSize="large" />
      </Button>
      <input hidden ref={fileInputRef} type="file" accept="image/jpg" onChange={handleChangeFile} />
    </div>
  );
}

export default ProductImageInput;
