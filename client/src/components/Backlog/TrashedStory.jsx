import React, {useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {L10nContext} from '../../services/l10n';
import {restoreStory, deleteStory} from '../../state/actions/commandActions';
import ValueBadge from '../common/ValueBadge';

import {StyledStoryToolbar, StyledStory} from './_styled';
import {StyledStoryTitle} from '../_styled';

/**
 * One Trashed Story in the Trash
 */
const TrashedStory = ({story, restoreStory, deleteStory}) => {
  const {t} = useContext(L10nContext);
  return (
    <StyledStory>
      <StyledStoryToolbar>
        <i
          title={t('restore')}
          className="icon-level-up story-restore"
          onClick={() => restoreStory(story.id)}
          data-testid="restoreStoryButton"
        ></i>
        <i
          title={t('delete')}
          className="icon-cancel-circled story-delete"
          onClick={() => deleteStory(story.id)}
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
  story: PropTypes.object,
  restoreStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired
};

export default connect(() => ({}), {restoreStory, deleteStory})(TrashedStory);
