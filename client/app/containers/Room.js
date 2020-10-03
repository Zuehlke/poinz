import React from 'react';

import Board from '../components/Board';
import TopBar from '../components/TopBar';
import RoomFooter from '../components/RoomFooter';
import {StyledRoom} from '../styled/Room';

/**
 * Is displayed as soon as the user joined a room.
 * contains the top-bar, the board and the (bottom right) version info
 */
const Room = () => (
  <StyledRoom>
    <TopBar />
    <Board />
    <RoomFooter />
  </StyledRoom>
);

export default Room;
