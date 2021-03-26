import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { hkSlice } from './hkReducer';

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: false,
  }),
];

const rootReducer = {
  [hkSlice.name]: hkSlice.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware,
});
