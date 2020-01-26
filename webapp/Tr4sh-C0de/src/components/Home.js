import React, { Component } from "react";
// import mongoose from "mongoose";
import { connect } from "react-redux";
import dbAPI from "../apis/db";
import { logoutUser } from "../actions";
import "./Home/styles.css";
import Screen from "./Home/Screen";
import Box from "./Home/Box";
import Title from "./Home/components/Title";
import Button from "./Home/components/Button";
import PointsBoard from "./Home/components/PointsBoard";
import EnterCard from "./Home/components/EnterCard";
import FullCard from "./Home/components/FullCard";
import ReportTable from "./Home/components/ReporTable";
// import passwords from "../keys.js";
// connects our back end code with the database
// mongoose.connect(passwords.mongoURI, { useNewUrlParser: true });

// let db = mongoose.connection;
class Home extends Component {
  callBioDate = async () => {
    const response = await dbAPI.get(`${this.props.user.uid}/`);
    const history = response.data.history;
    let points = {
      compost: 0,
      waste: 0,
      recycling: 0
    };
    for (let i = 0; i < history.length; i++) {
      if (history[i].category === "compost") {
        points.compost += 1;
      } else if (history[i].category === "recycling") {
        points.recycling += 1;
      } else {
        points.waste += 1;
      }
    }
    this.setState({
      ...response.data,
      profileURL: response.data.info.profileURL,
      points
    });
    console.log(this.state);
  };
  componentDidMount() {
    // db.once("open", () => console.log("connected to the database"));
    // checks if connection with the database is successful
    // db.on("error", console.error.bind(console, "MongoDB connection error:"));x
  }
  constructor(props) {
    super(props);
    this.state = {
      stream: false,
      info: { name: "" },
      points: {
        compost: 0,
        waste: 0,
        recycling: 0
      }
    };
    this.forceUpdate();
    this.callBioDate();
    this.renderBio();
  }
  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch(logoutUser());
  };
  renderBio = () => (
    <div className="bio">
      <div className="bio-pic">
        <img src={this.state.profileURL || ""}></img>
      </div>
      <div className="bio-sec">
        <div>
          <span className="bio-sec_Bold">Name:</span>{" "}
          {this.state.info.name || ""}
        </div>
        <div>
          <span className="bio-sec_Bold">Age:</span> {this.state.info.age || ""}
        </div>
      </div>
      <div className="bio-sec">
        <div>
          <span className="bio-sec_Bold">Program:</span>{" "}
          {this.state.info.program || ""}
        </div>
        <div>
          <span className="bio-sec_Bold">Living Area:</span>{" "}
          {this.state.info.live || ""}
        </div>
      </div>
      <div className="bio-sec">
        <div>
          <span className="bio-sec_Bold">ID:</span> {this.props.user.uid || ""}
        </div>
        <div>
          <span className="bio-sec_Bold">E-mail:</span>{" "}
          {this.props.user.email || ""}
        </div>
      </div>
    </div>
  );
  renderCard = () => {
    if (!this.state.stream) {
      return (
        <EnterCard
          onClick={() => {
            this.setState({ stream: true });
          }}
        ></EnterCard>
      );
    }
    return <FullCard user={this.props.user.uid}></FullCard>;
  };
  render() {
    const { isLoggingOut, logoutError } = this.props;
    return (
      <div className="home-con">
        <Screen className="screen1">
          <Box className="box11">{this.renderBio()}</Box>
          <Box className="box12">
            <Title></Title>
            <Button
              className="button-title"
              text="Log-out"
              onClick={this.handleLogout}
            ></Button>
          </Box>
        </Screen>
        <Screen>
          <Box className="box2">{this.renderCard()}</Box>
        </Screen>
        <Screen>
          <Box className="box31">
            <ReportTable history={this.state.history || []}></ReportTable>
          </Box>
          <Box className="box32">
            <PointsBoard points={this.state.points}></PointsBoard>
          </Box>
        </Screen>
      </div>
    );
    return (
      <div>
        aha gang gang
        <h1>This is your app's protected area.</h1>
        <p>Any routes here will also be protected</p>
        <button onClick={this.handleLogout}>Logout</button>
        {isLoggingOut && <p>Logging Out....</p>}
        {logoutError && <p>Error logging out</p>}
      </div>
    );
  }
}
function mapStateToProps(state) {
  console.log(state);
  return {
    isLoggingOut: state.auth.isLoggingOut,
    logoutError: state.auth.logoutError,
    user: state.auth.user
  };
}
export default connect(mapStateToProps)(Home);
