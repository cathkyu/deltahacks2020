import React, { Component } from "react";
import Button from "../components/Button";
export default class EnterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    return (
      <div className="EnterCard">
        <div>Enter Bin Number</div>
        <input
          className="EnterCardInput"
          value={this.state.value}
          onChange={this.handleChange}
          type="text"
        ></input>
        <Button
          className="EnterCardButton"
          text="Submit"
          onClick={() => {
            console.log("CLICKED", this.state.value);
            if (this.state.value == "8080") {
              return this.props.onClick();
            }
          }}
        ></Button>
      </div>
    );
  }
}
