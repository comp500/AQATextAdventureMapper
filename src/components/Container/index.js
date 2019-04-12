import React, { Component } from 'react';
import Modesta from '../../data/Modesta';

class Container extends Component {
  render() {
    return (
      <div className={Modesta.container}>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
