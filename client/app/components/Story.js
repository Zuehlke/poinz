import React from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Anchorify from 'react-anchorify-text';

import { selectStory, editStory } from '../services/actions';

const Story = ({ story, selectedStoryId, selectStory, editStory, pendingSelectCommands }) => {
  const classes = classnames('story clickable', {
    'story-selected': selectedStoryId === story.get('id'),
    'waiting': pendingSelectCommands.find(cmd => cmd.payload.storyId === story.get('id'))
  });

  return (
    <div className={classes} onClick={() => selectStory(story.get('id'))}>
      <i className='fa fa-pencil story-edit' onClick={triggerEdit}></i>
      <h4>
        {story.get('title')}
      </h4>
      <div>
        <Anchorify text={story.get('description')}/>
      </div>
    </div>
  );

  function triggerEdit(e) {
    e.stopPropagation(); // make sure to stop bubbling up. we do not want to trigger story select
    editStory(story.get('id'));
  }
};

Story.propTypes = {
  story: React.PropTypes.instanceOf(Immutable.Map),
  selectedStoryId: React.PropTypes.string,
  selectStory: React.PropTypes.func,
  editStory: React.PropTypes.func,
  pendingSelectCommands: React.PropTypes.instanceOf(Immutable.Map)
};

export default connect(
  state => ({
    selectedStoryId: state.get('selectedStory'),
    pendingSelectCommands: state.get('pendingCommands').filter(cmd => cmd.name === 'selectStory')
  }),
  dispatch => bindActionCreators({selectStory, editStory}, dispatch)
)(Story);
