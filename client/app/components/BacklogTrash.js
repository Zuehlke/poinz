import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TrashedStory from './TrashedStory';
import {StyledBacklogInfoText, StyledStories} from '../styled/Backlog';

/**
 *
 */
const BacklogTrash = ({t, stories}) => {
  const trashedStories = stories ? Object.values(stories).filter((s) => s.trashed) : [];
  const hasTrashedStories = trashedStories.length > 0;

  return (
    <React.Fragment>
      {hasTrashedStories && (
        <StyledStories>
          {trashedStories.map((story) => (
            <TrashedStory story={story} key={story.id} />
          ))}
        </StyledStories>
      )}
      {!hasTrashedStories && <StyledBacklogInfoText>{t('trashEmpty')}</StyledBacklogInfoText>}
    </React.Fragment>
  );
};

BacklogTrash.propTypes = {
  t: PropTypes.func.isRequired,
  stories: PropTypes.object
};

export default connect((state) => ({
  t: state.translator,
  stories: state.stories
}))(BacklogTrash);
