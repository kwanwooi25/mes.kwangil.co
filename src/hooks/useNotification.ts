import { useAppDispatch } from 'app/store';
import { notificationActions, NotifyActionPayload } from 'features/notification/notificationSlice';

export default function useNotification() {
  const dispatch = useAppDispatch();
  const notify = (notifyActionPayload: NotifyActionPayload) => {
    dispatch(notificationActions.notify(notifyActionPayload));
  };

  return { notify };
}
