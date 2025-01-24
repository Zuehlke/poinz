import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

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
    <DndProvider backend={HTML5Backend}>
      <StyledRoom>
        <TopBar />
        <Board roomId={roomId} />
        <RoomFooter />
      </StyledRoom>
    </DndProvider>
  );
};

Room.propTypes = {
  roomId: PropTypes.string.isRequired
};
export default Room;
