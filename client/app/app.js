import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';

import normalizeCss from 'normalize.css';
import pureCss from 'purecss';
import splushStyles from './assets/splush.styl';

import store, { ACTIONS } from './services/store';
import hub from './services/hub';

import Landing from './views/landing';
import Board from './views/board';


log.setLevel('debug'); // set our splush client loglevel
localStorage.debug = 'socket.io-client:socket*'; // enable socket.io debugging

class App extends React.Component {

  constructor(props) {
    super(props);

    // if our url already contains a hash, request room for that hash
    const roomIdFromUrl = location.hash.substr(1);
    if (roomIdFromUrl) {
      ACTIONS.requestRoom(roomIdFromUrl);
    }

    this.state = {};

    store.subscribe(() => {
      const storeState = store.getState();
      log.debug('storeState', storeState.toJS());

      this.setState({
        roomId: storeState.get('roomId'),
        people: storeState.get('people')
      });
    });

  }


  render() {

    const { roomId, people } = this.state;

    if (roomId && people) {
      return <Board {...this.state} />;
    }

    return <Landing />;

  }
}

render(React.createElement(App), document.getElementById('app-root'));
