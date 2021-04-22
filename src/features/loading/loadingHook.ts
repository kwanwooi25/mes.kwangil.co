import { loadingActions, loadingSelector } from './loadingSlice';
import { useAppSelector } from 'app/store';

export const useLoading = () => {
  const loadingState = useAppSelector(loadingSelector);
  return { ...loadingState, ...loadingActions };
};
