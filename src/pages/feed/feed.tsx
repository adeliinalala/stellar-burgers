import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../slices/feedSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.feed);

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    const errorMessage =
      error instanceof Error ? error.message : 'Не удалось загрузить ленту заказов';

    return <p>{errorMessage}</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
