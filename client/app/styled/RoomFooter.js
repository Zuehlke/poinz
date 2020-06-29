import styled from 'styled-components';

import {COLOR_FONT_GREY} from './colors';

export const StyledRoomFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  position: fixed;
  bottom: 8px;
  right: 8px;
  font-size: 9px;
  color: ${COLOR_FONT_GREY};

  > div {
    margin-right: 16px;
  }
`;
