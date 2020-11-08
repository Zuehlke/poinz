import React from 'react';

import Board from './Board';
import TopBar from '../TopBar/TopBar';
import RoomFooter from './RoomFooter';
import {StyledRoom} from './_styled';

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
