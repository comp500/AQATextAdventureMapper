import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
