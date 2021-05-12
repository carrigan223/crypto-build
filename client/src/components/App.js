import React, { Component } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
// import { render } from "react-dom";

class App extends Component {
  state = { walletInfo: {} };

  componentDidMount() {
    fetch("http://localhost:3000/api/wallet-info")
      .then((response) => response.json())
      .then((json) => this.setState({ walletInfo: json }));
  }

  render() {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className="App">
        <img className="logo" src={logo}></img>
        <br />
        <h1 className="Title">Welcome to the Blockchain...</h1>
        <br />
        <div>
          <Link to="/Blocks">View the Chain</Link>
        </div>
        <br />
        <div className="WalletInfo">
          <div className="Address">Address: {address}</div>
          <br />
          <div>Balance: {balance}</div>
        </div>
      </div>
    );
  }
}

export default App;
