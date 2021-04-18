import { uiActions, uiSelector } from './uiSlice';

import { useAppSelector } from 'app/store';

export const useUI = () => {
  const uiState = useAppSelector(uiSelector);

  return { ...uiState, ...uiActions };
};
