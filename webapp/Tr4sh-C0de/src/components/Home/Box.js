import React, { Component } from "react";

export default class Box extends Component {
  render() {
    const classCon = `box ${this.props.className || ""}`;
    return <div className={classCon}>{this.props.children}</div>;
  }
}
