import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import config from './config/config';
import RestHooks from './RestHooks';
import AddHook from './AddHook';
import UpdateHook from './UpdateHook';
import RoleTopics from './RoleTopics';
import { getFreshToken, configureConnector, decodeToken } from './services/tc-auth';

class App extends Component {
  constructor() {
    super();
    this.state = {
      tokenV3: '',
      isLoggedIn: false,
      currentUser: null
    };
    configureConnector({
      connectorUrl: config.ACCOUNTS_APP_CONNECTOR,
      frameId: 'tc-accounts-iframe',
    });
  }

  componentDidMount() {
    this.authenticate()
  }

  authenticate() {
    return getFreshToken().then((token) => {
      // console.log(`current user token: ${token}`);
      sessionStorage.setItem('token', token);
      const user = decodeToken(token);
      user.isAdmin = user.roles && user.roles.indexOf(config.TC_ADMIN_ROLE) >= 0;
      this.setState({
        tokenV3: token,
        currentUser: user,
        isLoggedIn: true,
      });
      return ({ token });
    }).catch((e) => {
      let url = `retUrl=${encodeURIComponent(config.APP_URL)}`;
      url = `${config.TC_AUTH_URL}/member?${url}`;
      location.href = url; // eslint-disable-line no-restricted-globals
      return ({});
    });
  }

  logout() {
    const url = `${config.TC_AUTH_URL}/#!/logout?retUrl=${encodeURIComponent(config.APP_URL)}`
    location.href = url; // eslint-disable-line no-restricted-globals
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className="App">
          <nav class="navbar is-transparent">
            <div class="container">
              <div class="navbar-brand">
                <a href="/" class="navbar-item">
                  <h1 class="is-size-3">VORBOTE</h1>
                </a>
              </div>
            </div>
          </nav>
        </div>
      )
    }
    return (
      <Router>
        <div className="App">
          <nav class="navbar is-transparent">
            <div class="container">
              <div class="navbar-brand">
                <a href="/" class="navbar-item">
                  <h1 class="is-size-3">VORBOTE</h1>
                </a>
              </div>
              <div class="navbar-menu">
                <div class="navbar-end">
                  <div class="navbar-item has-dropdown is-hoverable">
                    <a href="/" class="navbar-link">
                      Welcome, {this.state.currentUser.handle}
                    </a>
                    <div class="navbar-dropdown is-boxed">
                      {/* <a href="/" class="navbar-item">Logout</a> */}
                      <a onClick={this.logout}>Logout</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <section class="section">
            <div class="container">
              <div class="columns">
                <div class="column">
                  <h5 class="is-size-5 has-text-grey-light">Topcoder Event RestHooks Management</h5>
                </div>
              </div>            
              <div>
                <Route exact path="/" render={(props) => <RestHooks {...props} currentUser={this.state.currentUser} />} />
                <Route exact path="/addhook" render={(props) => <AddHook {...props} currentUser={this.state.currentUser} />} />
                <Route exact path="/updatehook/:id" render={(props) => <UpdateHook {...props} currentUser={this.state.currentUser} />} />
                <Route exact path="/roletopics" render={(props) => <RoleTopics {...props} currentUser={this.state.currentUser} />} />
              </div>
            </div>
          </section>
        </div>
      </Router>
    );
  }
}

export default App;
