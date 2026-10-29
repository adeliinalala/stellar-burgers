import { AppHeaderUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import { logoutUser } from '../../slices/userSlice';

export const AppHeader = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const userName = user?.name;

  const onLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        window.location.href = '/login';
      })
      .catch((error: unknown) => {
        console.error('Не удалось выйти из аккаунта:', error);
      });
  };

  return <AppHeaderUI userName={userName} onLogout={onLogout} />;
};
