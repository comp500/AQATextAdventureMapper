import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SiteRoutes from '../../data/SiteRoutes';

class Router extends Component {
  render() {
    return (
      <Switch>
        {
          SiteRoutes
            .map((route) => {
              return (
                <Route path={route.path} component={route.component} exact={route.exact}/>
              )
            })
        }
      </Switch>
    );
  }
}

export default Router;
