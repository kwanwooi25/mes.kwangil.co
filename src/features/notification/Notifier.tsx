import { useAppDispatch, useAppSelector } from 'app/store';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Notification, notificationActions } from './notificationSlice';

let displayed: string[] = [];

function Notifier() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notification);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (key: string) => {
    displayed = [...displayed, key];
  };

  const removeDisplayed = (key: string) => {
    displayed = displayed.filter((k) => k !== key);
  };

  useEffect(() => {
    notifications.forEach(({ key, message, options = {}, dismissed = false }: Notification) => {
      if (dismissed) {
        closeSnackbar();
        return;
      }

      if (displayed.includes(key)) {
        return;
      }

      enqueueSnackbar(t(message) || message, {
        key,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) options.onClose(event, reason, myKey);
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
}

export default Notifier;
