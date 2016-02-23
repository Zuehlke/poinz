import React from 'react';
import { render } from 'react-dom';
import { bindActionCreators } from 'redux';
import log from 'loglevel';

/*eslint-disable no-unused-vars */
import normalizeCss from 'normalize.css';
import pureCss from 'purecss';
import pureCssResponsive from '../node_modules/purecss/build/grids-responsive-min.css';
import splushStyles from './assets/splush.styl';
/*eslint-enable no-unused-vars */

import store from './services/store';
import * as splushActions from './services/actions';

import Landing from './views/Landing';
import Board from './views/Board';
import TopBar from './components/TopBar';

const appConfig = __SPLUSH_CONFIG__; // this is set via webpack (see webpack.config.js and webpack.production.config.js)

if (appConfig.env === 'dev') {
  log.setLevel('debug');
  localStorage.debug = 'socket.io-client:*'; // enable socket.io debugging
} else {
  log.setLevel('error');
}

const actions = bindActionCreators(splushActions, store.dispatch);

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      room: store.getInitialState()
    };

    // subscribe to the redux store
    // set the store state to the state of our app -> triggers rerender
    store.subscribe(() => {
      const storeState = store.getState();
      log.debug('storeState', storeState.toJS());

      this.setState({
        room: storeState
      });
    });

  }

  componentDidMount() {
    // if our url already contains a pathname, request room for that value
    const roomIdFromUrl = location.pathname ? location.pathname.substr(1) : '';
    if (roomIdFromUrl) {
      actions.joinRoom(roomIdFromUrl);
    }
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
          <div className='version-info'>
            {__SPLUSH_CONFIG__.version}
          </div>
        </div>
      );
    } else {
      return (
        <Landing
          waitingForJoin={room.get('waitingForJoin')}
          actions={actions}
          presetUsername={room.get('presetUsername')}
        />
      );
    }

  }
}

render(React.createElement(App), document.getElementById('app-root'));
