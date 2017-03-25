import React from 'react';
import {connect} from 'react-redux';

import Backlog from '../components/Backlog';
import UserMenu from '../components/UserMenu';
import ActionLog from '../components/ActionLog';
import Users from '../components/Users';

import Estimation from '../components/Estimation';

/**
 * The board is the main working area as soon as a room was joined.
 * It contains
 * - the backlog
 * - a list of users,
 * - estimations
 * - the current story
 * - cards
 */
const Board = ({roomId, isAStorySelected}) => (
  <div className="board" id={roomId}>
    <Users />
    <UserMenu />
    <ActionLog />
    <Backlog />
    {isAStorySelected && <Estimation />}
  </div>
);

Board.propTypes = {
  roomId: React.PropTypes.string,
  isAStorySelected: React.PropTypes.bool
};

export default connect(
  state => ({
    roomId: state.get('roomId'),
    isAStorySelected: !!state.getIn(['stories', state.get('selectedStory')])
  })
)(Board);
