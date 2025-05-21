import React, {useContext} from 'react';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {restoreStory, deleteStory} from '../../state/actions/commandActions';
import ValueBadge from '../common/ValueBadge';

import {StyledStoryToolbar, StyledStory} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * One Trashed Story in the Trash
 */
const TrashedStory = ({story}) => {
  const {t} = useContext(L10nContext);
  const dispatch = useDispatch();

  const handleRestore = () => dispatch(restoreStory(story.id));
  const handleDelete = () => dispatch(deleteStory(story.id));

  return (
    <StyledStory>
      <StyledStoryToolbar>
        <i
          title={t('restore')}
          className="icon-level-up story-restore"
          onClick={handleRestore}
          data-testid="restoreStoryButton"
        ></i>
        <i
          title={t('delete')}
          className="icon-cancel-circled story-delete"
          onClick={handleDelete}
          data-testid="deleteStoryButton"
        />
      </StyledStoryToolbar>

      <StyledStoryTitle>
        <div>{story.title}</div>
        {story.consensus && <ValueBadge cardValue={story.consensus} />}
      </StyledStoryTitle>
    </StyledStory>
  );
};

TrashedStory.propTypes = {
  story: PropTypes.object
};

export default TrashedStory;
