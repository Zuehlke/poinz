import React from 'react';
import classnames from 'classnames';
import { pure } from 'recompose';
import Anchorify from 'react-anchorify-text';

const Story = ({story, selectedStory, onSelect}) => {
  const classes = classnames('story', {'story-selected': selectedStory === story.get('id')});
  const onClick = onSelect.bind(undefined, story.get('id'));

  return (
    <div className={classes} onClick={onClick}>
      <h4>
        {story.get('title')}
      </h4>
      <div>
        <Anchorify text={story.get('description')}/>
      </div>
    </div>
  );
};

export default pure(Story);
