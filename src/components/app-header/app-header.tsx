import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
