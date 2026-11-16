import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { addIngredient, setBun } from '../../slices/constructorSlice';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleAdd = (): void => {
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
