import styled from 'styled-components';

import {device, RIGHT_MENU_WIDTH} from '../dimensions';
import {COLOR_BACKGROUND_GREY, COLOR_ORANGE} from '../colors';

export const StyledHelp = styled.div`
  z-index: 10;
  position: fixed;
  width: ${(props) => (props.shown ? '100%' : RIGHT_MENU_WIDTH + 'px')};
  top: 0;
  bottom: 0;
  right: ${(props) => (props.shown ? '0' : RIGHT_MENU_WIDTH * -1 + 'px')};
  transition: all 0.2s ease-out;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 27px 8px 8px;
  background: ${COLOR_BACKGROUND_GREY};

  @media ${device.desktop} {
    width: ${RIGHT_MENU_WIDTH}px;
  }

  &:after {
    content: '';
    border-right: 1px solid #e8e8e8;
    top: 44px;
    left: 0;
    position: absolute;
    bottom: 20px;
  }

  h5 {
    color: ${COLOR_ORANGE};
    font-weight: 700;
    margin-bottom: 8px;
  }
`;

export const StyledHelpInner = styled.div`
  top: 73px;
  bottom: 16px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  left: 8px;
  right: 8px;
`;
