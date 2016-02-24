import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Anchorify from 'react-anchorify-text';

import { selectStory } from '../services/actions';

const Story = ({story, selectedStoryId, selectStory}) => {
  const classes = classnames('story', {'story-selected': selectedStoryId === story.get('id')});

  return (
    <div className={classes} onClick={() => selectStory(story.get('id'))}>
      <h4>
        {story.get('title')}
      </h4>
      <div>
        <Anchorify text={story.get('description')}/>
      </div>
    </div>
  );
};

export default connect(
  state => ({
    selectedStoryId: state.get('selectedStory')
  }),
  dispatch => bindActionCreators({selectStory}, dispatch)
)(Story);
