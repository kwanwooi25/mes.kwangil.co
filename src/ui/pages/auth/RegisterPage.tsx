import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import Loading from 'components/Loading';
import { push } from 'connected-react-router';
import { Path } from 'const';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { object, ref, string } from 'yup';

import { Button } from '@mui/material';

import { useRegisterUserMutation } from 'features/auth/authHook';
import { SignUpDto } from 'features/auth/interface';

function RegisterPage() {
  const { t } = useTranslation('auth');

  const dispatch = useAppDispatch();
  const { registerUser, isLoading } = useRegisterUserMutation();

  const { values, touched, errors, handleChange, handleSubmit } = useFormik<
    SignUpDto & { passwordConfirm: string }
  >({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
    validationSchema: object({
      email: string().email(t('emailInvalid')).required(t('emailRequired')),
      password: string().required(t('passwordRequired')),
      passwordConfirm: string()
        .required(t('passwordConfirmRequired'))
        .oneOf([ref('password'), null], t('passwordsMustMatch')),
      name: string().required(t('nameRequired')),
    }),
    onSubmit: ({ passwordConfirm, ...submitValues }) => {
      registerUser(submitValues);
    },
  });

  const goToLoginPage = () => dispatch(push(Path.LOGIN));

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
        {isLoading && <Loading />}
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
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          label={t('passwordConfirm')}
          value={values.passwordConfirm}
          onChange={handleChange}
          error={touched.passwordConfirm && !!errors.passwordConfirm}
          helperText={touched.passwordConfirm && errors.passwordConfirm}
        />
        <Input
          id="name"
          name="name"
          label={t('name')}
          value={values.name}
          onChange={handleChange}
          error={touched.name && !!errors.name}
          helperText={touched.name && errors.name}
        />
        <Button
          className="!mt-2"
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          color="primary"
          disableElevation
          disabled={isLoading}
        >
          {t('register')}
        </Button>
        <Button
          className="!mt-2"
          fullWidth
          size="large"
          color="primary"
          disableElevation
          onClick={goToLoginPage}
        >
          {t('login')}
        </Button>
      </form>
    </div>
  );
}

export default RegisterPage;
