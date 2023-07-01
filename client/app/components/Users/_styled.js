import styled from 'styled-components';

import {device, ZuehlkeFont} from '../dimensions';
import {COLOR_LIGHT_GREY, COLOR_LIGHTER_GREY, COLOR_ORANGE, COLOR_WARNING} from '../colors';

export const StyledUsers = styled.div`
  padding: 12px 16px 16px 12px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: stretch;

  @media ${device.desktop} {
    padding: 8px 16px 16px 12px;
  }
`;

export const StyledUser = styled.div`
  margin-top: 0;
  margin-bottom: 4px;

  position: relative;
  color: ${({$isOwn, $shaded}) => ($shaded ? COLOR_LIGHT_GREY : $isOwn ? COLOR_ORANGE : 'inherit')};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
`;

export const StyledUserName = styled.div`
  text-align: center;
  max-width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 4px 0;
`;

export const StyledUserBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  left: auto;

  > i {
    display: inline-block;
    margin-right: 2px;
  }
`;

export const StyledUserEstimation = styled.div`
  box-sizing: border-box;
  border: ${({$revealed}) =>
    $revealed ? '2px solid  ' + COLOR_LIGHTER_GREY : '2px dashed ' + COLOR_LIGHTER_GREY};
  background: transparent;
  color: ${COLOR_LIGHT_GREY};
  font-family: ${ZuehlkeFont};
  padding: 0;

  font-size: 20px;
  height: 60px;
  width: 45px;
  margin: 0 auto;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  > span {
    display: block;
  }

  @media ${device.desktop} {
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
  border: 4px solid white;
  color: ${({$revealed}) => ($revealed ? 'white' : COLOR_LIGHTER_GREY)};
  background: ${({$revealed, $valueColor}) => ($revealed ? $valueColor : COLOR_LIGHT_GREY)};

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
  color: ${({$active}) => ($active ? COLOR_ORANGE : COLOR_LIGHT_GREY)};
`;

export const StyledUserQuickMenu = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  width: 72px;
  height: 72px;
  margin-left: -36px;

  display: flex;
  align-items: center;
  justify-content: space-around;
  background: transparent;
  border-radius: 2px;

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
`;
