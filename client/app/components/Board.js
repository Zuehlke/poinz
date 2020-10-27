import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Backlog from '../components/Backlog';
import Settings from '../components/Settings';
import ActionLog from '../components/ActionLog';
import Help from '../components/Help';
import Users from '../components/Users';
import Estimation from '../components/Estimation';
import FeedbackHint from './FeedbackHint';
import {StyledBoard} from '../styled/Board';
import {isAStorySelected} from '../services/selectors';

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
  <StyledBoard id={roomId}>
    <Users />
    <Settings />
    <ActionLog />
    <Help />
    <Backlog />
    {isAStorySelected && <Estimation />}

    <FeedbackHint />
  </StyledBoard>
);

Board.propTypes = {
  roomId: PropTypes.string,
  isAStorySelected: PropTypes.bool
};

export default connect((state) => ({
  roomId: state.roomId,
  isAStorySelected: isAStorySelected(state)
}))(Board);
