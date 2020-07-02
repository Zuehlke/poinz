import styled from 'styled-components';

import {RIGHT_MENU_WIDTH} from './dimensions';
import {COLOR_BACKGROUND_GREY, COLOR_LIGHT_GREY, COLOR_LIGHTER_GREY, COLOR_ORANGE} from './colors';

export const StyledActionLog = styled.div`
  z-index: 10;
  position: fixed;
  width: ${RIGHT_MENU_WIDTH}px;
  top: 0;
  bottom: 0;
  right: ${(props) => (props.shown ? '0' : RIGHT_MENU_WIDTH * -1 + 'px')};
  transition: all 0.2s ease-out;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 27px 8px 8px;
  background: ${COLOR_BACKGROUND_GREY};

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

export const StyledActionLogInner = styled.div`
  top: 73px;
  bottom: 16px;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  left: 8px;
  right: 8px;
`;

export const StyledActionLogList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    background: #fff;
    padding: 4px;
    margin-bottom: 8px;
    box-sizing: border-box;
    border: 1px solid ${COLOR_LIGHTER_GREY};

    > span {
      display: block;
    }

    > span:first-child {
      color: ${COLOR_LIGHT_GREY};
      font-size: 12px;
    }

    &:first-child {
      border-left: 2px solid ${COLOR_ORANGE};
    }
  }
`;
