import { Notification, notificationActions } from './notificationSlice';
import { useAppDispatch, useAppSelector } from 'app/store';

import { useEffect } from 'react';
import { useScreenSize } from 'hooks/useScreenSize';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

let displayed: string[] = [];

const Notifier = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notification);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { isMobileLayout } = useScreenSize();

  const storeDisplayed = (key: string) => {
    displayed = [...displayed, key];
  };

  const removeDisplayed = (key: string) => {
    displayed = displayed.filter((k) => k !== key);
  };

  useEffect(() => {
    notifications.forEach(({ key, message, options = {}, dismissed = false }: Notification) => {
      if (dismissed) {
        return closeSnackbar();
      }

      if (displayed.includes(key)) {
        return;
      }

      enqueueSnackbar(t(message) || message, {
        key,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: isMobileLayout ? 'top' : 'bottom',
          horizontal: isMobileLayout ? 'center' : 'right',
        },
        ...options,
        onClose: (event, reason, myKey) => {
          options.onClose && options.onClose(event, reason, myKey);
        },
        onExited: (event, myKey) => {
          dispatch(notificationActions.remove(`${myKey}`));
          removeDisplayed(`${myKey}`);
        },
      });

      storeDisplayed(key);
    });
  }, [notifications, enqueueSnackbar, closeSnackbar, dispatch]);

  return null;
};

export default Notifier;
