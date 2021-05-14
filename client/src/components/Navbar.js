import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <div className="LogoContainer">
      <img className="MiniLogo" src={logo}></img>
      <div>
        <Link to="/">Back To Home</Link>
      </div>
    </div>
  );
};

export default Navbar;
