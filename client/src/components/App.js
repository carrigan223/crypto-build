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
        <div className="HomeContainerTop">
          <img className="logo" src={logo}></img>
          <br />
          <h1 className="LargeTitle">Welcome to the Blockchain...</h1>
          <br />
          <div className="Links">
            <div>
              <Link to="/Blocks">View the Chain</Link>
            </div>
            <div>
              <Link to="/conduct-transaction">Conduct Transaction</Link>
            </div>
          </div>
        </div>
        <div className="HomeContainerBottom">
          <br />
          <div className="WalletInfo">
            <div className="Address">
              <div className="WalletLabel">Address:</div> {address}
            </div>
            <br />
            <div>
              <div className="WalletLabel">Balance:</div> {balance}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
