import styled from 'styled-components';

import {COLOR_BACKGROUND_GREY, COLOR_LIGHTER_GREY} from './colors';
import {LEFT_MENU_WIDTH, device} from './dimensions';

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
