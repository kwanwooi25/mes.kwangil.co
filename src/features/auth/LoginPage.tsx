import { useAppDispatch } from 'app/store';
import Input from 'components/form/Input';
import Loading from 'components/Loading';
import { push } from 'connected-react-router';
import { Path } from 'const';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';

import { Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

import { useLoginMutation } from './authHook';
import { LoginDto } from './interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginPage: {
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
    loginHeader: {
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
    loginForm: {
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
    registerButton: {
      marginTop: theme.spacing(2),
    },
  }),
);

function LoginPage() {
  const { t } = useTranslation('auth');
  const classes = useStyles();

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
    <div className={classes.loginPage}>
      <div className={classes.loginHeader}>
        <img className={classes.logo} src="/kwangil_logo_name_white.png" alt="kwangil logo" />
        <Typography component="h2" variant="h5" align="center">
          {t('common:appName')}
        </Typography>
      </div>
      <form className={classes.loginForm} noValidate onSubmit={handleSubmit}>
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
          className={classes.submitButton}
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
          className={classes.registerButton}
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
