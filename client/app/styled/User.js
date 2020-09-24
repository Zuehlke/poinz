import styled from 'styled-components';

import {
  COLOR_FONT_GREY,
  COLOR_LIGHT_GREY,
  COLOR_LIGHTER_GREY,
  COLOR_ORANGE,
  COLOR_WARNING
} from './colors';
import {ZuehlkeFont} from './dimensions';

export const StyledUser = styled.div`
  padding: 0 8px;
  display: inline-block;
  position: relative;

  color: ${({isOwn, shaded}) => (shaded ? COLOR_LIGHT_GREY : isOwn ? COLOR_ORANGE : 'inherit')};
  cursor: ${({isOwn}) => (isOwn ? 'inherit' : 'pointer')};
`;

export const StyledUserName = styled.div`
  text-align: center;
  margin: 4px 0;
  max-width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const StyledUserBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
`;

export const StyledUserEstimation = styled.div`
  transition: all 0.2s ease-out;
  height: 100px;
  width: 76px;
  margin: 0 auto;
  text-align: center;
  padding: 28px 0;
  border-radius: 12px;
  box-sizing: border-box;
  font-size: 28px;
  border: ${({revealed}) =>
    revealed ? '4px solid  ' + COLOR_LIGHTER_GREY : '4px dashed ' + COLOR_LIGHTER_GREY};
  background: transparent;
  color: ${COLOR_LIGHT_GREY};
  font-family: ${ZuehlkeFont};
`;

export const StyledUserEstimationGiven = styled(StyledUserEstimation)`
  border: 4px solid white;
  color: ${({revealed}) => (revealed ? 'white' : COLOR_LIGHTER_GREY)};
  background: ${({revealed, valueColor}) => (revealed ? valueColor : COLOR_LIGHT_GREY)};
`;

export const StyledUserEstimationExcluded = styled(StyledUserEstimation)`
  border: 4px solid transparent;
  background: transparent;
  color: transparent;
  visibility: hidden;
`;

export const StyledUserKickOverlay = styled.span`
  position: absolute;
  top: 0;
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 50%;
  margin-left: -36px;

  i {
    display: inline-block;
    font-size: 22px;
    cursor: pointer;
    padding: 6px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    vertical-align: middle;
    background: #fff;
    border-radius: 50%;
    opacity: 0.9;
    color: ${COLOR_LIGHT_GREY};
  }

  i:hover {
    opacity: 1;
  }
  i:hover.fa-sign-out {
    color: ${COLOR_WARNING};
  }
  i:hover.fa-cross {
    color: ${COLOR_FONT_GREY};
  }
`;
