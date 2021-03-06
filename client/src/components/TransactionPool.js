import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";
import Navbar from "./Navbar";
import history from "../history";

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then((response) => response.json())
      .then((json) => this.setState({ transactionPoolMap: json }));
  };

  fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`).then(
      (response) => {
        if (response.status === 200) {
          alert("success");
          history.push("/blocks");
        } else {
          alert("The mine-transactions block request did not complete.");
        }
      }
    );
  };

  componentDidMount() {
    this.fetchTransactionPoolMap();

    this.fetchPoolMapInterval = setInterval(
      () => this.fetchTransactionPoolMap(),
      POLL_INTERVAL_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    return (
      <div className="ViewContainer">
        <Navbar />
        <div>
          <h3 className="LargeTitle">Transaction Pool</h3>
        </div>
        {Object.values(this.state.transactionPoolMap).map((transaction) => {
          return (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          );
        })}
        <hr />
        <Button
          bsStyle="danger"
          bsSize="large"
          onClick={this.fetchMineTransactions}
        >
          Mine Transactions
        </Button>
      </div>
    );
  }
}

export default TransactionPool;
