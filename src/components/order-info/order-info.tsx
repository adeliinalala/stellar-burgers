import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../slices/orderInfoSlice';

import type { TIngredient, TOrder } from '@utils-types';

type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const ingredients = useSelector(
    (state): TIngredient[] => state.ingredients.ingredients
  );

  const loadedOrder = useSelector((state) => state.orderInfo.order);
  const isLoading = useSelector((state) => state.orderInfo.isLoading);
  const error = useSelector((state) => state.orderInfo.error);

  const orderFromLists =
    feedOrders.find((order) => order.number === Number(number)) ??
    profileOrders.find((order) => order.number === Number(number));

  useEffect(() => {
    if (!number || orderFromLists) return;

    void dispatch(fetchOrderByNumber(Number(number)));
  }, [dispatch, number, orderFromLists]);

  const orderData: TOrder | null = orderFromLists ?? loadedOrder;

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

  if (isLoading && !orderInfo) {
    return <Preloader />;
  }

  if (error || !orderInfo) {
    return <p>{error ?? 'Заказ не найден'}</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
