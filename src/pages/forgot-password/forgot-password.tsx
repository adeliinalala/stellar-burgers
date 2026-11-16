import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
      void navigate('/reset-password', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось отправить запрос на восстановление пароля'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={(e) => {
        void handleSubmit(e);
      }}
    />
  );
};
