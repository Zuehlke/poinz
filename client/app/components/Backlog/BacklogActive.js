import React, {useCallback, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

import StoryEditForm from './StoryEditForm';
import Story from './Story';
import {importCsvFile} from '../../actions';
import {getActiveStories} from '../../services/selectors';
import BacklogSortForm, {sortings} from './BacklogSortForm';

import {
  StyledStories,
  StyledFileImportDropZone,
  StyledFileImportDropZoneOverlay,
  StyledBacklogInfoText
} from './_styled';

const sortAndFilter = (activeStories, comparator, query) => {
  let shallowCopy = query
    ? [...activeStories.filter((s) => s.title.toLowerCase().includes(query))]
    : [...activeStories];
  return shallowCopy.sort(comparator);
};

/**
 * show the story add form and list of active stories
 */
const BacklogActive = ({t, activeStories, filterQuery, importCsvFile}) => {
  const hasActiveStories = activeStories.length > 0;

  const [sorting, setSorting] = useState(sortings.newestFirst);
  const [sortedStories, setSortedStories] = useState(activeStories);
  useEffect(() => {
    setSortedStories(sortAndFilter(activeStories, sorting.comp, filterQuery));
  }, [activeStories, sorting, filterQuery]);

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
    accept:
      'text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values'
  });

  return (
    <StyledFileImportDropZone {...getRootProps()}>
      <StyledFileImportDropZoneOverlay
        active={isDragActive}
        isAccept={isDragAccept}
        isReject={isDragReject}
      ></StyledFileImportDropZoneOverlay>

      {hasActiveStories && (
        <React.Fragment>
          {activeStories.length > 1 && (
            <BacklogSortForm onSortingChanged={setSorting} sorting={sorting} />
          )}

          <StyledStories>
            {sortedStories.map((story) =>
              story.editMode ? (
                <StoryEditForm key={story.id} story={story} />
              ) : (
                <Story key={story.id} story={story} />
              )
            )}
          </StyledStories>
        </React.Fragment>
      )}

      {!hasActiveStories && <StyledBacklogInfoText>{t('noActiveStories')}</StyledBacklogInfoText>}
    </StyledFileImportDropZone>
  );
};

BacklogActive.propTypes = {
  t: PropTypes.func.isRequired,
  activeStories: PropTypes.array,
  filterQuery: PropTypes.string,
  importCsvFile: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    t: state.translator,
    activeStories: getActiveStories(state),
    filterQuery: state.backlogFilterQuery
  }),
  {importCsvFile}
)(BacklogActive);
