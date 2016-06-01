import React from 'react';
import { Route, IndexRoute } from 'react-router';

import PulseApp from './containers/PulseApp';
import MyEvents from './containers/MyEvents';
import Nasedkin from './containers/Nasedkin';
import Login from './containers/Login';
import Project from './containers/Project';

export default (
  <Route path='/' component={PulseApp}>
    <IndexRoute components={{nasedkin: Nasedkin}} />
    <Route path='badanina' components={{myEvents: MyEvents}} />
    <Route path='login' components={{login: Login}} />
    <Route path='project/:slug' components={{project: Project}} />
  </Route>
);
