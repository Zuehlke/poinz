import styled from 'styled-components';

import {COLOR_FONT_GREY, COLOR_LIGHTER_GREY} from '../colors';
import {StyledValueBadge} from '../common/_styled';

export const StyledEstimationMatrix = styled.div`
  display: flex;
  flex-flow: column nowrap;

  position: relative;
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 8px;
  margin: 8px 16px;

  h4 {
    margin-bottom: 16px;

    > span {
      font-weight: normal;
    }
  }
`;

export const StyledEMColumnsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const dzOverlayAcceptBorder = '4px dashed rgba(0, 153, 204, 0.25)';
const dzOverlayAcceptBg = 'rgba(0, 153, 204, 0.02)';
export const StyledEMColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  margin-top: 4px;
  padding: 0 2px;
  box-sizing: border-box;
  width: ${({width}) => width}%;
  background: ${({isOver}) => (isOver ? dzOverlayAcceptBg : 'transparent')};
  border: ${({isOver}) => (isOver ? dzOverlayAcceptBorder : '4px solid transparent')};

  /** header row **/

  > div:first-of-type {
    border-bottom: 1px solid ${COLOR_LIGHTER_GREY};
    padding: 4px 0;
    margin: 0 -6px;

    ${StyledValueBadge} {
      margin-left: 0;
    }
  }

  > div {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }

  h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
  }
`;

export const StyledEMStory = styled.div`
  padding: 4px;
  margin: 2px 0;
  width: 100%;
  background: ${({color}) => color};
  opacity: ${({isDragging}) => (isDragging ? 0.2 : 1)};
  color: white;
  border-radius: 4px;
  text-align: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  min-height: 1em;
`;

export const StyledNoStoriesHint = styled.div`
  padding: 16px;
  color: ${COLOR_FONT_GREY};

  display: flex;
  justify-content: center;
  align-items: center;
`;
