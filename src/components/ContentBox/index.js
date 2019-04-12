import React, { Component } from 'react';
import Modesta from '../../data/Modesta';
import styles from './index.module.scss';
import ConstructCSS from '../../helpers/ConstructCSS';

class ContentBox extends Component {
  render() {
    return (
      <div className={ConstructCSS(Modesta.boxShadow, Modesta.secondary, styles.ContentBox)}>
        {this.props.children}
      </div>
    );
  }
}

export default ContentBox;
