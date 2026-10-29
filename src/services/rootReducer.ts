import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from '../slices/constructorSlice';
import feedReducer from '../slices/feedSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import userReducer from '../slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
});
