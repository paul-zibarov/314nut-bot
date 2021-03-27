import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from 'web3';
import abiFront from '../../constants/abis/abiFront.json';
import { setExchangeRate } from '../../redux/hkOperations';
import styles from './MainPage.module.css';

const INITIAL_STATE = {
  pbtc: '',
  pusd: '',
  coin: '',
  sent: 'ETH',
};

export default function MainPage() {
  const web3 = new Web3(
    Web3.givenProvider ||
      'https://ropsten.infura.io/v3/5f1cc39aff43406b9cbbab0cc9383c98',
  );
  const FRONT_CONTRACT_KEY = '0xDB0f0c98828980413239312207eAaDaD663B2326';
  const FRONT_CONTRACT = new web3.eth.Contract(abiFront, FRONT_CONTRACT_KEY);

  const [state, setState] = useState(INITIAL_STATE);
  const [index, setIndex] = useState(0);
  const { balance, exchangeRate } = useSelector(state => state.hk);
  const dispatch = useDispatch();

  useEffect(() => {
    const BurnAmountConvert = async () => {
      const amountTokens = '1000000000000000000';
      const convertToken = '0xc11090b333e0a8a88cb5d26f1f663cf859fcb861';
      const result = await FRONT_CONTRACT.methods
        .getBurnAmountConvert(amountTokens, convertToken)
        .call();
      console.log('BurnAmountConvert = ', reduceValue(result));
      dispatch(setExchangeRate(reduceValue(result)));
    };
    BurnAmountConvert();
  }, [dispatch]);

  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = e => {
    e.preventDefault();
    console.log('submitHandler !');
  };
  // ------- = Test Contract = -------
  // --=-- helpful functions
  const convertValue = value =>
    Math.round(+value * 10000).toString() + '00000000000000';
  const reduceValue = value => +value / 1e18;

  const handlePBTC = async () => {
    if (state.sent !== 'ETH') {
      return;
    }
    const result = await FRONT_CONTRACT.methods
      .getAmountOut(state.pbtc, true)
      .call();
    console.log(
      'counterTokenAmount = ',
      result.counterTokenAmount,
      'indexAmount = ',
      result.indexAmount,
    );
    setIndex(reduceValue(result.indexAmount));
  };

  // --- TEMP! - address ---
  const address1 = '0x9b3dCD8AA0fCC5d6dEa920a2DA28309908Fa8A70';

  const handleETH = async () => {
    if (state.sent === 'ETH') {
      const result = await FRONT_CONTRACT.methods
        .getAmountOut(state.pusd, false)
        .call();
      console.log(
        'counterTokenAmount = ',
        result.counterTokenAmount,
        'indexAmount = ',
        result.indexAmount,
      );
      setIndex(reduceValue(result.indexAmount));
    } else {
      const result1 = await FRONT_CONTRACT.methods
        .getAmountOutConvert(state.pusd, address1)
        .call();
      console.log('AmountOutConvert = ', result1);
      setIndex(reduceValue(result1));
    }
  };

  // --- TEMP! - address ---
  const address = '0x9b3dCD8AA0fCC5d6dEa920a2DA28309908Fa8A70';

  const mintButtonClick = async () => {
    if (state.sent === 'ETH') {
      const result = await FRONT_CONTRACT.methods
        .mint(state.pbtc, state.pusd)
        .call();
      console.log('indexAmount 2x = ', result);
      // setIndex(reduceValue(result));
    } else {
      const result = await FRONT_CONTRACT.methods
        .mintAndConvert(state.pusd, address)
        .call();
      console.log('indexAmount 1x = ', result);
      // setIndex(reduceValue(result));
    }
  };

  // ------- = /Test Contract = -------

  return (
    <>
      <p className={styles.mainBalance}>
        your balance:<span>{balance} PI</span>
      </p>
      <p className={styles.tab}>
        <NavLink
          to="/"
          className={styles.link}
          activeClassName={styles.activeLink}
        >
          mint
        </NavLink>
        <NavLink to="/burn" className={styles.link}>
          burn
        </NavLink>
      </p>
      <form className={styles.formWrapper}>
        {/* {state.sent === 'ETH' ? 'visible' : 'hidden'} */}
        <div
          className={styles.inputTitle}
          style={{ visibility: state.sent === 'ETH' ? 'visible' : 'hidden' }}
        >
          <p>PBTC</p>
          <p className={styles.smallText}>Your balance: 132 PBTC</p>
        </div>
        <input
          style={{ visibility: state.sent === 'ETH' ? 'visible' : 'hidden' }}
          type="text"
          name="pbtc"
          value={state.pbtc}
          onChange={inputHandler}
          onBlur={handlePBTC}
        />
        {/* <p className={styles.inputTitle}>
          <select name="coin" value={state.coin} onChange={inputHandler}>
            <option value="PUSD">PUSD</option>
            <option value="PUAH">PUAH</option>
            <option value="PEUR">PEUR</option>
          </select>
          <span className={styles.smallText}>Your balance: 13 PUSD</span>
        </p> */}
        <p className={styles.inputTitle}>
          {state.sent === 'ETH' ? 'ETH' : 'PUSD'}
          <span className={styles.smallText}>Your balance: 13 PUSD</span>
        </p>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            name="pusd"
            value={state.pusd}
            onChange={inputHandler}
            onBlur={handleETH}
          />
          <button type="button" onClick={mintButtonClick}>
            mint
          </button>
        </div>
        <div className={styles.radioWrapper}>
          <label>
            <input
              type="radio"
              name="sent"
              checked={state.sent === 'ETH'}
              value="ETH"
              onChange={inputHandler}
            />
            sent ETH + PBTC
          </label>
          <label>
            <input
              type="radio"
              name="sent"
              checked={state.sent === 'PUSD'}
              value="PUSD"
              onChange={inputHandler}
            />
            sent PUSD
          </label>
        </div>
        <p className={styles.receive}>{`You will receive ${index} PI`}</p>
      </form>
      <p className={styles.receive}>{`1 PI = ${exchangeRate} USDT`}</p>
    </>
  );
}
