import styled from 'styled-components';
import {COLOR_BLUE} from './colors';

export const StyledFeedbackHint = styled.div`
  position: absolute;
  border: 1px solid ${COLOR_BLUE};
  background: #fff;
  font-size: 13px;
  margin-top: 28px;
  display: flex;
  bottom: 30px;
  right: 20px;
  width: 245px;
  padding: 8px 20px 8px 8px;

  img.avatar {
    width: 40px;
    height: 40px;
    border-width: 1px;
    box-sizing: border-box;
    margin: 0 8px 0 0;
  }
  > i {
    position: absolute;
    top: 4px;
    right: 4px;
  }
`;
