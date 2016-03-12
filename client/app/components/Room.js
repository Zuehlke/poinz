import React from 'react';
import fecha from 'fecha';

import appConfig from '../services/appConfig';
import Board from './Board';
import TopBar from './TopBar';

const Room = () => (
  <div style={{height:'100%'}}>
    <TopBar />
    <Board />
    <div className='version-info'>
      {appConfig.version}
      {fecha.format(appConfig.buildTime, ' DD.MM.YY HH:mm')}
    </div>
  </div>
);

export default Room;
