import React from 'react';
import Immutable from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classnames from 'classnames';
import Anchorify from 'react-anchorify-text';

import {selectStory, editStory, deleteStory} from '../actions';

/**
 * One story in the backlog
 */
const Story = ({story, selectedStoryId, selectStory, editStory, deleteStory, pendingSelectCommands}) => {

  const isSelected = selectedStoryId === story.get('id');

  const classes = classnames('story clickable', {
    'story-selected': isSelected,
    'waiting': pendingSelectCommands.find(cmd => cmd.payload.storyId === story.get('id'))
  });

  return (
    <div className={classes} onClick={triggerSelect}>
      <i className="fa fa-pencil story-edit" onClick={triggerEdit}></i>
      <i className="fa fa-trash story-delete" onClick={triggerDelete}/>
      <h4>
        {story.get('title')}
      </h4>

      {
        // only display story text for selected story. improves overall readibility / usability (see #24)
        isSelected &&
        <div className="story-text">
          <Anchorify text={story.get('description')}/>
        </div>
      }
    </div>
  );

  function triggerSelect() {
    selectStory(story.get('id'));
  }

  function triggerEdit(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    editStory(story.get('id'));
  }

  function triggerDelete(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    deleteStory(story.get('id'), story.get('title'));
  }
};

Story.propTypes = {
  story: React.PropTypes.instanceOf(Immutable.Map),
  selectedStoryId: React.PropTypes.string,
  selectStory: React.PropTypes.func,
  editStory: React.PropTypes.func,
  deleteStory: React.PropTypes.func,
  pendingSelectCommands: React.PropTypes.instanceOf(Immutable.Map)
};

export default connect(
  state => ({
    selectedStoryId: state.get('selectedStory'),
    pendingSelectCommands: state.get('pendingCommands').filter(cmd => cmd.name === 'selectStory')
  }),
  dispatch => bindActionCreators({selectStory, editStory, deleteStory}, dispatch)
)(Story);
