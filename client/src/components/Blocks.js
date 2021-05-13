import React, { Component } from "react";
import { Link } from "react-router-dom";
import Block from "./Block";
import logo from "../assets/logo.png";

class Blocks extends Component {
  state = { blocks: [] };

  componentDidMount() {
    fetch("http://localhost:3000/api/blocks")
      .then((response) => response.json())
      .then((json) => this.setState({ blocks: json }));
  }

  render() {
    return (
      <div className="ViewContainer">
        <div className="LogoContainer">
          <img className="MiniLogo" src={logo}></img>
          <div>
            <Link to="/">Back To Home</Link>
          </div>
        </div>
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
