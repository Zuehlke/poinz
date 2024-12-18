import styled from 'styled-components';

import {
  COLOR_BACKGROUND_GREY,
  COLOR_BLUE,
  COLOR_LIGHT_GREY,
  COLOR_LIGHTER_GREY,
  COLOR_ORANGE,
  COLOR_WARNING
} from '../colors';
import {device, TOPBAR_HEIGHT} from '../dimensions';

export const StyledBacklog = styled.div.attrs((props) => ({
  style: {
    width: props.$shown ? '100%' : props.$width + 'px'
  }
}))`
  position: relative;
  box-sizing: border-box;
  padding: 8px 0 0 0;
  background: ${COLOR_BACKGROUND_GREY};
  flex-shrink: 0;
  flex-grow: 0;

  display: ${({$shown}) => ($shown ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  @media ${device.desktop} {
    display: flex;
  }
`;

export const StyledBacklogWidthDragHandle = styled.div`
  display: none; /* in mobile view, we cannot resize backlog*/
  top: 8px;
  right: 0;
  position: absolute;
  bottom: 8px;
  border-right: 1px solid ${COLOR_LIGHTER_GREY};
  width: 6px;

  transition: all 0.15s ease-in-out;

  /** the "dots" **/

  > div {
    transition: all 0.15s ease-in-out;
    background: ${COLOR_BLUE};
    height: 3px;
    width: 3px;
    border-radius: 50%;
    margin-bottom: 4px;
    margin-right: 2px;
    opacity: 0;
  }

  &:hover {
    cursor: ew-resize;
    border-right: 1px solid ${COLOR_BLUE};
    opacity: 0.7;

    > div {
      opacity: 0.7;
    }
  }

  @media ${device.desktop} {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }
`;

export const StyledBacklogWidthDragLayer = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 5000;
  left: 0;
  top: ${TOPBAR_HEIGHT}px;
  bottom: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.4);

  > div {
    height: 100%;
    width: 1px;
    z-index: 5000;
    background: ${COLOR_BLUE};
  }
`;

export const StyledStories = styled.div`
  margin: 16px 8px 0 0;
`;

export const StyledEditForm = styled.form`
  background: #fff;
  box-sizing: border-box;
  border-radius: 2px;

  input,
  textarea {
    resize: vertical;
    background: transparent;
    border: none;
    border-bottom: 1px solid ${COLOR_LIGHTER_GREY};
  }

  textarea {
    min-height: 128px;
    margin-top: 2px;

    &:focus {
      border-bottom: 1px solid ${COLOR_BLUE};
    }
  }
`;

export const StyledEditFormButtonGroup = styled.div`
  > div {
    padding: 0 4px;
    box-sizing: border-box;
  }
`;

export const StyledAddForm = styled(StyledEditForm)`
  margin: 0 8px;
  padding: 8px 16px 16px 16px;
  border: 1px solid ${COLOR_LIGHTER_GREY};

  textarea {
    min-height: 64px;
  }
`;

export const StyledBacklogInfoText = styled.div`
  margin-top: 16px;
  text-align: center;
`;

export const StyledBacklogActive = styled.div`
  margin: 16px 0 0 8px;
  outline: none;
  border: none;
  overflow-y: auto;
  flex-grow: 1;
`;

export const StyledBacklogTrash = styled.div`
  margin-left: 8px;
  overflow-y: auto;
`;

const dzOverlayAcceptBorder = '4px dashed rgba(0, 153, 204, 0.25)';
const dzOverlayAcceptBg = 'rgba(0, 153, 204, 0.02)';
const dzOverlayRejectBorder = '4px dashed rgba(255, 130, 10, 0.3)';
const dzOverlayRejectBg = 'rgba(255, 130, 10, 0.06)';

export const StyledFileImportDropZoneOverlay = styled.div`
  display: ${({$active}) => ($active ? 'block' : 'none')};
  position: absolute;
  left: 0;
  right: 0;
  top: 33px;
  height: calc(100% - 51px);
  margin: 4px;
  font-size: 62px;
  color: rgba(0, 153, 204, 0.25);
  z-index: ${({$active}) => ($active ? 1000 : 0)};

  border: ${({$active, $isAccept, $isReject}) =>
    $active && $isAccept
      ? dzOverlayAcceptBorder
      : $active && $isReject
        ? dzOverlayRejectBorder
        : 'none'};
  background: ${({$active, $isAccept, $isReject}) =>
    $active && $isAccept
      ? dzOverlayAcceptBg
      : $active && $isReject
        ? dzOverlayRejectBg
        : 'transparent'};
`;

export const StyledStory = styled.div`
  position: relative;
  background: white;
  padding: 8px 16px 16px 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid ${COLOR_LIGHTER_GREY};
  cursor: pointer;
  opacity: ${(props) => (props.$isDragging ? 0 : 1)};
  border-left: ${({$selected, $highlighted}) =>
    $selected
      ? '2px solid ' + COLOR_ORANGE
      : $highlighted
        ? '1px solid ' + COLOR_BLUE
        : '1px solid ' + COLOR_LIGHTER_GREY};

  &:hover {
    box-shadow: ${({$noShadow}) =>
      $noShadow ? 'none' : 'inset 0 82px 50px -60px rgba(194, 194, 194, 0.45)'};
  }
`;

export const StyledStoryToolbar = styled.div`
  display: flex;
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 18px;

  > i {
    margin: 0 4px;
    opacity: 0;
    display: block;
    padding: 6px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
  }

  /* My parent "StoryWrapper" gets hovered. my child "i" gets additional styles ... neat! */

  ${StyledStory}:hover & i {
    opacity: 0.6;
    background: white;
    border-radius: 50%;

    &:hover {
      opacity: 1;

      &.story-delete {
        color: ${COLOR_WARNING};
      }
    }
  }
`;

export const StyledHighlightButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 16px;
`;

export const StyledStoryAttributes = styled.div`
  > span {
    color: ${COLOR_LIGHT_GREY};
    font-size: 12px;
  }
`;

export const StyledBacklogToolbar = styled.form`
  padding: 8px 8px 8px 8px;
  margin-right: 8px;
  border-bottom: 1px solid ${COLOR_LIGHTER_GREY};
  position: relative;

  display: flex;
  justify-content: flex-end;

  > input[type='text'],
  input[type='text']:focus {
    flex-grow: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
  }

  > div > i {
    display: block;
    min-width: 16px;
    text-align: center;
  }

  > div > i.icon-exchange {
    margin-left: 4px;
    margin-right: 8px;
    transform: rotate(90deg);
  }

  > div > i.icon-trash:hover {
    color: ${COLOR_WARNING};
  }
`;

export const StyledSortDropdownItem = styled.div`
  color: ${({$selected}) => ($selected ? COLOR_LIGHTER_GREY : 'inherit')};

  > i {
    margin-right: 4px;
  }
`;
