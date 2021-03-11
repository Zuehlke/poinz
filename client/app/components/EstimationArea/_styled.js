import styled, {keyframes} from 'styled-components';

import {COLOR_ORANGE} from '../colors';
import {device, ZuehlkeFont} from '../dimensions';

export const StyledEstimation = styled.div`
  padding: 16px 8px;

  @media ${device.modernMobile} {
    padding: 16px;
  }
`;

export const EstimationAreaButtons = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
`;

const FlashAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const StyledStoryText = styled.div`
  margin-top: 4px;
  white-space: pre-wrap;
  display: inline-block;
`;

export const StyledApplauseHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: ${({color}) => '1px solid ' + color};
  box-shadow: ${({color}) => '0 0 10px ' + color};
  animation-name: ${FlashAnimation};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: 3;
`;

export const StyledSelectedStory = styled.div`
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 8px;
  position: relative;
`;

export const StyledCards = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StyledCard = styled.button`
  &,
  &:focus {
    cursor: pointer;
    min-width: 28vw;
    display: block;
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
    height: 100px;
    box-sizing: border-box;
    font-size: 28px;
    padding: 8px;
    font-family: ${ZuehlkeFont};
  }

  @media ${device.desktop} {
    &,
    &:focus {
      min-width: 100px;
    }
  }
`;

export const StyledCardInner = styled.div`
  position: relative;
  background: ${({cardColor}) => (cardColor ? cardColor : 'white')};
  color: ${({cardColor}) => (cardColor ? 'white' : 'inherit')};
  padding: 28px 0;
  box-sizing: border-box;
  border-radius: 12px;
  border: ${({selected}) => (selected ? '2px solid ' + COLOR_ORANGE : '2px solid white')};

  &:hover {
    box-shadow: inset 0 -113px 113px -44px rgba(19, 18, 18, 0.39);
  }

  @media ${device.modernMobile} {
    border-width: 4px;
  }
`;

export const StyledEstmSummCard = styled(StyledCard)`
  &,
  &:focus {
    cursor: default;
  }
`;

export const StyledEstmSummCardInner = styled(StyledCardInner)`
  opacity: ${({wasEstimated}) => (wasEstimated ? 1 : 0.3)};

  border: ${({wasEstimated}) => (wasEstimated ? '2px solid ' + COLOR_ORANGE : '2px solid white')};

  > span {
    display: block;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 40%;
    height: 32%;
    background: #ff820a;
    border-radius: 0 9px 0 100%;
    font-size: 67%;
    padding: 2px 0 0 7px;
    box-sizing: border-box;
  }

  &:hover {
    box-shadow: none;
  }
`;

export const StyledEstimationSummary = styled.div`
  margin-top: 24px;
  padding: 8px;

  h4 {
    margin-bottom: 2px;
  }
`;
export const StyledEstimationSummaryList = styled.div`
  > span {
    display: block;
    margin-top: 8px;
    padding: 4px 0;
    width: 50%;
  }
`;
