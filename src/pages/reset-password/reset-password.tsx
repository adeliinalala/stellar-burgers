import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      void navigate('/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось восстановить пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordUI
      errorText={error ?? undefined}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
