import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ConsensusBadge from './ConsensusBadge';
import {restoreStory, deleteStory} from '../actions';

/**
 * One Trashed Story in the Trash
 */
const TrashedStory = ({t, story, cardConfig, restoreStory, deleteStory}) => {
  return (
    <div className="story">
      <div className="story-toolbar">
        <i
          title={t('restore')}
          className="fa fa-level-up story-restore"
          onClick={() => restoreStory(story.id)}
        ></i>
        <i
          title={t('delete')}
          className="fa fa-minus-circle story-delete"
          onClick={() => deleteStory(story.id)}
        />
      </div>

      <h4>
        <div>{story.title}</div>
        {story.consensus && (
          <ConsensusBadge cardConfig={cardConfig} consensusValue={story.consensus} />
        )}
      </h4>
    </div>
  );
};

TrashedStory.propTypes = {
  t: PropTypes.func.isRequired,
  story: PropTypes.object,
  cardConfig: PropTypes.array,
  restoreStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    cardConfig: state.cardConfig
  }),
  {restoreStory, deleteStory}
)(TrashedStory);
