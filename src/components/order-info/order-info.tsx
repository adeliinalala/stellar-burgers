import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

import type { TIngredient, TOrder } from '@utils-types';

type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  const feedOrders = useSelector((state) => state.feed.orders);
  const ingredients = useSelector(
    (state): TIngredient[] => state.ingredients.ingredients
  );

  const [loadedOrder, setLoadedOrder] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const orderFromFeed = feedOrders.find((order) => order.number === Number(number));

  useEffect(() => {
    if (!number || orderFromFeed) return;

    let isMounted = true;
    setIsLoading(true);

    getOrderByNumberApi(Number(number))
      .then((response) => {
        if (isMounted) {
          setLoadedOrder(response.orders[0] ?? null);
        }
      })
      .catch((error: unknown) => {
        console.error('Не удалось загрузить заказ:', error);
        if (isMounted) {
          setLoadedOrder(null);
        }
      })
      .finally((): void => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return (): void => {
      isMounted = false;
    };
  }, [number, orderFromFeed]);

  const orderData = orderFromFeed ?? loadedOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, ingredientId): TIngredientsWithCount => {
        const ingredient = ingredients.find((item) => item._id === ingredientId);

        if (!ingredient) return acc;

        if (!acc[ingredientId]) {
          acc[ingredientId] = { ...ingredient, count: 1 };
        } else {
          acc[ingredientId].count += 1;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
