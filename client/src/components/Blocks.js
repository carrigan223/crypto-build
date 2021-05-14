import React, { Component } from "react";
import { Link } from "react-router-dom";
import Block from "./Block";
import logo from "../assets/logo.png";
import Navbar from "./Navbar";

class Blocks extends Component {
  state = { blocks: [] };

  componentDidMount() {
    fetch(`${document.location.origin}/api/blocks`)
      .then((response) => response.json())
      .then((json) => this.setState({ blocks: json }));
  }

  render() {
    console.log("block", this.state.blocks);
    return (
      <div className="ViewContainer">
        <Navbar />
        <br />
        <h3 className="LargeTitle">Blocks</h3>
        {this.state.blocks.map((block) => {
          return <Block key={block.hash} block={block} />;
        })}
      </div>
    );
  }
}

export default Blocks;
