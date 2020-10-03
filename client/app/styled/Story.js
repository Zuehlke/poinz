import styled from 'styled-components';

import {COLOR_LIGHTER_GREY, COLOR_ORANGE, COLOR_WARNING} from './colors';

export const StyledStory = styled.div`
  position: relative;
  background: white;
  padding: 8px 16px 16px 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
  border: 1px solid ${COLOR_LIGHTER_GREY};
  cursor: pointer;
  border-left: ${({selected}) =>
    selected ? '2px solid ' + COLOR_ORANGE : '1px solid ' + COLOR_LIGHTER_GREY};

  &:hover {
    box-shadow: ${({noShadow}) =>
      noShadow ? 'none' : 'inset 0 82px 50px -60px rgba(194, 194, 194, 0.45)'};
  }
`;

export const StyledStoryToolbar = styled.div`
  display: flex;
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 18px;

  > i {
    margin: 0 4px;
    opacity: 0;
    display: block;
    padding: 6px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
  }

  /* My parent "StoryWrapper" gets hovered. my child "i" gets additional styles ... neat! */
  ${StyledStory}:hover & i {
    opacity: 0.6;
    background: white;
    border-radius: 50%;

    &:hover {
      opacity: 1;

      &.story-delete {
        color: ${COLOR_WARNING};
      }
    }
  }
`;

export const StyledStoryTitle = styled.h4`
  margin-top: 8px;
  margin-bottom: 0;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  overflow-x: hidden;
`;

export const StyledStoryText = styled.div`
  overflow-x: hidden;
`;
