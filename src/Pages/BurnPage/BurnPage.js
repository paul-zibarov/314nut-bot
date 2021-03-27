import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBalance } from '../../redux/hkOperations';
import styles from './BurnPage.module.css';

const INITIAL_STATE = {
  pi: '',
  get: '',
};

export default function BurnPage() {
  const [state, setState] = useState(INITIAL_STATE);
  const balance = useSelector(state => state.hk.balance);
  const dispatch = useDispatch();

  // const inputHandler = e => {
  //   const value = e.target.value;
  //   setState(value);
  // };

  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setState({ [name]: value });
  };

  const burnHandler = () => {
    console.log('burnHandler !', state);
    dispatch(addBalance(state.pi));
  };

  return (
    <>
      <p className={styles.mainBalance}>
        your balance:<span>{balance} PI</span>
      </p>
      <p className={styles.tab}>
        <span>mint</span>
        <span className={styles.active}>burn</span>
      </p>
      <div className={styles.formWrapper}>
        <p className={styles.inputTitle}>
          PI<span className={styles.smallText}>Your balance: 12 PI</span>
        </p>
        <div className={styles.textInputWrapper}>
          <input type="text" name="pi" value={state.pi} onChange={inputHandler} />
          <button onClick={burnHandler}>burn</button>
        </div>
        <div className={styles.radioWrapper}>
          <label>
            <input
              type="radio"
              name="get"
              checked={state.get === 'PETH'}
              value="PETH"
              onChange={inputHandler}
            />
            get PETH + PBTC
          </label>
          <label>
            <input
              type="radio"
              name="get"
              checked={state.get === 'PUSD'}
              value="PUSD"
              onChange={inputHandler}
            />
            get PUSD
          </label>
        </div>
        <p className={styles.receive}>You will receive ___ PUSD and __ PBTC</p>
      </div>
      <p className={styles.receive}>1 PI = 100 USDT</p>
    </>
  );
}
