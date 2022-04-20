import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router';
import { Provider } from 'react-redux';
import * as reactRouterRedux from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';

// REACT PAGES GET IMPORTED RIGHT HERE AND ROUTES GET SETUP BELOW
import Homepage from './pages/Homepage.jsx';
import DeviceDataViewerPage from './pages/deviceDataViewerPage.jsx';

const store = configureStore();
const history = reactRouterRedux.syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={Homepage} />
        <Route path="/devices/details/:id" component={DeviceDataViewerPage} />
        <Route path="/devices" component={DeviceDataViewerPage} />
      </Switch>
    </Router>
  </Provider>,
    document.getElementById('appContent'),
);
