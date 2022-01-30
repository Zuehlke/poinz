import styled from 'styled-components';

import {COLOR_FONT_GREY, COLOR_BACKGROUND_GREY, COLOR_BLUE, COLOR_LIGHTER_GREY} from '../colors';
import {device, RIGHT_MENU_WIDTH, TOPBAR_HEIGHT} from '../dimensions';

export const StyledRoom = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

export const StyledRoomFooter = styled.div`
  margin-bottom: 8px;
  font-size: 9px;
  color: ${COLOR_FONT_GREY};
  background: ${COLOR_BACKGROUND_GREY};
  flex-shrink: 0;

  display: flex;
  justify-content: flex-end;
  align-items: baseline;

  > div {
    margin-right: 16px;
  }
`;

export const StyledBoard = styled.div`
  position: relative;
  height: calc(100% - ${TOPBAR_HEIGHT}px);
  overflow: hidden;
  background: ${COLOR_BACKGROUND_GREY};
  flex-grow: 1;
  display: flex;
`;

export const StyledBoardCenter = styled.div`
  flex-grow: 1;
  max-width: 100%;
  overflow-y: auto;
`;

export const StyledSidebarRight = styled.div`
  display: ${({shown}) => (shown ? 'block' : 'none')};
  position: relative;
  flex-shrink: 0;
  width: 100%;

  @media ${device.desktop} {
    width: ${RIGHT_MENU_WIDTH}px;
  }

  h4 {
    margin-bottom: 8px;
  }

  &:after {
    content: '';

    @media ${device.desktop} {
      border-right: 1px solid ${COLOR_LIGHTER_GREY};
    }
    top: 8px;
    left: 0;
    position: absolute;
    bottom: 8px;
  }
`;

export const StyledFeedbackHint = styled.div`
  position: absolute;
  border: 1px solid ${COLOR_BLUE};
  background: #fff;
  font-size: 13px;
  margin-top: 28px;
  display: flex;
  bottom: 30px;
  right: 20px;
  width: 245px;
  padding: 8px 20px 8px 8px;

  img.avatar {
    width: 40px;
    height: 40px;
    border-width: 1px;
    box-sizing: border-box;
    margin: 0 8px 0 0;
  }

  > i {
    position: absolute;
    top: 4px;
    right: 4px;
  }
`;

export const StyledMatrixToggle = styled.div`
  padding: 0 16px;
  display: none;
  justify-content: flex-end;

  @media ${device.desktop} {
    display: flex;
  }
`;
