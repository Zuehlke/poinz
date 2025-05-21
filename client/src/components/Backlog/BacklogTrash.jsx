import React, {useContext} from 'react';
import {useSelector} from 'react-redux';

import TrashedStory from './TrashedStory';
import {getTrashedStories} from '../../state/stories/storiesSelectors';

import {StyledBacklogInfoText, StyledBacklogTrash, StyledStories} from './_styled';
import {L10nContext} from '../../services/l10n';

/**
 * List of trashed stories
 */
const BacklogTrash = () => {
  const {t} = useContext(L10nContext);
  const trashedStories = useSelector(getTrashedStories);
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

export default BacklogTrash;
