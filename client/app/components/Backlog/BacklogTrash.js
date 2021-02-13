import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TrashedStory from './TrashedStory';
import {getTrashedStories} from '../../state/stories/storiesSelectors';

import {StyledBacklogInfoText, StyledStoriesScrolling} from './_styled';
import {getTranslator} from '../../state/ui/uiSelectors';

/**
 * List of trashed stories
 */
const BacklogTrash = ({t, trashedStories}) => {
  const hasTrashedStories = trashedStories.length > 0;

  return (
    <React.Fragment>
      {hasTrashedStories && (
        <StyledStoriesScrolling data-testid="trashedStories">
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
  t: getTranslator(state),
  trashedStories: getTrashedStories(state)
}))(BacklogTrash);
