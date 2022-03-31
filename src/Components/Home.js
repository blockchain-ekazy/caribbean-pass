import React from "react";
import "./Home.css";
import { useState } from "react";
import Mintbtn1 from "./mintbtn1";
import Mintbtn2 from "./mintbtn2";
import Mintbtn3 from "./mintbtn3";
import Mintbtn4 from "./mintbtn4";
import four from "../images/4.mp4";
import apecoin from "../images/apecoin.ico";

export default function Home() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="Sara">
      <div className="container text-center text-white">
        <video
          autoPlay="true"
          loop="true"
          muted
          className="w-100 topvid rounded"
        >
          <source src={four}></source>
        </video>
        <h1>The Genesis Collection</h1>
        <h4>By Racs-O</h4>
        <a href="https://twitter.com/racs_o" target="_blank">
          <i className="fab fa-twitter mx-2 color-white"></i>
        </a>
        <a href="https://www.instagram.com/stories/racs.eth/" target="_blank">
          <i className="fab fa-instagram mx-2 color-white"></i>
        </a>
        <h6 className="pb-3">Total supply: 4200 NFTs</h6>
        <h6>
          No Roadmap. No Discord.
          <br /> If you love clear waters and good vibes....
          <br /> ....well then....
          <br />
          <br />
          Play the Game.
          <br />
          <br />
          First 1000 Bronze Memberships are FREE to mint.
          <br />
          You can burn 🔥 your Bronze Membership to upgrade
          <br />
          <br />
          <a href="https://apecoin.com/exchanges">
            BUY APE <img className="apecoin" src={apecoin} /> COIN HERE
          </a>
        </h6>
      </div>

      <div className="container DivB">
        <div className="row">
          <div className="col-md-6 my-2">
            <Mintbtn1 />
          </div>
          <div className="col-md-6 my-2">
            <Mintbtn2 />
          </div>
          <div className="col-md-6 my-2">
            <Mintbtn3 />
          </div>
          <div className="col-md-6 my-2">
            <Mintbtn4 />
          </div>
        </div>
      </div>
    </div>
  );
}
