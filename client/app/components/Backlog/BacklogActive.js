import React, {useCallback, useState, useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';

import {importCsvFile, trashStories, setStoriesOrder} from '../../state/actions/commandActions';
import {getActiveStories, getSelectedStoryId} from '../../state/stories/storiesSelectors';
import {L10nContext} from '../../services/l10n';
import {defaultSorting, manualSorting} from './backlogSortings';
import StoryEditForm from './StoryEditForm';
import Story from './Story';
import BacklogToolbar from './BacklogToolbar';

import {
  StyledStories,
  StyledBacklogActive,
  StyledFileImportDropZoneOverlay,
  StyledBacklogInfoText
} from './_styled';

const sortAndFilterStories = (activeStories, comparator, query) => {
  const lcQuery = query.toLowerCase();
  let shallowCopy = query
    ? [...activeStories.filter((s) => s.title.toLowerCase().includes(lcQuery))]
    : [...activeStories];
  return shallowCopy.sort(comparator);
};

/**
 * csv file drag'n'drop for story import
 * @param {function} onFilesDrop
 * @return {{isDragAccept, getRootProps, isDragActive, isDragReject}}
 */
const useDrop = (onFilesDrop) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFilesDrop(acceptedFiles[0]);
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

  return {getRootProps, isDragActive, isDragAccept, isDragReject};
};

/**
 * @param activeStories
 * @return {{setSorting, setFilterQuery, sorting, sortedStories, filterQuery}}
 */
const useSortingAndFiltering = (activeStories) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [sorting, setSorting] = useState(defaultSorting);
  const [sortedStories, setSortedStories] = useState(activeStories);
  useEffect(() => {
    setSortedStories(sortAndFilterStories(activeStories, sorting.comp, filterQuery));
  }, [activeStories, sorting, filterQuery]);

  return {filterQuery, setFilterQuery, sorting, setSorting, sortedStories, setSortedStories};
};

/**
 *
 * @param selectedStoryId
 * @param activeStories
 * @return {{highlightedStoryId, setHighlightedStoryId}}
 */
const useHighlightedStory = (selectedStoryId, activeStories) => {
  const [highlightedStoryId, setHighlightedStoryId] = useState(selectedStoryId);
  useEffect(() => {
    if (!highlightedStoryId || !activeStories.find((s) => s.id === highlightedStoryId)) {
      setHighlightedStoryId(selectedStoryId);
    }
  }, [selectedStoryId, activeStories]);

  return {highlightedStoryId, setHighlightedStoryId};
};

/**
 * List of active stories. Accepts drops of csv files for importing stories. Provides means to filter and sort active stories.
 */
const BacklogActive = ({
                         activeStories,
                         selectedStoryId,
                         importCsvFile,
                         trashStories,
                         setStoriesOrder
                       }) => {
  const {t} = useContext(L10nContext);
  const hasActiveStories = activeStories.length > 0;

  const {highlightedStoryId, setHighlightedStoryId} = useHighlightedStory(
    selectedStoryId,
    activeStories
  );

  const {filterQuery, setFilterQuery, sorting, setSorting, sortedStories, setSortedStories} =
    useSortingAndFiltering(activeStories);

  // on "trashAll", do only trash the currently visible stories (after filtering was applied)
  const onTrashAll = () => trashStories(sortedStories.map((story) => story.id));

  const {getRootProps, isDragActive, isDragAccept, isDragReject} = useDrop(importCsvFile);

  // move dragged story to the position of hoveredStory
  console.log('defining "locallyMoveStoryInList" ',sortedStories.length)
  const locallyMoveStoryInList = (draggedStoryId, hoveredStoryId) => {
    const draggedStory = findStoryObjectById(draggedStoryId);

    const draggedIndex = findStoryIndexById(draggedStoryId);
    const hoveredIndex = findStoryIndexById(hoveredStoryId);
    sortedStories.splice(draggedIndex, 1);
    sortedStories.splice(hoveredIndex, 0, draggedStory);

    setSortedStories([...sortedStories]);
  };

  const onStoryDragDropped = (draggedStoryId, hoveredStoryId) => {
    setSorting(manualSorting);
    setStoriesOrder(sortedStories.map((s) => s.id));
  };

  // const findStoryIndexById = useCallback(
  //   (storyId) => sortedStories.findIndex((s) => s.id === storyId),
  //   [sortedStories, activeStories]
  // );
  // const findStoryObjectById = useCallback(
  //   (storyId) => sortedStories.find((s) => s.id === storyId),
  //   [sortedStories, activeStories]
  // );
  const findStoryIndexById = (storyId) => sortedStories.findIndex((s) => s.id === storyId);
  const findStoryObjectById = (storyId) => sortedStories.find((s) => s.id === storyId);

  return (
    <StyledBacklogActive {...getRootProps()}>
      <StyledFileImportDropZoneOverlay
        active={isDragActive}
        isAccept={isDragAccept}
        isReject={isDragReject}
      />

      {hasActiveStories && (
        <React.Fragment>
          {activeStories.length > 1 && (
            <BacklogToolbar
              onTrashAll={onTrashAll}
              onSortingChanged={setSorting}
              sorting={sorting}
              onQueryChanged={setFilterQuery}
              filterQuery={filterQuery}
            />
          )}

          <StyledStories data-testid="activeStories">
            {sortedStories.map((story) =>
              story.editMode ? (
                <StoryEditForm key={story.id} story={story}/>
              ) : (
                <Story
                  key={story.id}
                  story={story}
                  isHighlighted={story.id === highlightedStoryId}
                  onStoryClicked={() => setHighlightedStoryId(story.id)}
                  onStoryDragHover={locallyMoveStoryInList}
                  onStoryDragDropped={onStoryDragDropped}
                />
              )
            )}
          </StyledStories>
        </React.Fragment>
      )}

      {!hasActiveStories && <StyledBacklogInfoText>{t('noActiveStories')}</StyledBacklogInfoText>}
    </StyledBacklogActive>
  );
};

BacklogActive.propTypes = {
  activeStories: PropTypes.array,
  selectedStoryId: PropTypes.string,
  importCsvFile: PropTypes.func.isRequired,
  trashStories: PropTypes.func.isRequired,
  setStoriesOrder: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    activeStories: getActiveStories(state),
    selectedStoryId: getSelectedStoryId(state)
  }),
  {importCsvFile, trashStories, setStoriesOrder}
)(BacklogActive);
