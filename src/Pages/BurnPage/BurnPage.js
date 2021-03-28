import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from 'web3';
import abiFront from '../../constants/abis/abiFront.json';
import { addBalance, setExchangeRate, setUserAddress } from '../../redux/hkOperations';
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
  const { balance, exchangeRate } = useSelector(state => state.hk);
  const dispatch = useDispatch();

  const web3 = new Web3(
    Web3.givenProvider ||
      'https://ropsten.infura.io/v3/5f1cc39aff43406b9cbbab0cc9383c98',
  );
  
  const FRONT_CONTRACT_KEY = '0x299676641493307ABD080d1Ba051e284E44803F0'
  const FRONT_CONTRACT = new web3.eth.Contract(abiFront, FRONT_CONTRACT_KEY);

  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  // --- === TEMP! ===---
  const history = useHistory();
  // console.log('       ---  history.location = ', history.location);
  let inData1;
  if (history.location.search) {
    console.log(
      '       ---  history.location.search = ',
      history.location.search,
    );
    const inData = history.location.search.slice(1);
    // console.log('       ---  inData = ', inData);
    inData1 = inData.split('=');
    // console.log('       ---  inData1 = ', inData1, inData1[0], inData1[1]);
  }
  const piInput = useRef(null);
  // useEffect(() => {
  //   pbtcInput.current.focus();
  // }, []);

  useEffect(() => {
    setAddress();
    const BurnAmountConvert = async () => {
      const amountTokens = '10000000000';
      const convertToken = '0xc11090b333e0a8a88cb5d26f1f663cf859fcb861';
      const result = await FRONT_CONTRACT.methods
        .getBurnAmountConvert(amountTokens, convertToken)
        .call();
      console.log('BurnAmountConvert = ', reduceValue(result));
      dispatch(setExchangeRate(reduceValue(result)));
    };
    BurnAmountConvert();
    // getingTokenBalance();
    setInitValue();
  }, []);

  const setInitValue = () => {
    if (history.location.search) {
      // console.log(' !!  setInitValue    ---  inData1[0] = ', inData1[0]);
      const key = inData1[0];
      setState(prev => ({ ...prev, [key]: inData1[1] }));
      // ??? ---
      key === 'pi' && piInput.current.focus();
      // piInput.current.blur();
    }
  };

  const setAddress = async () => {
    let address;
    try {
      if (typeof window.ethereum !== 'undefined') {
        console.log('init browser web3');
        const web3 = await new Web3(window.ethereum);
        window.ethereum.enable().catch(error => {
          console.log('User denied account access, init infura web3');
          //this.web3 = new Web3(myConfig.INFURA_API);
        });
        address = await web3.eth.getCoinbase();
        console.log('Account: ' + address);
      } else {
        console.error('web3 is not initialized');
        //this.web3 = await new Web3(myConfig.INFURA_API);
      }
      dispatch(setUserAddress('' + address));
    } catch (error) {
      console.error('Couldnot init web3');
      console.error(error);
    }
    getingTokenBalance(address);
  };
  // --- === /TEMP! ===---

  // const burnHandler = () => {
  //   console.log('burnHandler !', state);
  //   dispatch(addBalance(state.pi));
  // };
  // ------- = Test Contract = -------
  // --=-- helpful functions
  const convertValue = value =>
    Math.round(+value * 10000).toString() + '00000000000000';
  const reduceValue = value => +value / 1e18;
  const reducePIValue = value => +value / 1e10;
  const reducePBTCValue = value => +value / 1e8;

  // --- TEMP! - address ---
  // const address = '0x9b3dCD8AA0fCC5d6dEa920a2DA28309908Fa8A70';
  const address = '0xC11090b333e0a8a88cb5d26f1f663CF859fcB861';

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

    // ------------------------== TEST balanceOf PI account ==---
    // const [balancePI, setBalancePI] = useState(15);
  
    const getingTokenBalance = async (address1) => {
      console.log('getTokenBalance is working!!!!!  address1 = ', address1);
      //  if (address1) {
        const userBalancePI = await FRONT_CONTRACT.methods
          .balanceOf(address1)
          .call();
        console.log('PI userBalance: ', reduceValue(userBalancePI));
        // setBalancePI(userBalancePI);
        dispatch(addBalance(userBalancePI));
      // }
    };
    // ------------------------== /TEST balanceOf PI account ==---

  return (
    <>
      <p className={styles.mainBalance}>
        your balance:<span>{reducePIValue(balance)} PI</span>
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
          PI<span className={styles.smallText}>Your balance: {reducePIValue(balance)} PI</span>
        </p>
        <div className={styles.textInputWrapper}>
          <input
          ref={piInput}
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
            ? `${receivedAmount.ETH} WETH and ${receivedAmount.PBTC} PBTC`
            : `${receivedAmount.PUSD} PUSD`}
        </p>
      </div>
      <p className={styles.receive}>{`1 PI = ${exchangeRate} USDT`}</p>
    </>
  );
}
