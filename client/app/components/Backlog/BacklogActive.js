import React, {useCallback, useState, useEffect, useContext} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useDrop} from 'react-dnd';

import {trashStories, setSortOrder} from '../../state/actions/commandActions';
import {getActiveStories, getSelectedStoryId} from '../../state/stories/storiesSelectors';
import {L10nContext} from '../../services/l10n';
import {manualSorting} from '../common/storySortings';
import StoryEditForm from './StoryEditForm';
import Story from './Story';
import BacklogToolbar from './BacklogToolbar';
import {DRAG_ITEM_TYPES} from '../Room/Board';
import BacklogFileDropWrapper from './BacklogFileDropWrapper';
import useStorySortingAndFiltering from './useStorySortingAndFiltering';

import {StyledStories, StyledBacklogInfoText, StyledBacklogActive} from './_styled';

/**
 *
 * @param {string} selectedStoryId
 * @param {object[]} activeStories
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
 *
 * @param {object[]} sortedStories
 * @param {function} setSortedStories
 * @param {function} setSorting
 * @param {function} setSortOrder
 * @return {{dndFindStory, dndMoveStory, dndDragEnd, containerDropRef: *}}
 */
const useStoryDnD = (sortedStories, setSortedStories, setSorting, setSortOrder) => {
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
    (id, atIndex) => {
      const {story, index} = dndFindStory(id);
      const newlySortedStories = [...sortedStories];
      newlySortedStories.splice(index, 1);
      newlySortedStories.splice(atIndex, 0, story);
      setSorting(manualSorting);
      setSortedStories(newlySortedStories);
    },
    [dndFindStory, sortedStories, setSortedStories]
  );

  const dndDragEnd = useCallback(
    (id, originalIndex, didDrop) => {
      if (!didDrop) {
        // cancelled drag (e.g. outside container drop) > move story back to its original place
        dndMoveStory(id, originalIndex);
      } else {
        const stillSameSortOrder = sortedStories.every((s, i) => s.sortOrder === i);
        if (!stillSameSortOrder) {
          setSortOrder(sortedStories.map((s) => s.id));
        }
      }
    },
    [sortedStories, setSortOrder]
  );

  // important, so that the user can drag stories to the end of the list (drop after last story)
  const [, drop] = useDrop(() => ({accept: DRAG_ITEM_TYPES.backlogStory}));

  return {dndFindStory, dndMoveStory, dndDragEnd, containerDropRef: drop};
};

/**
 * List of active stories. Accepts drops of csv files for importing stories. Provides means to filter and sort active stories.
 */
const BacklogActive = ({activeStories, selectedStoryId, trashStories, setSortOrder}) => {
  const {t} = useContext(L10nContext);

  const {highlightedStoryId, setHighlightedStoryId} = useHighlightedStory(
    selectedStoryId,
    activeStories
  );

  const {filterQuery, setFilterQuery, sorting, setSorting, sortedStories, setSortedStories} =
    useStorySortingAndFiltering(activeStories);

  const {dndFindStory, dndMoveStory, dndDragEnd, containerDropRef} = useStoryDnD(
    sortedStories,
    setSortedStories,
    setSorting,
    setSortOrder
  );

  return (
    <StyledBacklogActive ref={containerDropRef}>
      <BacklogFileDropWrapper>
        <BacklogToolbar
          onTrashAll={onTrashAll}
          onSortingChanged={setSorting}
          sorting={sorting}
          onQueryChanged={setFilterQuery}
          filterQuery={filterQuery}
        />
        {activeStories.length > 0 && (
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
                  dndDragEnd={dndDragEnd}
                  dndMoveStory={dndMoveStory}
                  dndFindStory={dndFindStory}
                />
              )
            )}
          </StyledStories>
        )}
        {activeStories.length < 1 && (
          <StyledBacklogInfoText>{t('noActiveStories')}</StyledBacklogInfoText>
        )}
      </BacklogFileDropWrapper>
    </StyledBacklogActive>
  );

  /**
   * do only trash the currently visible stories (after filtering was applied)
   */
  function onTrashAll() {
    trashStories(sortedStories.map((story) => story.id));
  }
};

BacklogActive.propTypes = {
  activeStories: PropTypes.array,
  selectedStoryId: PropTypes.string,
  trashStories: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired
};

export default connect(
  (state) => ({
    activeStories: getActiveStories(state),
    selectedStoryId: getSelectedStoryId(state)
  }),
  {trashStories, setSortOrder}
)(BacklogActive);
