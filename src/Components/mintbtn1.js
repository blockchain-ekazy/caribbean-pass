import React, { useState, useEffect } from "react";
import abi from "./abi.json";
import coinabi from "./coinabi.json";

import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import loading from "../images/loading.gif";
import one from "../images/1.png";
import apecoin from "../images/apecoin.ico";

const REACT_APP_CONTRACT_ADDRESS = "0x491597e29a11f99dcd79a33d1e1960c9cbeb08c4";
const SELECTEDNETWORK = "1";
const SELECTEDNETWORKNAME = "Ethereum Mainnet";
const nftquantity = 2500;
const tokenId = 1;

function Mintbtn1() {
  const [errormsg, setErrorMsg] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [supply, setSupply] = useState(0);
  const [price, setPrice] = useState(<img className="loading" src={loading} />);
  const [walletConnected, setWalletConnected] = useState(0);
  const [maxAllowed, setMaxAllowed] = useState(0);
  const [burned, setBurned] = useState(0);

  function showprice() {
    return supply < 1001 ? (
      "Free"
    ) : (
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
        let b = await ct.methods.burned().call();
        setBurned(b);
        total = Number(total) + Number(b);
        setMaxAllowed(total < 1001 ? 2 : 5);
        setSupply(total);
        if (nftquantity - total <= 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
        if ((await ct.methods.status().call()) == 0) {
          setErrorMsg("Minting Paused");
          return;
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
        // setErrorMsg("Please install MetaMask!");
        // setProvider(false);
      }
    }
  }, []);

  async function loadWeb3() {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let metaMaskAccount = await web3.eth.getAccounts();
        metaMaskAccount = metaMaskAccount[0];

        setErrorMsg(<img className="loading" src={loading} />);

        if (supply < 1001) {
          if (
            (await ct.methods.numberMinted(metaMaskAccount, tokenId).call()) ==
            2
          ) {
            setErrorMsg("Already Minted 2 for Free");
            return;
          }
          await ct.methods
            .mintBronzeA(quantity)
            .send({ from: metaMaskAccount });
        } else {
          if (
            (await ct.methods.numberMinted(metaMaskAccount, tokenId).call()) > 7
          ) {
            setErrorMsg("Already Minted 7 Bronze");
            return;
          }
          const coinAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381";
          const coinCt = new web3.eth.Contract(coinabi, coinAddress);
          let balance = await coinCt.methods.balanceOf(metaMaskAccount).call();
          let price = await ct.methods.price(tokenId).call();
          if (balance >= price * quantity) {
            await coinCt.methods
              .approve(REACT_APP_CONTRACT_ADDRESS, String(price * quantity))
              .send({ from: metaMaskAccount });
            await ct.methods
              .mintBronze(quantity)
              .send({ from: metaMaskAccount });
          } else {
            setErrorMsg(
              <>
                Insufficient <img className="apecoin" src={apecoin} /> Coins for
                purchase
              </>
            );
            return;
          }
        }
        setQuantity(1);
        setErrorMsg(false);
      }
    }
  }

  async function connectWallet() {
    if (await detectEthereumProvider()) {
      // setProvider(true);
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      if ((await web3.eth.net.getId()) == SELECTEDNETWORK) {
        const contractaddress = REACT_APP_CONTRACT_ADDRESS;
        const ct = new web3.eth.Contract(abi, contractaddress);

        let total = await ct.methods.totalSupply(tokenId).call();

        setPrice(await ct.methods.price(tokenId).call());
        let b = await ct.methods.burned().call();
        setBurned(b);
        total = Number(total) + Number(b);
        setSupply(total);
        if (nftquantity - total <= 0) {
          setErrorMsg("All NFTs minted, Sale has ended");
        }
      }
      setWalletConnected(1);
    }

    // metaMaskAccount = metaMaskAccount[0];
  }

  return (
    <>
      <div className="Box pt-5 ">
        <div className="px-4">
          <h3>Bronze Membership</h3>
          <h6 className="pb-3">
            Sold: {Number(supply)}/{nftquantity} <br />
            Burned: {burned}
          </h6>
          <div className="row align-items-center">
            <div className="col-sm-6">
              <img src={one} className="w-100 rounded" />
            </div>
            <div className="col-sm-6 text-center text-sm-right">
              <h6 style={{ fontSize: "14px" }}>Price Per NFT</h6>
              <h5 className="font-weight-bold">{showprice()} + GAS</h5>
              <p className="" style={{ fontSize: "13px" }}>
                First 1000 Bronze Passes are Free to mint
                <br />
                <small>(MAX 2 PER WALLET)</small>
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
                {maxAllowed} Max
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
            <div className="col-6">Total</div>
            <div className="col-6 text-right">{showprice()} + GAS</div>
          </div>
        </div>
        {/* <hr className="text-white" style={{width :"20px"}}></hr> */}
        <div className="text-center mt-3">
          {!errormsg ? (
            walletConnected == 0 ? (
              <button className="btn Cbtn " onClick={() => connectWallet()}>
                Connect
              </button>
            ) : (
              <button className="btn Cbtn " onClick={() => loadWeb3()}>
                Mint
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

export default Mintbtn1;
