import { createSlice } from '@reduxjs/toolkit';

const state = {
  items: [],
  balance: 12,
  exchangeRate: 1,
  userAddress: '',
};

export const hkSlice = createSlice({
  name: 'hk',
  initialState: state,
  reducers: {
    addHk: (state, { payload }) => ({
      ...state,
      items: [...state.items, payload],
    }),
    editHk: (state, { payload }) => ({
      ...state,
      items: [
        ...state.items.map(item =>
          item.id === payload.id
            ? {
                ...item,
                start:
                  item.start === payload.start ? item.start : payload.start,
                end: item.end === payload.end ? item.end : payload.end,
              }
            : item,
        ),
      ],
    }),
    deleteHk: (state, { payload }) => ({
      ...state,
      items: [...state.items.filter(item => item.id !== payload)],
    }),
    addBalance: (state, { payload }) => ({
      ...state,
      balance: payload,
    }),
    setExchangeRate: (state, { payload }) => ({
      ...state,
      exchangeRate: payload,
    }),
    setUserAddress: (state, { payload }) => ({
      ...state,
      userAddress: payload,
    }),
  },
});
