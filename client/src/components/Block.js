import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

class Block extends Component {
  state = { displayTransaction: false };

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  };

  get displayTransaction() {
    const { data } = this.props.block;

    const stringedData = JSON.stringify(data);

    const dataDisplay =
      stringedData.length > 35
        ? `${stringedData.substring(0, 35)}...`
        : stringedData;

    if (this.state.displayTransaction) {
      return (
        <div>
          <h4 className="TransactionHeader">Transactions</h4>

          {data.map((transaction) => (
            <div key={transaction.id}>
              <hr className="BlockSeperator" />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button
            bsStyle="danger"
            bsSize="small"
            onClick={this.toggleTransaction}
          >
            Collapse
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Transactions: {dataDisplay}</div>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={this.toggleTransaction}
        >
          Show More
        </Button>
      </div>
    );
  }

  render() {
    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className="Block">
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
        {this.displayTransaction}
      </div>
    );
  }
}

export default Block;
