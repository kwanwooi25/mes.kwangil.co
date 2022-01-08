/* eslint-disable react/no-unused-prop-types */
import RoundedButton from 'components/RoundedButton';
import { Form, Formik, FormikConfig, FormikHelpers, FormikValues } from 'formik';
import React, { createRef, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  createStyles,
  DialogActions,
  DialogContent,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Theme,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    counterStepper: {
      padding: theme.spacing(0, 3, 2),
    },
    dialogContent: {
      padding: theme.spacing(1, 3),
      minHeight: '320px',
    },
    actionButtons: {
      padding: theme.spacing(3),
      display: 'flex',
      justifyContent: 'space-between',
      '& button': {
        maxWidth: '120px',
      },
    },
  }),
);

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
  const classes = useStyles();
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
        <Stepper activeStep={step} alternativeLabel>
          {childrenArray.map(({ props: { label } }) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {stepperType === StepperType.COUNTER && (
        <div className={classes.counterStepper}>
          {step + 1} / {lastStep + 1}
        </div>
      )}
      <DialogContent dividers className={classes.dialogContent}>
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
      </DialogContent>
      <DialogActions className={classes.actionButtons}>
        <RoundedButton
          color="primary"
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<NavigateBeforeIcon />}
          onClick={moveToPrevStep}
          disabled={isFirstStep || currentForm?.props.isPrevButtonDisabled}
        >
          {t('prev')}
        </RoundedButton>
        <RoundedButton
          color="primary"
          size="large"
          fullWidth
          startIcon={isLastStep && <DoneIcon />}
          endIcon={!isLastStep && <NavigateNextIcon />}
          onClick={handleClickNext}
        >
          {t(isLastStep ? 'save' : 'next')}
        </RoundedButton>
      </DialogActions>
    </>
  );
}

export default FormikStepper;
