import styled, {keyframes} from 'styled-components';

import {COLOR_BACKGROUND_GREY, COLOR_ORANGE} from './colors';
import {LEFT_MENU_WIDTH, MEDIA_MIN_WIDTH_THRESH} from './dimensions';
import {ZuehlkeFont} from './dimensions';

export const StyledBoard = styled.div`
  transition: all 0.2s ease-out;
  position: relative;
  height: auto;
  background: ${COLOR_BACKGROUND_GREY};
  flex-grow: 1;

  @media (min-width: ${MEDIA_MIN_WIDTH_THRESH}) {
    padding-left: ${LEFT_MENU_WIDTH}px;
    left: 0;
  }
`;

export const StyledEstimation = styled.div`
  padding: 16px;
`;

export const BoardActionButtons = styled.div`
  margin-top: 16px;
`;

export const StyledSelectedStory = styled.div`
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 8px;
  position: relative;
`;

export const StyledStoryText = styled.div`
  margin-top: 4px;
  white-space: pre-wrap;
  display: inline-block;
`;

const FlashAnimation = keyframes`
  0% {
    opacity :1;
  }
  50% {
    opacity :0;
  }
  100% {
    opacity :1;
  }
`;

export const StyledApplauseHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #e8e8e8;
  animation-name: ${FlashAnimation};
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: 3;
`;

export const StyledCards = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const StyledCard = styled.button`
  &,
  &:focus {
    cursor: pointer;
    min-width: 30vw;
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

  @media (min-width: ${MEDIA_MIN_WIDTH_THRESH}) {
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
  border: ${({selected}) => (selected ? '4px solid ' + COLOR_ORANGE : '4px solid white')};

  &:hover {
    box-shadow: inset 0 -113px 113px -44px rgba(19, 18, 18, 0.39);
  }
`;
