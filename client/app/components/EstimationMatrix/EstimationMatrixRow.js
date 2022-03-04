import React from 'react';
import PropTypes from 'prop-types';

import {useDrag, useDrop} from 'react-dnd';

import {StyledEmptyEstimationMatrixCell, StyledEMRow, StyledEstimationMatrixCell} from './_styled';
import {ItemTypes} from './EstimationMatrix';

const EstimationMatrixRow = ({story, columnWidthPercentage, cardConfig, onStoryDropped}) => {
  return (
    <StyledEMRow>
      {cardConfig.map((cc) =>
        cc.value === story.consensus ? (
          <FillledMatrixCell
            key={story.id + ':' + cc.value}
            cc={cc}
            story={story}
            columnWidthPercentage={columnWidthPercentage}
          />
        ) : (
          <EmptyMatrixCell
            key={story.id + ':' + cc.value}
            columnWidthPercentage={columnWidthPercentage}
            onStoryDropped={(droppedStoryId) => onStoryDropped(droppedStoryId, cc.value)}
          />
        )
      )}
    </StyledEMRow>
  );
};

const FillledMatrixCell = ({columnWidthPercentage, cc, story}) => {
  const [{isDragging}, drag] = useDrag(
    () => ({
      type: ItemTypes.STORY,
      item: {id: story.id},
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    [story.id]
  );

  return (
    <StyledEstimationMatrixCell ref={drag} width={columnWidthPercentage} color={cc.color}>
      <h4 title={cc.label}>{story.title}</h4>
    </StyledEstimationMatrixCell>
  );
};

const EmptyMatrixCell = ({columnWidthPercentage, onStoryDropped}) => {
  const [{isOver}, drop] = useDrop(() => ({
    accept: ItemTypes.STORY,
    drop: (item) => onStoryDropped(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <StyledEmptyEstimationMatrixCell isOver={isOver} ref={drop} width={columnWidthPercentage}>
      &nbsp;
    </StyledEmptyEstimationMatrixCell>
  );
};

EstimationMatrixRow.propTypes = {
  story: PropTypes.object,
  columnWidthPercentage: PropTypes.number,
  cardConfig: PropTypes.array
};

export default EstimationMatrixRow;
