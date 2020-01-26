import React, { Component } from "react";

export default class ReporTable extends Component {
  renderList = () =>
    this.props.history.map(({ time, item, category, points }) => (
      <tr className="td-con">
        <td className="td td1">{time}</td>
        <td className="td td2">{item}</td>
        <td className="td td3">{category}</td>
        <td className="td td4">{points}</td>
      </tr>
    ));
  render() {
    return (
      <table
        className="table"
        style={{
          width: "100%",
          textAlign: "center",
          borderTopLeftRadius: "10px"
        }}
      >
        <tr className="th-con">
          <th className="th th1">Date and Time</th>
          <th className="th th2">Item</th>
          <th className="th h3">Category</th>
          <th className="th th4">Points</th>
        </tr>
        {this.renderList()}
      </table>
    );
  }
}
