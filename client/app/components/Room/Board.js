import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Help from '../Help/Help';
import FeedbackHint from './FeedbackHint';
import Estimation from '../EstimationArea/EstimationArea';
import Settings from '../Settings/Settings';
import Users from '../Users/Users';
import ActionLog from '../ActionLog/ActionLog';
import Backlog from '../Backlog/Backlog';

import {StyledBoard} from './_styled';
import {getRoomId} from '../../state/room/roomSelectors';
import {isAStorySelected} from '../../state/stories/storiesSelectors';

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
  roomId: getRoomId(state),
  isAStorySelected: isAStorySelected(state)
}))(Board);
