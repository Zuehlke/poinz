import styled from 'styled-components';

import {COLOR_LIGHTER_GREY} from './colors';
import {ZuehlkeFont} from './dimensions';

export const StyledConsensusBadge = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: 8px;
  background: ${({cardColor}) => (cardColor ? cardColor : COLOR_LIGHTER_GREY)};
  justify-content: center;
  align-items: center;

  > div {
    font-size: 12px;
    color: white;
    font-family: ${ZuehlkeFont};
  }
`;
