import styled from 'styled-components';

import {COLOR_BACKGROUND_GREY} from '../colors';

export const StyledHelp = styled.div`
  display: ${({$shown}) => ($shown ? 'block' : 'none')};
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 0 8px;
  background: ${COLOR_BACKGROUND_GREY};
  height: 100%;
  overflow-y: auto;
`;

export const StyledHelpInner = styled.div`
  overflow-x: hidden;
  overflow-y: auto;

  > p {
    margin-top: 0;
  }
`;
