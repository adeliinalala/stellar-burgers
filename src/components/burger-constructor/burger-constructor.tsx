import { BurgerConstructorUI } from '@ui';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../slices/constructorSlice';
import { orderBurgerApi } from '../../utils/burger-api';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(
    (state): TConstructorState => state.burgerConstructor
  );

  const user = useSelector((state) => state.user.user);

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const onOrderClick = async (): Promise<void> => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    if (!user) {
      void navigate('/login', {
        state: { from: location },
      });
      return;
    }

    setOrderRequest(true);

    try {
      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(
          (ingredient: TConstructorIngredient) => ingredient._id
        ),
        constructorItems.bun._id,
      ];

      const response = await orderBurgerApi(ingredientIds);

      setOrderModalData(response.order);
      dispatch(clearConstructor());
    } catch (error) {
      console.error('Не удалось оформить заказ:', error);
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = (): void => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={() => {
        void onOrderClick();
      }}
      closeOrderModal={closeOrderModal}
    />
  );
};
