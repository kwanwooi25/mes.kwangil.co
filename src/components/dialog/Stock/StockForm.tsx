import Input from 'components/form/Input';
import { CreateStockDto, ProductDto, StockDto } from 'features/product/interface';
import { useFormikContext } from 'formik';
import { useScreenSize } from 'hooks/useScreenSize';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getProductSize } from 'utils/product';

import { createStyles, Divider, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stockForm: {
      display: 'grid',
      gridTemplateColumns: '1fr 124px',
      gridGap: theme.spacing(2),
      padding: theme.spacing(1, 0),
      alignItems: 'center',
      minHeight: '118px',
      [theme.breakpoints.up('md')]: {
        minHeight: '92px',
      },
    },
    productDetail: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gridTemplateAreas: `
        "productImage accountName"
        "productImage productName"
        "productImage productSize"
      `,
      gridColumnGap: theme.spacing(1),
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '2fr 3fr 2fr',
        gridTemplateAreas: `
          "accountName productName productSize"
        `,
      },
    },
    productImage: {
      gridArea: 'productImage',
      '& > img': {
        maxHeight: '80px',
      },
    },
    accountName: { gridArea: 'accountName' },
    productName: {
      gridArea: 'productName',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    productSize: { gridArea: 'productSize' },
  }),
);

export interface StockFormProps {
  index: number;
  product: ProductDto;
}

function StockForm({ index, product }: StockFormProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { isMobileLayout } = useScreenSize();

  const { account, name, images } = product;
  const productSize = getProductSize(product);
  const productImageUrl = !!images && images.length ? images[0].imageUrl : undefined;

  const { values, touched, errors, handleChange } =
    useFormikContext<(CreateStockDto | StockDto)[]>();

  return (
    <>
      {index !== 0 && <Divider />}
      <div className={classes.stockForm}>
        <div className={classes.productDetail}>
          {isMobileLayout && (
            <div className={classes.productImage}>
              {productImageUrl && <img src={productImageUrl} alt="product" />}
            </div>
          )}

          <Typography className={classes.accountName} variant="caption">
            {account.name}
          </Typography>
          <Typography className={classes.productName} variant="h6">
            {name}
          </Typography>
          <Typography className={classes.productSize} variant="subtitle1">
            {productSize}
          </Typography>
        </div>

        <Input
          type="number"
          name={`[${index}].balance`}
          label={t('products:balance')}
          value={values[index].balance}
          onChange={handleChange}
          error={touched[index]?.balance && !!errors[index]?.balance}
          helperText={touched[index]?.balance && errors[index]?.balance}
          autoFocus={index === 0}
          size={isMobileLayout ? 'medium' : 'small'}
          margin={isMobileLayout ? 'normal' : 'dense'}
        />
      </div>
    </>
  );
}

export default StockForm;
