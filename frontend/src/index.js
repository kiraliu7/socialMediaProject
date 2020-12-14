import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createStore } from 'redux';
import { socialmediaApp } from './reducers';
import Main from './main';
import Profile from './profile';
import Landing from './landing';

import "./mycss.css";
import * as serviceWorker from './serviceWorker';

const store = createStore(socialmediaApp);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path={"/"}>
            <Landing/>
          </Route>
          <Route exact path={"/main"}>
            <Main/>
          </Route>
          <Route exact path={"/profile"}>
            <Profile/>
          </Route>
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
