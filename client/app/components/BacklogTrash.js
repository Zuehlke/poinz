import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import TrashedStory from './TrashedStory';

/**
 *
 */
const BacklogTrash = ({t, stories}) => {
  const trashedStories = stories ? Object.values(stories).filter((s) => s.trashed) : [];
  const hasTrashedStories = trashedStories.length > 0;

  return (
    <React.Fragment>
      {hasTrashedStories && (
        <div className="stories">
          {trashedStories.map((story) => (
            <TrashedStory story={story} key={story.id} />
          ))}
        </div>
      )}
      {!hasTrashedStories && <div className="story-hint">{t('trashEmpty')}</div>}
    </React.Fragment>
  );
};

BacklogTrash.propTypes = {
  t: PropTypes.func.isRequired,
  stories: PropTypes.object
};

export default connect((state) => ({
  t: state.translator,
  stories: state.stories
}))(BacklogTrash);
