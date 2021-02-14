import styled from 'styled-components';

import {COLOR_LIGHT_GREY, COLOR_LIGHTER_GREY, COLOR_ORANGE} from '../colors';
import {device, ZuehlkeFont} from '../dimensions';

export const StyledAvatar = styled.img`
  border: ${({isOwn}) => (isOwn ? '2px solid ' + COLOR_ORANGE : '2px solid ' + COLOR_LIGHT_GREY)};
  border-radius: 50%;
  background: #fff;
  display: block;
  filter: ${({shaded}) => (shaded ? 'grayscale(100%)' : 'none')};
  opacity: ${({shaded}) => (shaded ? '0.6' : '1')};

  margin: 0;
  width: 32px;
  height: 32px;
  padding: 4px;

  @media ${device.modernMobile} {
    width: 60px;
    height: 60px;
    padding: 4px;
    margin: 0 auto;
  }
`;

export const StyledValueBadge = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: 8px;
  flex-shrink: 0;
  background: ${({cardColor}) => (cardColor ? cardColor : COLOR_LIGHTER_GREY)};
  justify-content: center;
  align-items: center;

  > div {
    font-size: 12px;
    color: white;
    font-family: ${ZuehlkeFont};
  }
`;

export const StyledUndecidedBadge = styled(StyledValueBadge)`
  background: none;
  width: 16px;
  height: 16px;
  border: 4px solid #ccc;
`;

export const StyledPasswordFieldWrapper = styled.div`
  position: relative;
  width: 100%;

  .clickable {
    display: block;
    position: absolute;
    right: 4px;
    top: 10px;
  }
`;

export const StyledPasswordInput = styled.input`
  height: 100%;
`;
