import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

class ConductTransaction extends Component {
  state = {
    recipient: "",
    amount: 0,
  };

  updateRecipient = (event) => {
    this.setState({ recipient: event.target.value });
  };

  updateAmount = (event) => {
    if (isNaN(+event.target.value) === false) {
      this.setState({ amount: +event.target.value });
    } else {
      alert("Please Enter Only Numbers in Amount");
    }
  };

  render() {
    console.log("State: ", this.state);
    return (
      <div className="ViewContainer">
        <div className="LogoContainer">
          <img className="MiniLogo" src={logo}></img>
          <div>
            <Link to="/">Back To Home</Link>
          </div>
        </div>
        <div className="ConductTransactioin">
          <h3 className="LargeTitle">Conduct Transaction</h3>
          <FormGroup>
            <FormControl
              className="FormRow"
              input="text"
              placeholder="Recipient"
              value={this.state.recipient}
              onChange={this.updateRecipient}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              className="FormRow"
              input="number"
              placeholder="Amount"
              value={this.state.amount}
              onChange={this.updateAmount}
            />
          </FormGroup>
        </div>
      </div>
    );
  }
}

export default ConductTransaction;
