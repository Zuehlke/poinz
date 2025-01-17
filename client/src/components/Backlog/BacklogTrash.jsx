import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TrashedStory from './TrashedStory';
import {getTrashedStories} from '../../state/stories/storiesSelectors';

import {StyledBacklogInfoText, StyledBacklogTrash, StyledStories} from './_styled';
import {L10nContext} from '../../services/l10n';

/**
 * List of trashed stories
 */
const BacklogTrash = ({trashedStories}) => {
  const {t} = useContext(L10nContext);
  const hasTrashedStories = trashedStories.length > 0;

  return (
    <StyledBacklogTrash>
      {hasTrashedStories && (
        <StyledStories data-testid="trashedStories">
          {trashedStories.map((story) => (
            <TrashedStory story={story} key={story.id} />
          ))}
        </StyledStories>
      )}
      {!hasTrashedStories && <StyledBacklogInfoText>{t('trashEmpty')}</StyledBacklogInfoText>}
    </StyledBacklogTrash>
  );
};

BacklogTrash.propTypes = {
  trashedStories: PropTypes.array
};

export default connect((state) => ({
  trashedStories: getTrashedStories(state)
}))(BacklogTrash);
