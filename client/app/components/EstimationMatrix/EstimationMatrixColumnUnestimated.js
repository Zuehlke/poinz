import React from 'react';
import PropTypes from 'prop-types';
import {useDrop} from 'react-dnd';

import {StyledValueBadge} from '../common/_styled';
import {StyledEMColumn} from './_styled';
import EstimationMatrixStory from './EstimationMatrixStory';

export const EstimationMatrixColumnUnestimated = ({stories, columnWidth, onStoryDropped}) => {
  const [{isOver}, drop] = useDrop(
    () => ({
      accept: '_NONE_', // at the moment, user cannot drag stories to first column. test if setStoryValue can be used to "clear" consensus
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    [stories, onStoryDropped]
  );

  return (
    <StyledEMColumn ref={drop} $width={columnWidth} $isOver={isOver}>
      <div>
        <StyledValueBadge $cardColor={'transparent'} data-testid="cardValueBadge">
          <div>&nbsp;</div>
        </StyledValueBadge>
      </div>
      {stories.map((story) => (
        <EstimationMatrixStory color={'#ccc'} key={'em:story:' + story.id} story={story} />
      ))}
    </StyledEMColumn>
  );
};

EstimationMatrixColumnUnestimated.propTypes = {
  stories: PropTypes.array,
  columnWidth: PropTypes.number,
  onStoryDropped: PropTypes.func
};

export default EstimationMatrixColumnUnestimated;
