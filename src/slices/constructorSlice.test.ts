import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';
import { createOrder } from './orderSlice';

import type { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  const mockBun: TIngredient = {
    _id: 'bun-1',
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
  };

  const mockIngredient: TIngredient = {
    _id: 'ingredient-1',
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
  };

  const secondIngredient: TConstructorIngredient = {
    ...mockIngredient,
    _id: 'ingredient-2',
    id: 'constructor-id-2',
    name: 'Вторая начинка',
  };

  const firstIngredient: TConstructorIngredient = {
    ...mockIngredient,
    id: 'constructor-id-1',
  };

  const thirdIngredient: TConstructorIngredient = {
    ...mockIngredient,
    _id: 'ingredient-3',
    id: 'constructor-id-3',
    name: 'Третья начинка',
  };

  test('should return initial state with unknown action', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('should handle setBun', () => {
    const state = reducer(initialState, setBun(mockBun));

    expect(state.bun).toMatchObject(mockBun);
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toEqual([]);
  });

  test('should handle addIngredient', () => {
    const state = reducer(initialState, addIngredient(mockIngredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockIngredient);
    expect(state.ingredients[0].id).toBeDefined();
  });

  test('should handle removeIngredient', () => {
    const state = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const newState = reducer(state, removeIngredient('constructor-id-1'));

    expect(newState.ingredients).toEqual([secondIngredient]);
  });

  test('should handle moveIngredient', () => {
    const state = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient, thirdIngredient],
    };

    const newState = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 2 }));

    expect(newState.ingredients).toEqual([
      secondIngredient,
      thirdIngredient,
      firstIngredient,
    ]);
  });

  test('should not change ingredients when move indexes are invalid', () => {
    const state = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const newState = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 5 }));

    expect(newState.ingredients).toEqual(state.ingredients);
  });

  test('should handle clearConstructor', () => {
    const state = {
      bun: {
        ...mockBun,
        id: 'bun-constructor-id',
      },
      ingredients: [firstIngredient, secondIngredient],
    };

    const newState = reducer(state, clearConstructor());

    expect(newState).toEqual(initialState);
  });

  test('should clear constructor after createOrder.fulfilled', () => {
    const state = {
      bun: {
        ...mockBun,
        id: 'bun-constructor-id',
      },
      ingredients: [firstIngredient, secondIngredient],
    };

    const mockOrder: TOrder = {
      _id: 'order-1',
      status: 'done',
      name: 'Тестовый бургер',
      createdAt: '2026-11-16T10:00:00.000Z',
      updatedAt: '2026-11-16T10:00:00.000Z',
      number: 12345,
      ingredients: ['bun-1', 'ingredient-1', 'bun-1'],
    };

    const action = createOrder.fulfilled(mockOrder, 'request-id', [
      'bun-1',
      'ingredient-1',
      'bun-1',
    ]);

    const newState = reducer(state, action);

    expect(newState).toEqual(initialState);
  });
});
