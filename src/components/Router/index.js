import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SiteRoutes from '../../data/SiteRoutes';

class Router extends Component {
	render() {
		return (
			<Switch>
				{
					SiteRoutes
						.map((route, index) => {
							const RouteComponent = route.component;
							return (
								<Route key={index} path={route.path} exact={route.exact} component={({ match, location, staticContext}) => {
									if (staticContext) {
										staticContext.status = route.status || 200;
									}

									return (
										<RouteComponent match={match} location={location} staticContext={staticContext} />
									)
								}} />
							)
						})
				}
			</Switch>
		);
	}
}

export default Router;
