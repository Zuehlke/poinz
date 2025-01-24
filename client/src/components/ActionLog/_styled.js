import styled from 'styled-components';

import {
  COLOR_BACKGROUND_GREY,
  COLOR_LIGHT_GREY,
  COLOR_LIGHTER_GREY,
  COLOR_ORANGE,
  COLOR_WARNING
} from '../colors';

export const StyledActionLog = styled.div`
  display: ${({$shown}) => ($shown ? 'block' : 'none')};
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 0 8px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  background: ${COLOR_BACKGROUND_GREY};

  h5 {
    color: ${COLOR_ORANGE};
    font-weight: 700;
    margin-bottom: 8px;
  }
`;

export const StyledActionLogInner = styled.div``;

export const StyledActionLogList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const StyledActionLogListItem = styled.li`
  background: #fff;
  padding: 4px;
  margin-bottom: 8px;
  box-sizing: border-box;
  border: 1px solid ${COLOR_LIGHTER_GREY};
  border-left: ${({$isError}) =>
    $isError ? '2px solid ' + COLOR_WARNING : '1px solid ' + COLOR_LIGHTER_GREY};

  > span {
    display: block;
  }

  > span:first-child {
    color: ${COLOR_LIGHT_GREY};
    font-size: 12px;
  }
`;
