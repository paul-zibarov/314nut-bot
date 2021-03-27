import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from 'web3';
import abiFront from '../../constants/abis/abiFront.json';
import { addBalance } from '../../redux/hkOperations';
import styles from './BurnPage.module.css';

const INITIAL_STATE = {
  pi: '',
  get: 'PETH',
};

const INITIAL_STATE_RESIVED = {
  ETH: 0,
  PBTC: 0,
  PUSD: 0,
};

export default function BurnPage() {
  const [state, setState] = useState(INITIAL_STATE);
  const [receivedAmount, setReceivedAmount] = useState(INITIAL_STATE_RESIVED);
  const balance = useSelector(state => state.hk.balance);
  const dispatch = useDispatch();

  const web3 = new Web3(
    Web3.givenProvider ||
      'https://ropsten.infura.io/v3/5f1cc39aff43406b9cbbab0cc9383c98',
  );
  const FRONT_CONTRACT_KEY = '0xDB0f0c98828980413239312207eAaDaD663B2326';
  const FRONT_CONTRACT = new web3.eth.Contract(abiFront, FRONT_CONTRACT_KEY);

  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  // const burnHandler = () => {
  //   console.log('burnHandler !', state);
  //   dispatch(addBalance(state.pi));
  // };
  // ------- = Test Contract = -------
  // --=-- helpful functions
  const convertValue = value =>
    Math.round(+value * 10000).toString() + '00000000000000';
  const reduceValue = value => +value / 1e18;

  // --- TEMP! - address ---
  const address = '0x9b3dCD8AA0fCC5d6dEa920a2DA28309908Fa8A70';

  const burnHandler = async () => {
    if (state.get === 'PETH') {
      const result = await FRONT_CONTRACT.methods.burn(state.pi).call();
      console.log('burn = ', result);
      const result2 = await FRONT_CONTRACT.methods
        .getBurnAmount(state.pi)
        .call();
      console.log(
        'getBurnAmount -> token0Amount = ',
        reduceValue(result2.token0Amount),
      );
      console.log(
        'getBurnAmount -> token1Amount = ',
        reduceValue(result2.token1Amount),
      );
      setReceivedAmount(prev => ({
        ...prev,
        ETH: reduceValue(result2.token0Amount),
        PBTC: reduceValue(result2.token1Amount),
      }));
    } else {
      const result3 = await FRONT_CONTRACT.methods
        .burnAndConvert(state.pi, address)
        .call();
      console.log('burnAndConvert = ', result3);
      const result4 = await FRONT_CONTRACT.methods
        .getBurnAmountConvert(state.pi, address)
        .call();
      console.log('BurnAmountConvert = ', result4);
      setReceivedAmount(prev => ({ ...prev, PUSD: reduceValue(result4) }));
    }
  };
  // ------- = /Test Contract = -------
  return (
    <>
      <p className={styles.mainBalance}>
        your balance:<span>{balance} PI</span>
      </p>
      <p className={styles.tab}>
        <NavLink to="/" className={styles.link}>
          mint
        </NavLink>
        <NavLink
          to="/burn"
          className={styles.link}
          activeClassName={styles.activeLink}
        >
          burn
        </NavLink>
      </p>
      <div className={styles.formWrapper}>
        <p className={styles.inputTitle}>
          PI<span className={styles.smallText}>Your balance: 12 PI</span>
        </p>
        <div className={styles.textInputWrapper}>
          <input
            type="text"
            name="pi"
            value={state.pi}
            onChange={inputHandler}
          />
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
        <p className={styles.receive}>
          You will receive{' '}
          {state.get === 'PETH'
            ? `${receivedAmount.ETH} ETH and ${receivedAmount.PBTC} PBTC`
            : `${receivedAmount.PUSD} PUSD`}
        </p>
      </div>
      <p className={styles.receive}>1 PI = 100 USDT</p>
    </>
  );
}
