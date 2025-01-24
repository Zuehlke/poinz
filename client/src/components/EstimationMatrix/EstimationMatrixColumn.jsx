import React from 'react';
import PropTypes from 'prop-types';
import {useDrop} from 'react-dnd';

import ValueBadge from '../common/ValueBadge';
import {DRAG_ITEM_TYPES} from '../Room/Board';
import EstimationMatrixStory from './EstimationMatrixStory';

import {StyledEMColumn} from './_styled';

export const EstimationMatrixColumn = ({stories, columnWidth, cc, onStoryDropped}) => {
  const [{isOver}, drop] = useDrop(
    () => ({
      accept: onStoryDropped ? DRAG_ITEM_TYPES.matrixStory : '_NONE_',
      drop: (item) => {
        if (onStoryDropped && item.consensus !== cc.value) {
          // if item.consensus and cc.value is the same - story was dropped on original/current column
          // only invoke onStoryDropped if current consensus is not equal to target column (cc.value)
          onStoryDropped(item.id, cc.value);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    [stories, cc, onStoryDropped]
  );

  return (
    <StyledEMColumn ref={drop} $width={columnWidth} $isOver={isOver}>
      <div>
        <ValueBadge cardValue={cc.value} />
      </div>
      {stories.map((story) => (
        <EstimationMatrixStory color={cc.color} key={'em:story:' + story.id} story={story} />
      ))}
    </StyledEMColumn>
  );
};

EstimationMatrixColumn.propTypes = {
  stories: PropTypes.array,
  columnWidth: PropTypes.number,
  cc: PropTypes.object,
  onStoryDropped: PropTypes.func
};

export default EstimationMatrixColumn;
