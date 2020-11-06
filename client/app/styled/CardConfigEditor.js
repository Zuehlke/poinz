import styled from 'styled-components';
import {COLOR_BLUE, COLOR_WARNING} from './colors';

export const StyledCardConfigEditor = styled.div``;

export const StyledItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  margin-bottom: 8px;
  width: 250px;

  > div button {
    display: inline-block;
    padding: 3px;
    font-size: small;
    margin: 0 2px 0 0;
  }
`;

export const StyledCCTableCell = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  padding: 0.2em 0.2em;
  overflow: hidden;
  list-style: none;
  width: 25%;

  input[type='text'],
  input[type='number'] {
    border: 1px solid transparent;
    box-shadow: none;
    outline: none;
    padding: 0;
    max-width: 70px;

    &:focus {
      border-bottom: 1px solid ${COLOR_BLUE};
    }
  }
`;

export const StyledColorBadge = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({color}) => color};
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  font-family: monospace;
  min-height: 300px;
`;

export const ErrorMsg = styled.p`
  color: ${COLOR_WARNING};
  margin-bottom: 2px;
  font-size: small;
`;

export const AddItemButton = styled.button`
  width: 100%;
  margin: 0;
  padding: 3px;
  display: inline-block;
  font-size: small;
`;
