import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux'
import log from 'loglevel';

import normalizeCss from 'normalize.css';
import pureCss from 'purecss';
import pureCssResponsive from '../node_modules/purecss/build/grids-responsive-min.css';
import splushStyles from './assets/splush.styl';

import store from './services/store';
import * as splushActions from './services/actions'

import Landing from './views/Landing';
import Board from './views/Board';
import TopBar from './components/TopBar';

log.setLevel('debug'); // set our splush client loglevel
localStorage.debug = 'socket.io-client:socket*'; // enable socket.io debugging

const actions = bindActionCreators(splushActions, store.dispatch);

class App extends React.Component {

  constructor(props) {
    super(props);


    // if our url already contains a hash, request room for that hash
    const roomIdFromUrl = location.hash.substr(1);
    if (roomIdFromUrl) {
      actions.joinRoom(roomIdFromUrl);
    }

    this.state = {
      room: store.getInitialState()
    };

    // subscribe to the redux store
    // set the store state to the state of our app -> rerender
    store.subscribe(() => {
      const storeState = store.getState();
      log.debug('storeState', storeState.toJS());

      this.setState({
        room: storeState
      });
    });

  }

  render() {

    const { room } = this.state;

    if (!room) {
      return null;
    }

    if (room.get('roomId') && room.get('users') && room.get('users').size > 0) {
      return (
        <div style={{height:'100%'}}>
          <TopBar room={room} actions={actions}/>
          <Board room={room} actions={actions}/>
        </div>
      );
    }
    return <Landing actions={actions} presetUsername={room.get('presetUsername')}/>;

  }
}


render(React.createElement(App), document.getElementById('app-root'));
