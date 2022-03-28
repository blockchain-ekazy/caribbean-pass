import React, { useState, useEffect } from "react";
import abi from "./abi.json";
import coinabi from "./coinabi.json";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import loading from "../images/loading.gif";
import one from "../images/2.png";
import apecoin from "../images/apecoin.ico";

const REACT_APP_CONTRACT_ADDRESS = "0xA05eF2ecF140Ef3102a25F2c0260B50A5c094c92";
const SELECTEDNETWORK = "4";
const SELECTEDNETWORKNAME = "Ethereum Testnet";
const nftquantity = 1000;
const tokenId = 2;

function Mintbtn2() {
  const [errormsg, setErrorMsg] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [supply, setSupply] = useState(0);
  const [price, setPrice] = useState(<img className="loading" src={loading} />);
  const [walletConnected, setWalletConnected] = useState(0);
  const [maxAllowed, setMaxAllowed] = useState(1);
  const [option, setOption] = useState(0);
  const [burnQ, setBurnQ] = useState(<img className="loading" src={loading} />);

  function showprice() {
    return (
      <>
        {(price / 10 ** 18) * quantity}{" "}
        <img className="apecoin" src={apecoin} />
      </>
    );
  }

  useEffect(async () => {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let total = await ct.methods.totalSupply(tokenId).call();
        setPrice(await ct.methods.price(tokenId).call());
        setBurnQ(await ct.methods.burnQ(tokenId).call());
        setSupply(total);
        if (nftquantity - total == 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      } else {
        // setProvider(false);
        setErrorMsg('Select "' + SELECTEDNETWORKNAME + '" network in Metamask');
      }
    } else {
      setErrorMsg("MetaMask not found!");
      // setProvider(false);
    }
    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 10000);
    }

    function handleEthereum() {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        console.log("Ethereum successfully detected!");
        // setProvider(true);
      } else {
        setErrorMsg("Please install MetaMask!");
        // setProvider(false);
      }
    }
  }, []);

  async function loadWeb3() {
    if (await detectEthereumProvider()) {
      await window.ethereum.enable();
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let metaMaskAccount = await web3.eth.getAccounts();
        metaMaskAccount = metaMaskAccount[0];

        setErrorMsg(<img className="loading" src={loading} />);

        const coinAddress = "0xc1F77DdD6ba4f960AdE9429F0216728f9DF2713f";
        const coinCt = new web3.eth.Contract(coinabi, coinAddress);
        let balance = await coinCt.methods.balanceOf(metaMaskAccount).call();
        // let price = await ct.methods.price(tokenId).call();
        // alert(balance >= price);
        if (balance >= price) {
          await coinCt.methods
            .approve(REACT_APP_CONTRACT_ADDRESS, String(price))
            .send({ from: metaMaskAccount });
          await ct.methods.mint(tokenId).send({ from: metaMaskAccount });
        } else {
          setErrorMsg(
            <>
              Insufficient <img className="apecoin" src={apecoin} /> Coins for
              purchase
            </>
          );
          return;
        }
        setErrorMsg(false);
      }
    }
  }

  async function burnAndMint() {
    if (await detectEthereumProvider()) {
      await window.ethereum.enable();
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let metaMaskAccount = await web3.eth.getAccounts();
        metaMaskAccount = metaMaskAccount[0];

        setErrorMsg(<img className="loading" src={loading} />);

        let balance = await ct.methods.balanceOf(metaMaskAccount, 1).call();
        if (balance >= Number(burnQ)) {
          await ct.methods.burnMint(tokenId).send({ from: metaMaskAccount });
        } else {
          setErrorMsg(<>Insufficient Bronze for burning 🔥</>);
          return;
        }
        setErrorMsg(false);
      }
    }
  }

  async function connectWallet() {
    if (await detectEthereumProvider()) {
      await window.ethereum.enable();
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let total = await ct.methods.totalSupply(tokenId).call();
        setPrice(await ct.methods.price(tokenId).call());
        setSupply(total);
        if (nftquantity - total == 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      }
      let metaMaskAccount = await web3.eth.getAccounts();
      setWalletConnected(1);
    }

    // metaMaskAccount = metaMaskAccount[0];
  }

  return (
    <>
      <div className="Box pt-5 ">
        <div className="px-4">
          <h3>Silver Pass</h3>
          <h6 className="pb-3">
            Sold: {supply}/{nftquantity}
          </h6>
          <div className="row align-items-center">
            <div className="col-sm-6">
              <img src={one} className="w-100 rounded" />
            </div>
            <div className="col-sm-6 text-center text-sm-right">
              <h6 style={{ fontSize: "14px" }}>Price Per NFT</h6>
              <h5 className="font-weight-bold">{showprice()} + GAS</h5>- or -
              <p className="" style={{ fontSize: "13px" }}>
                Burn 🔥 {burnQ} Bronze Pass
              </p>
            </div>
          </div>

          <div className="row align-items-center Mint my-4 pt-0 px-2">
            <div className="col-7">
              <button
                className="btn Btnn"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity == 1}
                style={{ cursor: "pointer" }}
              >
                -
              </button>
              <span className="px-2">{quantity}</span>
              <button
                className="btn Btnn"
                onClick={() => setQuantity(quantity + 1)}
                style={{ cursor: "pointer" }}
                disabled={quantity == maxAllowed}
              >
                +
              </button>
            </div>
            <div className="col-5 text-right">
              <h6 className="m-0" onClick={() => setQuantity(maxAllowed)}>
                {maxAllowed} Max / Txn
              </h6>
            </div>
          </div>

          <div
            className="row TotelROw py-3"
            style={{
              borderTop: "1px solid white",
              borderBottom: "1px solid white",
            }}
          >
            <div className="col-md-2">Total</div>
            <div className="col-md-10 text-right">
              <input
                id="silvermint"
                type="radio"
                name="silverOption"
                onClick={() => {
                  setOption(0);
                  setErrorMsg(false);
                }}
              />
              <label htmlFor="silvermint" className="mx-2">
                {showprice()} + GAS
              </label>
              <br />
              - or -
              <br />
              <input
                id="silverburn"
                type="radio"
                name="silverOption"
                onClick={() => {
                  setOption(1);
                  setErrorMsg(false);
                }}
              />
              <label htmlFor="silverburn" className="mx-2">
                Burn 🔥 {burnQ} Bronze + GAS
              </label>
            </div>
          </div>
        </div>
        {/* <hr className="text-white" style={{width :"20px"}}></hr> */}
        <div className="text-center mt-3">
          {!errormsg ? (
            walletConnected == 0 ? (
              <button className="btn Cbtn " onClick={() => connectWallet()}>
                Connect
              </button>
            ) : option == 0 ? (
              <button className="btn Cbtn " onClick={() => loadWeb3()}>
                Pay {showprice()} and Mint
              </button>
            ) : (
              <button onClick={() => burnAndMint()} className="btn Cbtn ">
                Burn 🔥 {burnQ} and Mint
              </button>
            )
          ) : (
            <p className="my-2 text-white">
              <b>{errormsg}</b>
            </p>
          )}
          {/* <i class="fa-solid fa-square-arrow-up-right"></i> */}
        </div>
      </div>
    </>
  );
}

export default Mintbtn2;
