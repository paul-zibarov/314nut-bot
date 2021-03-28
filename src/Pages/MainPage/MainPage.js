import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Web3 from 'web3';
import abiFront from '../../constants/abis/abiFront.json';
import erc20 from '../../constants/abis/erc20.json';
import {  addBalance, setExchangeRate, setUserAddress } from '../../redux/hkOperations';
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
  const FRONT_CONTRACT_KEY = '0x299676641493307ABD080d1Ba051e284E44803F0';
  const FRONT_CONTRACT = new web3.eth.Contract(abiFront, FRONT_CONTRACT_KEY);

  const [state, setState] = useState(INITIAL_STATE);
  const [index, setIndex] = useState(0);
  const { balance, exchangeRate, userAddress } = useSelector(state => state.hk);
  const dispatch = useDispatch();

  const history = useHistory();
  // console.log('       ---  history.location = ', history.location);
  let inData1;
  if (history.location.search) {
    console.log(
      '       ---  history.location.search = ',
      history.location.search,
    );
    const inData = history.location.search.slice(1);
    console.log('       ---  inData = ', inData);
    inData1 = inData.split('=');
    // console.log('       ---  inData1 = ', inData1, inData1[0], inData1[1]);
  }
  const pbtcInput = useRef(null);
  const pusdInput = useRef(null);
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

  // useEffect(() => {    
  //   handlePBTC();
  // }, [state.pusd])

  const setInitValue = () => {
    if (history.location.search) {
      console.log(' !!  setInitValue    ---  inData1[0] = ', inData1[0]);
      const key = inData1[0];
      setState(prev => ({ ...prev, [key]: inData1[1] }));
      // ??? ---
      key === 'pbtc' ? pbtcInput.current.focus() : pusdInput.current.focus();
      // pbtcInput.current.blur();
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
  // setAddress();

  // ------------------------== TEST approve WETH account ==---
  const WETH_TOKEN_CONTRACT_KEY = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
  const WETH_TOKEN_CONTRACT = new web3.eth.Contract(
    erc20,
    WETH_TOKEN_CONTRACT_KEY,
  );
  const contractAddressWETH = WETH_TOKEN_CONTRACT_KEY;
  // const addresss2 = '0xAd6441d8aE550706665918d0A41C8f6A76949928';
  // const addresss = userAddress ? userAddress : addresss2;
  const addresss = userAddress;
  // console.log('userAddress = ', userAddress, typeof(userAddress), userAddress.length);
  // console.log('addresss = ', addresss, typeof(addresss), addresss.length);
  // if (addresss.toUpperCase() === userAddress.toUpperCase()) {
  //   console.log('userAddress = addresss!!!!!!!', typeof(userAddress));
  // } else {
  //   console.log('userAddress != addresss -> MARAZM!!!');
  // }
  // for(let i = 0; i < userAddress.length; i++) {
  //   if (addresss[i].toUpperCase() === userAddress[i].toUpperCase()) {
  //     console.log('userAddress = addresss!!!!!!!', addresss[i].toUpperCase(), ' ', userAddress[i].toUpperCase(), ' ', i);
  //   } else {
  //     console.log('userAddress != addresss -> MARAZM!!!', addresss[i].toUpperCase(), ' ', userAddress[i].toUpperCase(), ' ', i);
  //   }
  // }
  const amount =
    '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  const checkAllowanceWETH = async () => {
    const allowance = await WETH_TOKEN_CONTRACT.methods
      .allowance(addresss, contractAddressWETH)
      .call();
    return allowance;
  };

  const approveWETH = async () => {
    const approve = await WETH_TOKEN_CONTRACT.methods
      .approve(contractAddressWETH, amount)
      .send({ from: addresss })
      .on('transactionHash', function (hash) {
        console.log('for WETH - .on("transactionHash"');
      })
      .on('receipt', function (receipt) {
        console.log('for WETH - .on("receipt" ');
      })
      .on('error', function (error, receipt) {
        console.log('for WETH - .on("error" ');
      });
    return approve;
  };

  // checkAllowanceWETH().then(response => {
  //   if (response === '0') {
  //     approveWETH().then(() => console.log('for WETH - if (response === 0) '));
  //   } else {
  //     console.log('for WETH - if (response !== 0) ');
  //   }
  // });
  // ------------------------== /TEST approve WETH account ==---
  // ------------------------== TEST approve PBTC account ==---
  const PBTC_TOKEN_CONTRACT_KEY = '0x9b3dCD8AA0fCC5d6dEa920a2DA28309908Fa8A70';
  const PBTC_TOKEN_CONTRACT = new web3.eth.Contract(
    erc20,
    PBTC_TOKEN_CONTRACT_KEY,
  );
  const contractAddressPBTC = PBTC_TOKEN_CONTRACT_KEY;

  const checkAllowancePBTC = async () => {
    const allowance = await PBTC_TOKEN_CONTRACT.methods
      .allowance(addresss, contractAddressPBTC)
      .call();
    return allowance;
  };

  const approvePBTC = async () => {
    const approve = await PBTC_TOKEN_CONTRACT.methods
      .approve(contractAddressPBTC, amount)
      .send({ from: addresss })
      .on('transactionHash', function (hash) {
        console.log('for PBTC - .on("transactionHash"');
      })
      .on('receipt', function (receipt) {
        console.log('for PBTC - .on("receipt" ');
      })
      .on('error', function (error, receipt) {
        console.log('for PBTC - .on("error" ');
      });
    return approve;
  };

  // checkAllowancePBTC().then(response => {
  //   if (response === '0') {
  //     approvePBTC().then(() => console.log('for PBTC - if (response === 0) '));
  //   } else {
  //     console.log('for PBTC - if (response !== 0) ');
  //   }
  // });
  // ------------------------== /TEST approve PBTC account ==---

  // ------------------------== TEST balanceOf PBTC account ==---
  const [balanceWETH, setBalanceWETH] = useState(10);
  const [balancePBTC, setBalancePBTC] = useState(20);

  const getingTokenBalance = async (address1) => {
    console.log('getTokenBalance is working!!!!!  address1 = ', address1);
    // if (address1) {
      const userBalanceWETH = await WETH_TOKEN_CONTRACT.methods
        .balanceOf(address1)
        .call();
      console.log('WETH userBalance: ', reduceValue(userBalanceWETH));
      setBalanceWETH(userBalanceWETH);
    // }

    if (address1) {
      const userBalancePBTC = await PBTC_TOKEN_CONTRACT.methods
        .balanceOf(address1)
        .call();
      console.log('PBTC userBalance: ', reduceValue(userBalancePBTC));
      setBalancePBTC(userBalancePBTC);
    }

    const userBalancePI = await FRONT_CONTRACT.methods
    .balanceOf(address1)
    .call();
  console.log('PI userBalance: ', reduceValue(userBalancePI));
  dispatch(addBalance(userBalancePI));
  };
  // ------------------------== /TEST balanceOf PBTC account ==---

  const inputHandler = ({ target }) => {
    const { name, value } = target;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = e => {
    e.preventDefault();
    console.log('submitHandler !');
  };
  // ------- = Test Contract = -------
  // --=--                 !!!       helpful functions
  const convertValue = value =>
    Math.round(+value * 10000).toString() + '00000000000000';
  const reduceValue = value => +value / 1e18;
  const reducePIValue = value => +value / 1e10;
  const reducePBTCValue = value => +value / 1e8;
  // --=--                 !!!       /helpful functions
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
    // setIndex(reduceValue(result.indexAmount));
    setIndex(result.indexAmount);
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
    // -------------- allowance(address owner) перевірка-------
    checkAllowanceWETH().then(response => {
      if (response === '0') {
        approveWETH().then(() =>
          console.log('for WETH - if (response === 0) '),
        );
      } else {
        console.log('for WETH - if (response !== 0) ');
      }
    });

    checkAllowancePBTC().then(response => {
      if (response === '0') {
        approvePBTC().then(() =>
          console.log('for PBTC - if (response === 0) '),
        );
      } else {
        console.log('for PBTC - if (response !== 0) ');
      }
    });
    // -------------- /allowance(address owner) перевірка-------
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
        your balance:<span>{reducePIValue(balance)} PI</span>
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
          <p className={styles.smallText}>
            Your balance: {balancePBTC ? reducePBTCValue(balancePBTC) : 0} PBTC
          </p>
        </div>
        <input
        ref={pbtcInput}
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
          {state.sent === 'ETH' ? 'WETH' : 'PUSD'}
          {/* <span className={styles.smallText}>{`Your balance: ${balanceWETH} ETH`}</span> */}
          <span className={styles.smallText}>
            Your balance: {balanceWETH} WETH
          </span>
        </p>
        <div style={{ display: 'flex' }}>
          <input
          ref={pusdInput}
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
            sent WETH + PBTC
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
        <p className={styles.receive}>{`You will receive ${reducePIValue(index)} PI`}</p>
      </form>
      <p className={styles.receive}>{`1 PI = ${exchangeRate} USDT`}</p>
    </>
  );
}
