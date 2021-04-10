import { useAppSelector } from 'store';

export const useAuth = () => {
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  return { isLoading, isLoggedIn, currentUser };
};
