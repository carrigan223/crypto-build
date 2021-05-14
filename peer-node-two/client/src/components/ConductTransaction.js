import React, { Component } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import history from "../history";

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

  conductTransaction = () => {
    const { recipient, amount } = this.state;

    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((res) => res.json())
      .then((json) => {
        alert(json.message || json.type);
        history.push("/transaction-pool");
      });
  };

  render() {
    return (
      <div className="ViewContainer">
        <Navbar />
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
          <div>
            <Button bsStyle="danger" onClick={this.conductTransaction}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ConductTransaction;
