import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import Board from './Board';
import TopBar from '../TopBar/TopBar';
import RoomFooter from './RoomFooter';
import {StyledRoom} from './_styled';

/**
 * Is displayed as soon as the user joined a room.
 * contains the top-bar, the board and the (bottom right) version info
 */
const Room = ({roomId}) => {
  useEffect(() => {
    document.title = 'Poinz - ' + roomId;
  }, [roomId]);

  return (
    <StyledRoom>
      <TopBar />
      <Board roomId={roomId} />
      <RoomFooter />
    </StyledRoom>
  );
};

Room.propTypes = {
  roomId: PropTypes.string.isRequired
};
export default Room;
