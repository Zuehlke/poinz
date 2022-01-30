import styled from 'styled-components';

import {COLOR_FONT_GREY, COLOR_LIGHTER_GREY} from '../colors';

export const StyledEstimationMatrix = styled.div`
  display: flex;
  flex-flow: column nowrap;

  position: relative;
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 8px;
  margin: 16px;

  h4 {
    margin-bottom: 16px;

    > span {
      font-weight: normal;
    }
  }

  /* the header row*/

  > div:first-of-type {
    border-bottom: 1px solid ${COLOR_LIGHTER_GREY};

    &:hover {
      box-shadow: none;
    }
  }
`;

export const StyledEMRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 4px;

  h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
  }
`;

export const StyledEstimationMatrixCell = styled.div`
  padding: 4px;
  width: ${({width}) => width}%;
  background: ${({color}) => color};
  color: white;
  border-radius: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

export const StyledNoStoriesHint = styled.span`
  color: ${COLOR_FONT_GREY};
`;
