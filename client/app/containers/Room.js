import React from 'react';

import Board from '../components/Board';
import TopBar from '../components/TopBar';
import RoomFooter from '../components/RoomFooter';

/**
 * Is displayed as soon as the user joined a room.
 * contains the top-bar, the board and the (bottom right) version info
 */
const Room = () => (
  <div style={{height: '100%'}}>
    <TopBar />
    <Board />
    <RoomFooter />
  </div>
);

export default Room;
