import { PrintColorCount, PrintSide } from 'const';
import CustomToggleButton from 'ui/elements/CustomToggleButton';
import Input from 'ui/elements/Input';
import React from 'react';
import { capitalize } from 'lodash';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ProductFormValues } from 'features/product/interface';

function PrintForm() {
  const { t } = useTranslation('products');
  const { values, handleChange, setFieldValue } = useFormikContext<ProductFormValues>();

  const printSideOptions = Object.values(PrintSide).map((value) => ({
    value,
    label: t(`print${capitalize(value)}`),
  }));

  const handleChangePrintSide = (value: PrintSide) => {
    setFieldValue('printSide', value);
  };

  return (
    <div className="flex flex-col">
      <CustomToggleButton
        className="!py-2"
        value={values.printSide}
        onChange={handleChangePrintSide}
        options={printSideOptions}
      />
      <div className="grid grid-cols-[100px_1fr] gap-x-3 tablet:grid-cols-[80px_1fr_2fr]">
        <Input
          type="number"
          name="printFrontColorCount"
          label={t('printFrontColorCount')}
          value={values.printFrontColorCount}
          onChange={handleChange}
          inputProps={{
            step: PrintColorCount.STEP,
            min: PrintColorCount.MIN,
            max: PrintColorCount.MAX,
          }}
          disabled={values.printSide === PrintSide.NONE}
        />
        <Input
          name="printFrontColor"
          label={t('printFrontColor')}
          value={values.printFrontColor}
          onChange={handleChange}
          disabled={values.printSide === PrintSide.NONE}
        />
        <Input
          className="col-span-2 tablet:col-span-1"
          name="printFrontPosition"
          label={t('printFrontPosition')}
          value={values.printFrontPosition}
          onChange={handleChange}
          disabled={values.printSide === PrintSide.NONE}
        />
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-x-3 tablet:grid-cols-[80px_1fr_2fr]">
        <Input
          type="number"
          name="printBackColorCount"
          label={t('printBackColorCount')}
          value={values.printBackColorCount}
          onChange={handleChange}
          inputProps={{
            step: PrintColorCount.STEP,
            min: PrintColorCount.MIN,
            max: PrintColorCount.MAX,
          }}
          disabled={values.printSide !== PrintSide.DOUBLE}
        />
        <Input
          name="printBackColor"
          label={t('printBackColor')}
          value={values.printBackColor}
          onChange={handleChange}
          disabled={values.printSide !== PrintSide.DOUBLE}
        />
        <Input
          className="col-span-2 tablet:col-span-1"
          name="printBackPosition"
          label={t('printBackPosition')}
          value={values.printBackPosition}
          onChange={handleChange}
          disabled={values.printSide !== PrintSide.DOUBLE}
        />
      </div>
      <Input
        name="printMemo"
        label={t('printMemo')}
        value={values.printMemo}
        onChange={handleChange}
        disabled={values.printSide === PrintSide.NONE}
        multiline
      />
    </div>
  );
}

export default PrintForm;
