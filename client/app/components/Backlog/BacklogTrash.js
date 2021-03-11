import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TrashedStory from './TrashedStory';
import {getTrashedStories} from '../../state/stories/storiesSelectors';

import {StyledBacklogInfoText, StyledStoriesScrolling} from './_styled';
import {L10nContext} from '../../services/l10n';

/**
 * List of trashed stories
 */
const BacklogTrash = ({trashedStories}) => {
  const {t} = useContext(L10nContext);
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
  trashedStories: PropTypes.array
};

export default connect((state) => ({
  trashedStories: getTrashedStories(state)
}))(BacklogTrash);
