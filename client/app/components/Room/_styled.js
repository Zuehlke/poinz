import styled from 'styled-components';

import {COLOR_FONT_GREY, COLOR_BACKGROUND_GREY, COLOR_BLUE} from '../colors';
import {device, LEFT_MENU_WIDTH} from '../dimensions';

export const StyledRoom = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledRoomFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  margin-bottom: 8px;
  font-size: 9px;
  color: ${COLOR_FONT_GREY};
  background: ${COLOR_BACKGROUND_GREY};

  > div {
    margin-right: 16px;
  }
`;

export const StyledBoard = styled.div`
  transition: all 0.2s ease-out;
  position: relative;
  height: auto;
  background: ${COLOR_BACKGROUND_GREY};
  flex-grow: 1;

  @media ${device.desktop} {
    padding-left: ${LEFT_MENU_WIDTH}px;
    left: 0;
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
