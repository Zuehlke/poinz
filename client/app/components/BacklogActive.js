import React, {useCallback} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

import StoryAddForm from './StoryAddForm';
import StoryEditForm from './StoryEditForm';
import Story from './Story';

import {importCsvFile} from '../actions';
import {
  StyledStories,
  StyledFileImportDropZone,
  StyledFileImportDropZoneOverlay,
  StyledBacklogInfoText
} from '../styled/Backlog';

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
  const {getRootProps, isDragActive, isDragAccept, isDragReject} = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    maxSize: 200000,
    acceptedFiles: [
      '.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values'
    ]
  });

  return (
    <StyledFileImportDropZone {...getRootProps()}>
      <StyledFileImportDropZoneOverlay
        active={isDragActive}
        isAccept={isDragAccept}
        isReject={isDragReject}
      ></StyledFileImportDropZoneOverlay>

      <StoryAddForm />

      {hasActiveStories && (
        <StyledStories>
          {activeStories.map((story) =>
            story.editMode ? (
              <StoryEditForm key={story.id} story={story} />
            ) : (
              <Story key={story.id} story={story} />
            )
          )}
        </StyledStories>
      )}

      {!hasActiveStories && <StyledBacklogInfoText>{t('noActiveStories')}</StyledBacklogInfoText>}
    </StyledFileImportDropZone>
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
