import styled from 'styled-components';

import {
  COLOR_BACKGROUND_GREY,
  COLOR_FONT_GREY,
  COLOR_LIGHTER_GREY,
  COLOR_ORANGE,
  COLOR_WARNING
} from '../colors';
import {LEFT_MENU_WIDTH, device} from '../dimensions';

export const StyledBacklog = styled.div`
  transition: all 0.2s ease-out;
  margin-left: ${LEFT_MENU_WIDTH * -1}px;
  width: ${(props) => (props.shown ? '100%' : LEFT_MENU_WIDTH + 'px')};
  position: fixed;
  top: 0;
  left: ${({shown}) => (shown ? LEFT_MENU_WIDTH + 'px' : '0')};
  bottom: 0;
  z-index: 1000;
  box-sizing: border-box;
  padding-top: 44px;
  background: ${COLOR_BACKGROUND_GREY};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  @media ${device.desktop} {
    left: ${LEFT_MENU_WIDTH}px;
    width: ${LEFT_MENU_WIDTH}px;
  }

  &:after {
    content: '';
    @media ${device.desktop} {
      border-right: 1px solid ${COLOR_LIGHTER_GREY};
    }
    top: 44px;
    right: 0;
    position: absolute;
    bottom: 20px;
  }
`;

export const StyledStories = styled.div`
  margin: 16px 8px 0 8px;
`;

export const StyledStoriesScrolling = styled(StyledStories)`
  overflow-y: auto;
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
    min-height: 64px;
  }
`;

export const StyledEditFormButtonGroup = styled.div`
  > div {
    padding: 0 4px;
    box-sizing: border-box;
  }
`;

export const StyledAddForm = styled(StyledEditForm)`
  padding: 8px 16px 16px 16px;
  margin: 3px 8px 16px 8px;
  border: 1px solid ${COLOR_LIGHTER_GREY};
`;

export const StyledBacklogInfoText = styled.div`
  margin-top: 16px;
  text-align: center;
`;

export const StyledFileImportDropZone = styled.div`
  outline: none;
  border: none;
  overflow: auto;
  flex-grow: 1;
`;

const dzOverlayAcceptBorder = '4px dashed rgba(0, 153, 204, 0.25)';
const dzOverlayAcceptBg = 'rgba(0, 153, 204, 0.02)';
const dzOverlayRejectBorder = '4px dashed rgba(255, 130, 10, 0.3)';
const dzOverlayRejectBg = 'rgba(255, 130, 10, 0.06)';

export const StyledFileImportDropZoneOverlay = styled.div`
  display: ${({active}) => (active ? 'block' : 'none')};
  position: absolute;
  left: 0;
  right: 0;
  top: 33px;
  height: calc(100% - 51px);
  margin: 4px;
  font-size: 62px;
  color: rgba(0, 153, 204, 0.25);
  z-index: ${({active}) => (active ? 1000 : 0)};

  border: ${({active, isAccept, isReject}) =>
    active && isAccept
      ? dzOverlayAcceptBorder
      : active && isReject
      ? dzOverlayRejectBorder
      : 'none'};
  background: ${({active, isAccept, isReject}) =>
    active && isAccept
      ? dzOverlayAcceptBg
      : active && isReject
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
  border-left: ${({selected}) =>
    selected ? '2px solid ' + COLOR_ORANGE : '1px solid ' + COLOR_LIGHTER_GREY};

  &:hover {
    box-shadow: ${({noShadow}) =>
      noShadow ? 'none' : 'inset 0 82px 50px -60px rgba(194, 194, 194, 0.45)'};
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

export const StyledStoryText = styled.div`
  overflow-x: hidden;
`;

export const StyledHighlightButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

export const StyledBacklogSortForm = styled.div`
  margin: 0 8px 0 8px;
  padding: 8px 8px 8px 8px;
  border-bottom: 1px solid ${COLOR_LIGHTER_GREY};
  position: relative;

  display: flex;
  justify-content: flex-end;

  > i {
    margin-left: 4px;
    transform: rotate(90deg);
  }
`;

export const StyledSortDropdown = styled.div`
  position: absolute;
  z-index: 1002;
  background: white;
  border: 1px solid ${COLOR_FONT_GREY};
  padding: 8px 0;
  width: 100%;
  right: 0;
  top: 100%;

  > div.clickable {
    padding: 4px 8px;
    margin-top: 4px;
    &:hover {
      background-color: ${COLOR_LIGHTER_GREY};
    }
  }

  @media ${device.desktop} {
    right: 8px;
    min-width: 132px;
    width: auto;
  }
`;

export const StyledSortDropdownItem = styled.div`
  color: ${({selected}) => (selected ? COLOR_LIGHTER_GREY : 'inherit')};
`;
