import React, { Component } from "react";
import logo from "../../../images/logo.png";
export default class Title extends Component {
  render() {
    return (
      <div className="tit-con">
        <div className="tit-con_img">
          <img src={logo}></img>
        </div>
        <div className="tit-con_title">
          <div className="tit-con_title1">
            tr<span>4</span>sh
          </div>
          <div className="tit-con_title2">
            c<span>0</span>d<span>3</span>
          </div>
        </div>
      </div>
    );
  }
}
