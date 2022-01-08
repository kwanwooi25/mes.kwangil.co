import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import Loading from 'components/Loading';
import { push } from 'connected-react-router';
import { Path } from 'const';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { object, ref, string } from 'yup';

import { Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

import { useRegisterUserMutation } from './authHook';
import { SignUpDto } from './interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    registerPage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
      },
    },
    registerHeader: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      background: theme.palette.primary.main,
      color: theme.palette.background.paper,
      height: '45%',
      width: '100%',
      padding: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '100%',
        width: '45%',
        padding: theme.spacing(8),
      },
    },
    logo: {
      width: '100%',
      maxWidth: '240px',
      marginBottom: theme.spacing(2),
    },
    registerForm: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      padding: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: theme.spacing(8),
      },
    },
    submitButton: {
      marginTop: theme.spacing(2),
    },
    loginButton: {
      marginTop: theme.spacing(2),
    },
  }),
);

function RegisterPage() {
  const { t } = useTranslation('auth');
  const classes = useStyles();

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
    <div className={classes.registerPage}>
      <div className={classes.registerHeader}>
        <img className={classes.logo} src="/kwangil_logo_name_white.png" alt="kwangil logo" />
        <Typography component="h2" variant="h5" align="center">
          {t('common:appName')}
        </Typography>
      </div>
      <form className={classes.registerForm} noValidate onSubmit={handleSubmit}>
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
          className={classes.submitButton}
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
          className={classes.loginButton}
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
