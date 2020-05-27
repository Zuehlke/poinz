import React from 'react';

import appConfig from '../services/appConfig';
import Board from '../components/Board';
import TopBar from '../components/TopBar';
import {formatDateTime} from '../services/timeUtil';

/**
 * Is displayed as soon as the user joined a room.
 * contains the top-bar, the board and the (bottom right) version info
 */
const Room = () => (
  <div style={{height: '100%'}}>
    <TopBar />
    <Board />
    <div className="version-info">
      {appConfig.version}
      {formatDateTime(appConfig.buildTime)}
    </div>
  </div>
);

export default Room;
