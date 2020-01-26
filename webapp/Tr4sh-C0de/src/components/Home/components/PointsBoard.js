import React, { Component } from "react";

import recycleIcon from "../../../images/ryecycle.png";
import wasteIcon from "../../../images/waste.png";
import compostIcon from "../../../images/compost.png";
export default class PointsBoard extends Component {
  render() {
    return (
      <div className="pb-con">
        <h1 className="pb_h1">Points Collected</h1>
        <div className="pb-sec_con">
          <div className="pb-sec">
            <h2 className="pb_h2">
              <img src={compostIcon}></img>Compost
            </h2>
            <div className="pb-sec_p">
              <span className="pb-sec_points">
                {this.props.points.compost || 0}
              </span>
              <span className="pb-sec_pt">
                pt{this.props.points ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="pb-sec">
            <h2 className="pb_h2">
              <img src={wasteIcon}></img>Waste
            </h2>
            <div className="pb-sec_p">
              <span className="pb-sec_points">
                {this.props.points.waste || 0}
              </span>
              <span className="pb-sec_pt">
                pt{this.props.points.waste ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="pb-sec">
            <h2 className="pb_h2">
              <img src={recycleIcon}></img>Recylcing
            </h2>
            <div className="pb-sec_p">
              <span className="pb-sec_points">
                {this.props.points.recycling || 0}
              </span>
              <span className="pb-sec_pt">
                pt{this.props.points.recycling ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
