import styled from 'styled-components';

import {
  COLOR_BACKGROUND_GREY,
  COLOR_BLUE,
  COLOR_LIGHTER_GREY,
  COLOR_ORANGE,
  COLOR_WARNING
} from '../colors';
import {StyledPasswordInput} from '../common/_styled';

export const StyledSettings = styled.div`
  background: ${COLOR_BACKGROUND_GREY};
  box-sizing: border-box;
  padding: 0 8px;
  display: ${({$shown}) => ($shown ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
  overflow-y: auto;
`;

export const StyledArea = styled.div`
  margin-bottom: 30px;

  > h4 {
    margin-bottom: 8px;
  }
`;

export const StyledTextInput = styled.div`
  display: flex;
  align-items: stretch;
  padding: 4px;

  input {
    width: 82%;
    border: none;
    border-bottom: 1px solid ${COLOR_LIGHTER_GREY};
    padding: 0.5em 0;
    margin-right: 4px;
  }

  ${StyledPasswordInput} {
    width: 100%;
  }
`;

export const StyledRadioButton = styled.div`
  label {
    display: inline-block;
    margin-right: 8px;
    cursor: pointer;
  }

  input[type='radio'] {
    margin-right: 4px;
    display: inline-block;
  }
`;

export const StyledAvatarGrid = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
`;

export const StyledMiniAvatar = styled.img`
  cursor: pointer;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  border-radius: 50%;
  border: ${({$selected}) => ($selected ? '2px solid ' + COLOR_ORANGE : '2px solid transparent')};
  padding: 2px;

  &:hover {
    box-shadow: inset 0 82px 15px -60px rgba(194, 194, 194, 0.65);
  }
`;

export const StyledExpandButton = styled.button`
  padding: 3px;
  font-size: small;
  margin: 0 4px;
`;

export const StyledItems = styled.div`
  display: table;
  border: 1px solid #ccc;

  > div button {
    display: inline-block;
    padding: 3px;
    font-size: small;
    margin: 0 2px 0 0;
  }
`;

export const StyledCCTableRow = styled.div`
  display: table-row;
`;

export const StyledCCTableCell = styled.div`
  display: table-cell;
  position: relative;
  box-sizing: border-box;
  padding: 0.2em 0.2em;
  overflow: hidden;
  list-style: none;
  min-width: 15%;

  input[type='text'],
  input[type='number'] {
    border: 1px solid transparent;
    box-shadow: none;
    outline: none;
    padding: 0;
    width: 100%;
    max-width: 120px;

    &:focus {
      border-bottom: 1px solid ${COLOR_BLUE};
    }
  }
`;

export const StyledCCTableHeader = styled.div`
  width: 100%;
  display: table-row;
  border-bottom: 1px solid #ccc;

  ${StyledCCTableCell} {
    background: #e6e6e6;
    color: rgba(0, 0, 0, 0.8);
  }
`;

export const StyledColorBadge = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({$color}) => $color};
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  font-family: monospace;
  min-height: 300px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
`;

export const StyledCadConfigEditor = styled.div`
  .pure-u-1-2 {
    width: 49%;
  }

  ${StyledItems} + .pure-g {
    margin-bottom: 8px;
  }
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
  font-size: small;
`;
