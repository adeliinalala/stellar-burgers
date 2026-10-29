import { ProfileOrdersUI } from '@ui-pages';
import { useEffect, useState } from 'react';

import { getOrdersApi } from '../../utils/burger-api';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const [orders, setOrders] = useState<TOrder[]>([]);

  useEffect(() => {
    let isMounted = true;

    getOrdersApi()
      .then((data): void => {
        if (isMounted) {
          setOrders(data);
        }
      })
      .catch((error: unknown): void => {
        console.error('Не удалось загрузить историю заказов:', error);
      });

    return (): void => {
      isMounted = false;
    };
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
