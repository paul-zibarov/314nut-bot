import { createSlice } from '@reduxjs/toolkit';

const state = {
  items: [],
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
  },
});
