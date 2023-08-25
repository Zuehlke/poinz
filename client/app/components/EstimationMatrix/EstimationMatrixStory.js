import React from 'react';
import PropTypes from 'prop-types';
import {useDrag} from 'react-dnd';

import {DRAG_ITEM_TYPES} from '../Room/Board';
import {StyledEMStory} from './_styled';

const EstimationMatrixStory = ({color, story}) => {
  const [{isDragging}, drag] = useDrag(
    () => ({
      type: DRAG_ITEM_TYPES.matrixStory,
      item: {id: story.id, consensus: story.consensus},
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    [story] // if anything changes in the story (especially the consensus), don't use cached values
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
export default EstimationMatrixStory;
