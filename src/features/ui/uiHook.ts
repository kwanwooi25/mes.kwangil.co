import { useAppSelector } from 'app/store';
import { uiActions, uiSelector } from './uiSlice';

export const useUI = () => {
  const uiState = useAppSelector(uiSelector);

  return { ...uiState, ...uiActions };
};
