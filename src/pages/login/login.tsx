import { LoginUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../slices/userSlice';

type TFromLocation = Pick<
  ReturnType<typeof useLocation>,
  'pathname' | 'search' | 'hash'
>;

type TLoginLocationState = {
  from?: TFromLocation;
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, error } = useSelector((state) => state.user);

  const locationState = location.state as TLoginLocationState | null;
  const from = locationState?.from;
  const targetPath = from ? `${from.pathname}${from.search}${from.hash}` : '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        void navigate(targetPath, { replace: true });
      })
      .catch((error: unknown) => {
        console.error('Не удалось войти в аккаунт:', error);
      });
  };

  if (user) {
    return <Navigate to={targetPath} replace />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
