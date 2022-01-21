import { useAppDispatch } from 'app/store';
import Input from 'ui/elements/Input';
import Loading from 'ui/elements/Loading';
import { push } from 'connected-react-router';
import { Path } from 'const';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';

import { Button } from '@mui/material';

import { useLoginMutation } from 'features/auth/authHook';
import { LoginDto } from 'features/auth/interface';

function LoginPage() {
  const { t } = useTranslation('auth');

  const dispatch = useAppDispatch();
  const { login, isLoggingIn } = useLoginMutation();

  const { values, touched, errors, handleChange, handleSubmit } = useFormik<LoginDto>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: object({
      email: string().email(t('emailInvalid')).required(t('emailRequired')),
      password: string().required(t('passwordRequired')),
    }),
    onSubmit: (submitValues) => {
      login(submitValues);
    },
  });

  const goToRegisterPage = () => dispatch(push(Path.REGISTER));

  return (
    <div className="flex flex-col justify-start items-center w-screen h-screen tablet:flex-row">
      <div className="flex flex-col justify-end items-center p-8 w-full h-[45%] text-white bg-primary tablet:justify-center tablet:items-end tablet:w-[45%] tablet:h-full">
        <img
          className="mb-4 w-full max-w-[240px]"
          src="/kwangil_logo_name_white.png"
          alt="kwangil logo"
        />
        <h2 className="text-2xl">{t('common:appName')}</h2>
      </div>
      <form
        className="flex relative flex-col justify-start items-center p-4 w-full max-w-[400px] tablet:p-8"
        noValidate
        onSubmit={handleSubmit}
      >
        {isLoggingIn && <Loading />}
        <Input
          id="email"
          name="email"
          label={t('email')}
          value={values.email}
          onChange={handleChange}
          error={touched.email && !!errors.email}
          helperText={touched.email && errors.email}
          autoFocus
        />
        <Input
          id="password"
          name="password"
          type="password"
          label={t('password')}
          value={values.password}
          onChange={handleChange}
          error={touched.password && !!errors.password}
          helperText={touched.password && errors.password}
        />
        <Button
          className="!mt-2"
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="primary"
          disableElevation
          disabled={isLoggingIn}
        >
          {t('login')}
        </Button>
        <Button
          className="!mt-2"
          fullWidth
          size="large"
          color="primary"
          disableElevation
          onClick={goToRegisterPage}
        >
          {t('register')}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
