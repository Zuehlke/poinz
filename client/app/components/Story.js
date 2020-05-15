import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Anchorify from 'react-anchorify-text';
import PropTypes from 'prop-types';

import {selectStory, editStory, deleteStory} from '../actions';

/**
 * One story in the backlog
 */
const Story = ({
  story,
  selectedStoryId,
  selectStory,
  editStory,
  deleteStory,
  pendingSelectCommands
}) => {
  const isSelected = selectedStoryId === story.id;

  const classes = classnames('story clickable', {
    'story-selected': isSelected,
    waiting: Object.values(pendingSelectCommands).find((cmd) => cmd.payload.storyId === story.id)
  });

  return (
    <div className={classes} onClick={triggerSelect}>
      <i className="fa fa-pencil story-edit" onClick={triggerEdit}></i>
      <i className="fa fa-trash story-delete" onClick={triggerDelete} />
      <h4>{story.title}</h4>

      {
        // only display story text for selected story. improves overall readibility / usability (see #24)
        isSelected && (
          <div className="story-text">
            <Anchorify text={story.description} />
          </div>
        )
      }
    </div>
  );

  function triggerSelect() {
    selectStory(story.id);
  }

  function triggerEdit(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    editStory(story.id);
  }

  function triggerDelete(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    deleteStory(story.id, story.title);
  }
};

Story.propTypes = {
  story: PropTypes.object,
  selectedStoryId: PropTypes.string,
  selectStory: PropTypes.func,
  editStory: PropTypes.func,
  deleteStory: PropTypes.func,
  pendingSelectCommands: PropTypes.array
};

export default connect(
  (state) => ({
    selectedStoryId: state.selectedStory,
    pendingSelectCommands: Object.values(state.pendingCommands).filter(
      (cmd) => cmd.name === 'selectStory'
    )
  }),
  {selectStory, editStory, deleteStory}
)(Story);
