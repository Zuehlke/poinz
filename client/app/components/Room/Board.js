import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import Help from '../Help/Help';
import FeedbackHint from './FeedbackHint';
import EstimationArea from '../EstimationArea/EstimationArea';
import Settings from '../Settings/Settings';
import Users from '../Users/Users';
import ActionLog from '../ActionLog/ActionLog';
import Backlog from '../Backlog/Backlog';
import EstimationMatrix from '../EstimationMatrix/EstimationMatrix';
import MatrixToggle from './MatrixToggle';

import {isAStorySelected} from '../../state/stories/storiesSelectors';
import {getCurrentSidebarIfAny} from '../../state/ui/uiSelectors';
import {toggleMatrix} from '../../state/actions/uiStateActions';

import {StyledBoard, StyledBoardCenter, StyledSidebarRight} from './_styled';

export const DnDItemTypes = {
  MATRIX_STORY: 'matrixStory',
  BACKLOG_STORY: 'backlogStory'
};

/**
 * The board is the main working area as soon as a room was joined.
 * It contains
 * - the backlog
 * - a list of users,
 * - estimations
 * - the current story
 * - cards
 */
const Board = ({roomId, isAStorySelected, sidebarShown, matrixShown, toggleMatrix}) => (
  <DndProvider backend={HTML5Backend}>
    <StyledBoard id={roomId}>
      <Backlog />

      <StyledBoardCenter data-testid="board">
        <MatrixToggle onToggle={toggleMatrix} matrixShown={matrixShown} />

        {isAStorySelected && !matrixShown && <Users />}
        {isAStorySelected && !matrixShown && <EstimationArea />}

        {matrixShown && <EstimationMatrix />}
      </StyledBoardCenter>

      <StyledSidebarRight shown={sidebarShown}>
        <Settings />
        <ActionLog />
        <Help />
      </StyledSidebarRight>

      <FeedbackHint />
    </StyledBoard>
  </DndProvider>
);

Board.propTypes = {
  roomId: PropTypes.string,
  isAStorySelected: PropTypes.bool,
  sidebarShown: PropTypes.bool,
  matrixShown: PropTypes.bool,
  toggleMatrix: PropTypes.func
};

export default connect(
  (state) => ({
    isAStorySelected: isAStorySelected(state),
    sidebarShown: !!getCurrentSidebarIfAny(state),
    matrixShown: state.ui.matrixShown
  }),
  {toggleMatrix}
)(Board);
