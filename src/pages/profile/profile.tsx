import { ProfileUI } from '@ui-pages';
import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { setUser } from '../../slices/userSlice';
import { updateUserApi } from '../../utils/burger-api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    Boolean(formValue.password);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
    setError('');
  };

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!isFormChanged || isSaving) return;

    setIsSaving(true);

    try {
      const data: { name: string; email: string; password?: string } = {
        name: formValue.name,
        email: formValue.email,
      };

      if (formValue.password) {
        data.password = formValue.password;
      }

      const response = await updateUserApi(data);

      dispatch(setUser(response.user));

      setFormValue({
        name: response.user.name,
        email: response.user.email,
        password: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить изменения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={(e) => {
          void handleSubmit(e);
        }}
        handleInputChange={handleInputChange}
      />
      {error && <p role="alert">{error}</p>}
      {isSaving && <p>Сохранение...</p>}
    </>
  );
};
