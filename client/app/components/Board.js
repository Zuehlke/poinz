import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Backlog from '../components/Backlog';
import UserMenu from '../components/UserMenu';
import ActionLog from '../components/ActionLog';
import Users from '../components/Users';

import Estimation from '../components/Estimation';
import FeedbackHint from './FeedbackHint';

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

    <FeedbackHint />
  </div>
);

Board.propTypes = {
  roomId: PropTypes.string,
  isAStorySelected: PropTypes.bool
};

export default connect((state) => ({
  roomId: state.roomId,
  isAStorySelected: !!state.stories[state.selectedStory]
}))(Board);
