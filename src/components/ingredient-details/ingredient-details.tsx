import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(
    (state): TIngredient[] => state.ingredients.ingredients
  );

  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
