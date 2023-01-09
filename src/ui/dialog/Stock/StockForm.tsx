import React from 'react';
import { CreateStockDto, StockDto } from 'features/product/interface';
import { useFormikContext } from 'formik';
import Input from 'ui/elements/Input';

function StockForm() {
  const { values, touched, errors, handleChange, handleBlur } = useFormikContext<
    CreateStockDto | StockDto
  >();

  return (
    <div className="">
      <Input
        type="number"
        name="balance"
        label="재고 수량"
        value={values.balance}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.balance && Boolean(errors.balance)}
        helperText={touched.balance && errors.balance}
        inputProps={{ min: 0, max: Infinity, autoFocus: true }}
      />
    </div>
  );
}

export default StockForm;
