import React, {useCallback, useState, useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';
import {useDrop} from 'react-dnd';

import {importCsvFile, trashStories, setSortOrder} from '../../state/actions/commandActions';
import {getActiveStories, getSelectedStoryId} from '../../state/stories/storiesSelectors';
import {L10nContext} from '../../services/l10n';
import {defaultSorting, manualSorting} from './backlogSortings';
import StoryEditForm from './StoryEditForm';
import Story from './Story';
import BacklogToolbar from './BacklogToolbar';
import {DRAG_ITEM_TYPES} from '../Room/Board';

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
const useFileDrop = (onFilesDrop) => {
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
  setSortOrder
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

  // file drop
  const {getRootProps, isDragActive, isDragAccept, isDragReject} = useFileDrop(importCsvFile);

  const dndFindStory = useCallback(
    (id) => {
      const story = sortedStories.find((s) => s.id === id);
      return {
        story,
        index: sortedStories.indexOf(story)
      };
    },
    [sortedStories]
  );
  const dndMoveStory = useCallback(
    (id, atIndex, allDone) => {
      if (allDone) {
        setSortOrder(sortedStories.map((s) => s.id));
      } else {
        const {story, index} = dndFindStory(id);

        const newlySortedStories = [...sortedStories];
        newlySortedStories.splice(index, 1);
        newlySortedStories.splice(atIndex, 0, story);
        setSorting(manualSorting);

        setSortedStories(newlySortedStories);
      }
    },
    [dndFindStory, sortedStories, setSortedStories]
  );

  // important, so that the user can drag stories to the end of the list (drop after last story)
  const [, drop] = useDrop(() => ({accept: DRAG_ITEM_TYPES.backlogStory}));
  return (
    <StyledBacklogActive {...getRootProps()} ref={drop}>
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
                <StoryEditForm key={story.id} story={story} />
              ) : (
                <Story
                  key={story.id}
                  story={story}
                  isHighlighted={story.id === highlightedStoryId}
                  onStoryClicked={() => setHighlightedStoryId(story.id)}
                  dndMoveStory={dndMoveStory}
                  dndFindStory={dndFindStory}
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
  setSortOrder: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    activeStories: getActiveStories(state),
    selectedStoryId: getSelectedStoryId(state)
  }),
  {importCsvFile, trashStories, setSortOrder}
)(BacklogActive);
