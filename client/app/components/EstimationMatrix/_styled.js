import styled from 'styled-components';

import {COLOR_LIGHTER_GREY} from '../colors';

export const StyledEstimationMatrix = styled.div`
  display: flex;
  flex-flow: column nowrap;

  position: relative;
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 8px;
  margin: 16px;

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

  > div:first-child {
    padding: 8px 4px;
    width: 19%;
    border-right: 1px solid ${COLOR_LIGHTER_GREY};

    h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
    }
  }

  &:hover {
    box-shadow: inset 0 82px 50px -60px rgb(194 194 194 / 45%);
  }
`;

export const StyledEMRowDate = styled.div`
  font-size: 12px;
`;

export const StyledEstimationMatrixCell = styled.div`
  padding: 4px 0;
  width: ${({width}) => width}%;

  display: flex;
  justify-content: center;
`;
