import React from 'react';
import PropTypes from 'prop-types';
import {useDrag, useDrop} from 'react-dnd';

import ValueBadge from '../common/ValueBadge';
import {DRAG_ITEM_TYPES} from '../Room/Board';

import {StyledEMColumn, StyledEMStory} from './_styled';

export const EstimationMatrixColumn = ({stories, columnWidth, cc, onStoryDropped}) => {
  const [{isOver}, drop] = useDrop(() => ({
    accept: DRAG_ITEM_TYPES.matrixStory,
    drop: (item) => {
      if (item.consensus !== cc.value) {
        onStoryDropped(item.id, cc.value);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

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

const EstimationMatrixStory = ({color, story}) => {
  const [{isDragging}, drag] = useDrag(
    () => ({
      type: DRAG_ITEM_TYPES.matrixStory,
      item: {id: story.id, consensus: story.consensus},
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    [story.id]
  );

  return (
    <StyledEMStory ref={drag} $color={color} $isDragging={isDragging}>
      <h4>{story.title}</h4>
    </StyledEMStory>
  );
};

EstimationMatrixStory.propTypes = {
  color: PropTypes.string,
  story: PropTypes.object
};
