import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MainPage.module.css';

const INITIAL_STATE = {
  pbtc: '',
  pusd: '',
  coin: '',
};

export default function MainPage() {
  const [state, setState] = useState(INITIAL_STATE);

  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setState({ [name]: value });
  };

  const submitHandler = e => {
    e.preventDefault();
    console.log('submitHandler !');
  };

  return (
    <>
      <p className={styles.mainBalance}>
        your balance:<span>12 PI</span>
      </p>
      <p className={styles.tab}>
        <NavLink to="/" className={styles.link} activeClassName={styles.activeLink}>mint</NavLink>
        <NavLink to="/burn" className={styles.link}>burn</NavLink>
      </p>
      <form className={styles.formWrapper} onSubmit={submitHandler}>
        <div className={styles.inputTitle}>
          <p>PBTC</p>
          <p className={styles.smallText}>Your balance: 132 PBTC</p>
        </div>
        <input
          type="text"
          name="pbtc"
          value={state.pbtc}
          onChange={inputHandler}
        />
        <p className={styles.inputTitle}>
          <select name="coin" value={state.coin} onChange={inputHandler}>
            <option value="PUSD">PUSD</option>
            <option value="PUAH">PUAH</option>
            <option value="PEUR">PEUR</option>
          </select>
          <span className={styles.smallText}>Your balance: 13 PUSD</span>
        </p>
        {/* <p className={styles.inputTitle}>
          PUSD<span className={styles.smallText}>Your balance: 13 PUSD</span>
        </p> */}
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            name="pusd"
            value={state.pusd}
            onChange={inputHandler}
          />
          <button type="submit">mint</button>
        </div>
        <p className={styles.receive}>You will receive ___ PI</p>
      </form>
      <p className={styles.receive}>1 PI = 100 USDT</p>
    </>
  );
}
