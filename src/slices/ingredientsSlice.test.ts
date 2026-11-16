import reducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: 'ingredient-1',
      name: 'Тестовая булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 100,
      price: 200,
      image: 'bun.png',
      image_large: 'bun-large.png',
      image_mobile: 'bun-mobile.png',
    },
    {
      _id: 'ingredient-2',
      name: 'Тестовая начинка',
      type: 'main',
      proteins: 15,
      fat: 10,
      carbohydrates: 5,
      calories: 150,
      price: 300,
      image: 'main.png',
      image_large: 'main-large.png',
      image_mobile: 'main-mobile.png',
    },
  ];

  test('should return initial state with unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('should handle fetchIngredients.pending', () => {
    const stateWithError = {
      ...initialState,
      error: 'Previous error',
    };

    const action = fetchIngredients.pending('request-id');

    const state = reducer(stateWithError, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchIngredients.fulfilled', () => {
    const loadingState = {
      ingredients: [],
      isLoading: true,
      error: 'Previous error',
    };

    const action = fetchIngredients.fulfilled(mockIngredients, 'request-id');

    const state = reducer(loadingState, action);

    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('should handle fetchIngredients.rejected', () => {
    const loadingState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = fetchIngredients.rejected(new Error('Network error'), 'request-id');

    const state = reducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  test('should use default error message when error message is missing', () => {
    const loadingState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };

    const action = {
      type: fetchIngredients.rejected.type,
      error: {},
    };

    const state = reducer(loadingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
