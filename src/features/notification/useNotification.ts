import { useAppDispatch } from 'app/store';
import { notificationActions, NotifyActionPayload } from 'features/notification/notificationSlice';
import { useCallback } from 'react';

export default function useNotification() {
  const dispatch = useAppDispatch();
  const notify = useCallback(
    (notifyActionPayload: NotifyActionPayload) => {
      dispatch(notificationActions.notify(notifyActionPayload));
    },
    [dispatch, notificationActions.notify],
  );

  return { notify };
}
