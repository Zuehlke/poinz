import styled from 'styled-components';

import {COLOR_LIGHT_GREY, COLOR_ORANGE} from './colors';

export const StyledAvatar = styled.img`
  border: ${({isOwn}) => (isOwn ? '2px solid ' + COLOR_ORANGE : '2px solid ' + COLOR_LIGHT_GREY)};
  border-radius: 50%;
  background: #fff;
  width: 60px;
  height: 60px;
  padding: 4px;
  display: block;
  margin: 0 auto;
  filter: ${({shaded}) => (shaded ? 'grayscale(100%)' : 'none')};
`;
