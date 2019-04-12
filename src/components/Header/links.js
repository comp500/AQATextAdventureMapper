import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modesta, { TwitterEmojis } from '../../data/Modesta';

class NavbarLinks extends Component {
  render() {
    return (
      <>
        <Link to="/">
          Home
        </Link>
      </>
    )
  }
}

export default NavbarLinks;
