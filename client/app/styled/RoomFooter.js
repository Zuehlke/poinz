import styled from 'styled-components';

import {COLOR_BACKGROUND_GREY, COLOR_FONT_GREY} from './colors';

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
