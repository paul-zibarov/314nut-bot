import shortid from 'shortid';
import { hkSlice } from './hkReducer';

const addHk = data => (dispatch, getState) => {
  data = { ...data, id: shortid.generate() };
  dispatch(hkSlice.actions.addHk(data));
};

const editHk = data => (dispatch, getState) => {
  // console.log('editHk Operations: data = ', data);
  dispatch(hkSlice.actions.editHk(data));
};

const deleteHk = data => (dispatch, getState) => {
  dispatch(hkSlice.actions.deleteHk(data));
};
// ---===---
const addBalance = data => dispatch => {
  console.log('addBalance Operations: data = ', data);
  dispatch(hkSlice.actions.addBalance(data));
};

const setExchangeRate = data => dispatch => {
  console.log('setExchangeRate Operations: data = ', data);
  dispatch(hkSlice.actions.setExchangeRate(data));
};

export { addHk, editHk, deleteHk, addBalance, setExchangeRate };
