export { AppHeader } from './app-header';

import type { MouseEventHandler } from 'react';

export type TAppHeaderUIProps = {
  userName?: string;
  onLogout: MouseEventHandler<HTMLButtonElement>;
};
