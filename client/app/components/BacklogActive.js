import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import StoryAddForm from './StoryAddForm';
import StoryEditForm from './StoryEditForm';
import Story from './Story';

/**
 * show the story add form and list of active stories
 */
const BacklogActive = ({t, stories}) => {
  const activeStories = stories ? Object.values(stories).filter((s) => !s.trashed) : [];
  const hasActiveStories = activeStories.length > 0;

  return (
    <React.Fragment>
      <StoryAddForm />

      {hasActiveStories && (
        <div className="stories">
          {activeStories.map((story) =>
            story.editMode ? (
              <StoryEditForm key={story.id} story={story} />
            ) : (
              <Story key={story.id} story={story} />
            )
          )}
        </div>
      )}

      {!hasActiveStories && <div className="story-hint">{t('noActiveStories')}</div>}
    </React.Fragment>
  );
};

BacklogActive.propTypes = {
  t: PropTypes.func.isRequired,
  stories: PropTypes.object
};

export default connect((state) => ({
  t: state.translator,
  stories: state.stories
}))(BacklogActive);
