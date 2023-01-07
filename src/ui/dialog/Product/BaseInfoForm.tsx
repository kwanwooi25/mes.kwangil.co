import { ProductLength, ProductThickness, ProductWidth } from 'const';
import { accountApi } from 'features/account/accountApi';
import { AccountOption } from 'features/account/interface';
import { ProductFormValues } from 'features/product/interface';
import { useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Input from 'ui/elements/Input';
import SelectAccount from 'ui/elements/SelectAccount';

function BaseInfoForm() {
  const { t } = useTranslation('products');
  const { values, touched, errors, handleChange, handleBlur, setFieldValue } =
    useFormikContext<ProductFormValues>();

  const handleChangeAccount = async (e: ChangeEvent<{}>, value: AccountOption | null) => {
    setFieldValue('account', value);
    if (value) {
      const selectedAccount = await accountApi.getAccount(value.id);
      setFieldValue('deliveryMethod', selectedAccount.deliveryMethod);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-x-3">
      <SelectAccount
        className="col-span-3"
        value={values.account}
        onChange={handleChangeAccount}
        onBlur={handleBlur}
        errorMessage={touched.account ? errors.account : ''}
      />
      <Input
        className="col-span-3"
        name="name"
        label={t('name')}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
      />
      <Input
        className="col-span-2"
        type="number"
        name="thickness"
        label={t('thickness')}
        value={values.thickness}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.thickness && Boolean(errors.thickness)}
        helperText={touched.thickness && errors.thickness}
        inputProps={{
          step: ProductThickness.STEP,
          min: ProductThickness.MIN,
          max: ProductThickness.MAX,
        }}
      />
      <Input
        className="col-span-2"
        type="number"
        name="length"
        label={t('length')}
        value={values.length}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.length && Boolean(errors.length)}
        helperText={touched.length && errors.length}
        inputProps={{ step: ProductLength.STEP, min: ProductLength.MIN, max: ProductLength.MAX }}
      />
      <Input
        className="col-span-2"
        type="number"
        name="width"
        label={t('width')}
        value={values.width}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.width && Boolean(errors.width)}
        helperText={touched.width && errors.width}
        inputProps={{ step: ProductWidth.STEP, min: ProductWidth.MIN, max: ProductWidth.MAX }}
      />
      <Input
        className="col-span-6"
        name="productMemo"
        label={t('productMemo')}
        value={values.productMemo}
        onChange={handleChange}
        multiline
      />
    </div>
  );
}

export default BaseInfoForm;
