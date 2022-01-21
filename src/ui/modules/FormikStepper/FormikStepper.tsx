/* eslint-disable react/no-unused-prop-types */
import RoundedButton from 'ui/elements/RoundedButton';
import { Form, Formik, FormikConfig, FormikHelpers, FormikValues } from 'formik';
import React, { createRef, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Step, StepLabel, Stepper } from '@mui/material';
import { Done, NavigateBefore, NavigateNext } from '@mui/icons-material';
import Dialog from 'features/dialog/Dialog';

interface FormikStepProps<Values>
  extends Pick<FormikConfig<Values>, 'children' | 'validationSchema'> {
  label: string;
  isPrevButtonDisabled?: boolean;
}

export function FormikStep<Values extends FormikValues>({ children }: FormikStepProps<Values>) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export enum StepperType {
  NONE = 'none',
  DEFAULT = 'default',
  COUNTER = 'counter',
}

interface FormikStepperProps<Values> extends FormikConfig<Values> {
  initialStep?: number;
  stepperType?: StepperType;
}

function FormikStepper<Values extends FormikValues>({
  initialStep = 0,
  stepperType = StepperType.DEFAULT,
  children,
  ...props
}: FormikStepperProps<Values>) {
  const { t } = useTranslation('common');
  const submitButtonRef = createRef<HTMLButtonElement>();

  const childrenArray = React.Children.toArray(children) as ReactElement<FormikStepProps<Values>>[];
  const [step, setStep] = useState<number>(initialStep);
  const lastStep = childrenArray.length - 1;
  const isFirstStep = step === 0;
  const isLastStep = step === lastStep;
  const currentForm = childrenArray[step];

  const moveToPrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  const moveToNextStep = () => {
    if (step < lastStep) {
      setStep(step + 1);
    }
  };

  const handleClickNext = () => {
    submitButtonRef?.current?.click();
  };

  const handleSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    if (isLastStep) {
      await props.onSubmit(values, helpers);
    } else {
      moveToNextStep();
    }
  };

  return (
    <>
      {stepperType === StepperType.DEFAULT && (
        <Stepper className="mb-4" activeStep={step} alternativeLabel>
          {childrenArray.map(({ props: { label } }) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {stepperType === StepperType.COUNTER && (
        <div className="px-6 pb-4">
          {step + 1} / {lastStep + 1}
        </div>
      )}
      <Dialog.Content dividers className="min-h-[320px]">
        <Formik
          {...props}
          validationSchema={currentForm?.props.validationSchema}
          onSubmit={handleSubmit}
        >
          <Form autoComplete="off" style={{ height: '100%' }}>
            {currentForm}
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button ref={submitButtonRef} type="submit" style={{ display: 'none' }} />
          </Form>
        </Formik>
      </Dialog.Content>
      <Dialog.Actions className="!justify-between">
        <RoundedButton
          color="primary"
          variant="outlined"
          size="large"
          startIcon={<NavigateBefore />}
          onClick={moveToPrevStep}
          disabled={isFirstStep || currentForm?.props.isPrevButtonDisabled}
        >
          {t('prev')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          startIcon={isLastStep && <Done />}
          endIcon={!isLastStep && <NavigateNext />}
          onClick={handleClickNext}
        >
          {t(isLastStep ? 'save' : 'next')}
        </RoundedButton>
      </Dialog.Actions>
    </>
  );
}

export default FormikStepper;
