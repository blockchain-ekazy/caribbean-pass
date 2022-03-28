import React from "react";
import "./Home.css";
import { useState } from "react";
import Mintbtn1 from "./mintbtn1";
import Mintbtn2 from "./mintbtn2";
import Mintbtn3 from "./mintbtn3";
import Mintbtn4 from "./mintbtn4";
import four from "../images/4.mp4";

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
        <h1>Genesis Pass</h1>
        <h6 className="pb-3">Total supply: 4200 NFTs</h6>
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
