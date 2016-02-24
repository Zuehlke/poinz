import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Backlog from '../components/Backlog';
import Users from '../components/Users';
import Estimation from '../components/Estimation';

const Board = ({ roomId, selectedStory, isModerator }) => {

  const boardClasses = classnames('board', {
    'board-moderator': isModerator
  });

  return (
    <div className={boardClasses} id={roomId}>
      <Users />

      <Backlog />

      {
        selectedStory &&
        <Estimation />
      }
    </div>
  );
};

export default connect(
  state => ({
    roomId: state.get('roomId'),
    selectedStory: state.getIn(['stories', state.get('selectedStory')]),
    isModerator: state.get('userId') === state.get('moderatorId')
  })
)(Board);
