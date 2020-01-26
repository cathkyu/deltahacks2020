import React, { Component } from "react";

export default class Screen extends Component {
  render() {
    const classCon = `screen ${this.props.className || ""}`;
    return <div className={classCon}>{this.props.children}</div>;
  }
}
