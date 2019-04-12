import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import displayCSS from '../../styles/display.module.scss';
import styles from './index.module.scss';
import NavbarLinks from './links';
import Modesta from '../../data/Modesta';

class Header extends Component {
  constructor(props) {
    super(props);
    this.open = React.createRef();
    this.navside = React.createRef();
    this.darken = React.createRef();
    this.openNavbar = this.openNavbar.bind(this);
    this.closeNavbar = this.closeNavbar.bind(this);
  }

  componentDidMount() {
    this.open.current.addEventListener('click', this.openNavbar);
    this.darken.current.addEventListener('click', this.closeNavbar);
  }

  componentWillUnmount() {
    // Don't keep stuff hanging there in the background
    this.open.current.removeEventListener('click', this.openNavbar);
    this.darken.current.removeEventListener('click', this.closeNavbar);
  }

  openNavbar() {
    if (this.navside.current && this.navside.current.style) {
      this.navside.current.style.transform = 'translateX(0px)';
      this.darken.current.style.opacity = '0.8';
      this.darken.current.style.pointerEvents = 'all';
    }
  }

  closeNavbar() {
    this.navside.current.style.transform = 'translateX(-250px)';
    this.darken.current.style.opacity = '0';
    this.darken.current.style.pointerEvents = 'none';
  }

  render() {
    return (
      <div className={styles.navbar}>
        <div className={`${displayCSS.desktop} ${Modesta.navContainer} ${styles.desktopNavbar} ${Modesta.default}`}>
          <h1 className={Modesta.navTitle}>
            <Link to="/">
              Home
            </Link>
          </h1>

          <div className={Modesta.sidenav}>
            <NavbarLinks />
          </div>
        </div>
        <div className={`${displayCSS.mobile} ${Modesta.navContainer} ${styles.mobileNavbar}`}>
          <span ref={this.open} className={Modesta.menuIcon}></span>

          <div className={`${styles.mobileNavContent} ${Modesta.navContent}`}>
            <h4 className={styles.mobileHeading}>
              <Link to="/">
                Home
              </Link>
            </h4>
          </div>

          <div className={Modesta.sidenav} ref={this.navside}>
            <NavbarLinks />
          </div>
        </div>
        <div ref={this.darken} className={`${styles.darken} ${displayCSS.mobile}`}></div>
      </div>
    );
  }
}

export default Header;
