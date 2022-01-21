import React, { useEffect, useState } from 'react';
import { Close, OpenInNew } from '@mui/icons-material';
import ProductImageContainer from './ProductImageContainer';
import ProductImageInput from './ProductImageInput';

export interface ProductImageProps {
  imageUrl?: string;
  file?: File;
  onClick?: () => void;
  onRemove?: () => void;
}

function ProductImage({ imageUrl, file, onClick, onRemove }: ProductImageProps) {
  const [imageDataUrl, setImageDataUrl] = useState<string>();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        setImageDataUrl((e?.target?.result as ArrayBuffer).toString());
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="before:inline-block relative before:pb-[100%] before:content-['']">
      <img
        className="max-w-full max-h-full absolute-center"
        src={imageUrl || imageDataUrl}
        alt="product"
      />
      {onClick && (
        <button
          className="w-[50%] h-[50%] text-transparent hover:text-gray-700 hover:bg-white/80 rounded-full transition-colors absolute-center"
          type="button"
          onClick={onClick}
        >
          <OpenInNew />
        </button>
      )}
      {onRemove && (
        <button
          className="absolute top-3 right-3 w-12 h-12 bg-gray-100/70 hover:bg-gray-100/80 rounded-full transition-colors translate-x-[50%] translate-y-[-50%]"
          type="button"
          onClick={onRemove}
        >
          <Close />
        </button>
      )}
    </div>
  );
}

ProductImage.Container = ProductImageContainer;
ProductImage.Input = ProductImageInput;

export default ProductImage;
