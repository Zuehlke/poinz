import React, {useCallback} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

import StoryAddForm from './StoryAddForm';
import StoryEditForm from './StoryEditForm';
import Story from './Story';

import {importCsvFile} from '../actions';

/**
 * show the story add form and list of active stories
 */
const BacklogActive = ({t, stories, importCsvFile}) => {
  const activeStories = stories ? Object.values(stories).filter((s) => !s.trashed) : [];
  const hasActiveStories = activeStories.length > 0;

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      importCsvFile(acceptedFiles[0]);
    }
  }, []);
  const {getRootProps, isDragActive} = useDropzone({onDrop});

  return (
    <div
      {...getRootProps()}
      className={'story-drop-zone ' + (isDragActive ? 'story-drop-zone-active' : '')}
    >
      <div className="drag-overlay">
        <i className="fa fa-caret-square-o-down"></i>
      </div>

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
    </div>
  );
};

BacklogActive.propTypes = {
  t: PropTypes.func.isRequired,
  stories: PropTypes.object,
  importCsvFile: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    stories: state.stories
  }),
  {importCsvFile}
)(BacklogActive);
