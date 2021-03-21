import styled from 'styled-components';

import {device} from '../dimensions';
import {COLOR_BACKGROUND_GREY, COLOR_ORANGE} from '../colors';

export const StyledHelp = styled.div`
  display: ${({shown}) => (shown ? 'block' : 'none')};
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding: 0 8px;
  background: ${COLOR_BACKGROUND_GREY};

  @media ${device.desktop} {
  }

  h5 {
    color: ${COLOR_ORANGE};
    font-weight: 700;
    margin-bottom: 8px;
  }
`;

export const StyledHelpInner = styled.div`
  overflow-x: hidden;
  overflow-y: auto;

  > p {
    margin-top: 0;
  }
`;
