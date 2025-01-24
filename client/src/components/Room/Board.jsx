import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {useDragLayer} from 'react-dnd';

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
import {StyledBacklogWidthDragLayer} from '../Backlog/_styled';
import {DEFAULT_BACKLOG_WIDTH} from '../dimensions';

export const DRAG_ITEM_TYPES = {
  backlogWidthHandle: 'BACKLOG_WIDTH_HANDLE',
  matrixStory: 'MATRIX_STORY',
  backlogStory: 'BACKLOG_STORY'
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
  <StyledBoard id={roomId}>
    <BacklogWidthDragLayer />
    <Backlog />

    <StyledBoardCenter data-testid="board">
      <MatrixToggle onToggle={toggleMatrix} matrixShown={matrixShown} />

      {isAStorySelected && !matrixShown && <Users />}
      {isAStorySelected && !matrixShown && <EstimationArea />}

      {matrixShown && <EstimationMatrix />}
    </StyledBoardCenter>

    <StyledSidebarRight $shown={sidebarShown}>
      <Settings />
      <ActionLog />
      <Help />
    </StyledSidebarRight>

    <FeedbackHint />
  </StyledBoard>
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

/**
 * Layer above the board that is shown during backlog "width" dragging (i.e. resizinging of backlog).
 * See https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer
 *
 */
const BacklogWidthDragLayer = () => {
  const {isDragging, itemType, initialOffset, currentOffset} = useDragLayer((monitor) => ({
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    itemType: monitor.getItemType()
  }));

  if (!isDragging || itemType !== DRAG_ITEM_TYPES.backlogWidthHandle) {
    return null;
  }

  return (
    <StyledBacklogWidthDragLayer>
      <div style={getItemStyles(initialOffset, currentOffset)}></div>
    </StyledBacklogWidthDragLayer>
  );

  function getItemStyles(initialOffset, currentOffset) {
    if (!initialOffset || !currentOffset) {
      return {display: 'none'};
    }
    const transform = `translate(${Math.max(currentOffset.x, DEFAULT_BACKLOG_WIDTH)}px)`;
    return {
      transform,
      WebkitTransform: transform
    };
  }
};
