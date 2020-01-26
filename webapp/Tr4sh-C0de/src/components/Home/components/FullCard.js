import React, { Component } from "react";
import Button from "./Button";
import image from "../../../images/waste.png";
import imgAPI from "../../../apis/index";
const max = 50;
export default class FullCard extends Component {
  image = image;
  refreshData = () => {
    let call = this.state.counter;
    call += 1;
    if (call > max) {
      call = 1;
    }
    this.setState({ counter: call });
    setTimeout(this.refreshData, 250);
  };

  constructor(props) {
    super(props);
    this.state = { counter: 1 };
  }

  componentDidMount() {
    this.refreshData();
  }
  render() {
    return (
      <div className="videocaller-con">
        <div className="videocaller">
          <img
            src={`http://localhost:5050/static/lastFrame${this.state.counter}.jpg`}
          ></img>
        </div>
        <div>
          {this.props.user}x<Button>{this.props.user}</Button>
        </div>
      </div>
    );
  }
}
