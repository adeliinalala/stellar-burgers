import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <a href="/" className={styles.link}>
          <BurgerIcon type="primary" />
          <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
        </a>

        <a href="/feed" className={styles.link}>
          <ListIcon type="primary" />
          <p className="text text_type_main-default ml-2">Лента заказов</p>
        </a>
      </div>

      <div className={styles.logo}>
        <a href="/">
          <Logo className="" />
        </a>
      </div>

      <div className={styles.link_position_last}>
        <a href="/profile" className={styles.link}>
          <ProfileIcon type="primary" />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </a>
      </div>
    </nav>
  </header>
);
