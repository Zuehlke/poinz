import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TrashedStory from './TrashedStory';
import {StyledBacklogInfoText, StyledStoriesScrolling} from '../styled/Backlog';

/**
 *
 */
const BacklogTrash = ({t, trashedStories}) => {
  const hasTrashedStories = trashedStories.length > 0;

  return (
    <React.Fragment>
      {hasTrashedStories && (
        <StyledStoriesScrolling>
          {trashedStories.map((story) => (
            <TrashedStory story={story} key={story.id} />
          ))}
        </StyledStoriesScrolling>
      )}
      {!hasTrashedStories && <StyledBacklogInfoText>{t('trashEmpty')}</StyledBacklogInfoText>}
    </React.Fragment>
  );
};

BacklogTrash.propTypes = {
  t: PropTypes.func.isRequired,
  trashedStories: PropTypes.array
};

export default connect((state) => ({
  t: state.translator,
  trashedStories: state.stories ? Object.values(state.stories).filter((s) => s.trashed) : []
}))(BacklogTrash);
