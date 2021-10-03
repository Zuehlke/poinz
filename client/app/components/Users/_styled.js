import styled from 'styled-components';

import {device, ZuehlkeFont} from '../dimensions';
import {COLOR_LIGHT_GREY, COLOR_LIGHTER_GREY, COLOR_ORANGE, COLOR_WARNING} from '../colors';

export const StyledUsers = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  padding: 16px;

  @media ${device.modernMobile} {
    display: block;
  }
`;

export const StyledUser = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin-top: 4px;

  position: relative;
  color: ${({isOwn, shaded}) => (shaded ? COLOR_LIGHT_GREY : isOwn ? COLOR_ORANGE : 'inherit')};
  cursor: pointer;

  @media ${device.modernMobile} {
    display: inline-block;
    padding: 0 8px;
    margin-top: 0;
  }
`;

export const StyledUserName = styled.div`
  text-align: center;
  margin: 0 0 0 4px;
  max-width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media ${device.modernMobile} {
    margin: 4px 0;
  }
`;

export const StyledUserBadge = styled.span`
  position: absolute;
  top: 2px;
  left: 44px;

  > i {
    display: inline-block;
    margin-right: 2px;
  }

  @media ${device.modernMobile} {
    top: 0;
    right: 0;
    left: auto;
  }
`;

export const StyledUserEstimation = styled.div`
  box-sizing: border-box;
  font-size: 18px;
  border: ${({revealed}) =>
    revealed ? '2px solid  ' + COLOR_LIGHTER_GREY : '2px dashed ' + COLOR_LIGHTER_GREY};
  background: transparent;
  color: ${COLOR_LIGHT_GREY};
  font-family: ${ZuehlkeFont};
  padding: 0;

  height: 50px;
  width: 34px;
  margin: 0;
  border-radius: 6px;

  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    display: block;
  }

  @media ${device.modernMobile} {
    font-size: 28px;
    height: 100px;
    width: 76px;
    margin: 0 auto;
    border-radius: 12px;
    border-width: 4px;
  }
`;

export const StyledUserEstimationGiven = styled(StyledUserEstimation)`
  position: relative;
  border: 2px solid white;
  color: ${({revealed}) => (revealed ? 'white' : COLOR_LIGHTER_GREY)};
  background: ${({revealed, valueColor}) => (revealed ? valueColor : COLOR_LIGHT_GREY)};

  @media ${device.modernMobile} {
    border: 4px solid white;
  }

  > i {
    font-size: small;
    position: absolute;
    top: 4px;
    right: 4px;
  }

  > i:last-child {
    bottom: 4px;
    left: 4px;
    top: auto;
    right: auto;
  }
`;

export const StyledUserEstimationExcluded = styled(StyledUserEstimation)`
  border: 4px solid transparent;
  background: transparent;
  color: transparent;
  visibility: hidden;
`;

export const StyledEyeIcon = styled.i`
  color: ${({active}) => (active ? COLOR_ORANGE : COLOR_LIGHT_GREY)};
`;

export const StyledUserQuickMenu = styled.span`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;

  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    display: inline-block;
    font-size: 16px;
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
  }

  i:hover {
    opacity: 1;
  }

  i:hover.icon-logout {
    color: ${COLOR_WARNING};
  }

  @media ${device.modernMobile} {
    width: 72px;
    height: 72px;
    left: 50%;
    margin-left: -36px;
    justify-content: space-around;
    background: transparent;
  }
`;
