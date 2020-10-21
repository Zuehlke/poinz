import styled from 'styled-components';

import {COLOR_LIGHT_GREY, COLOR_ORANGE} from './colors';
import {device} from './dimensions';

export const StyledAvatar = styled.img`
  border: ${({isOwn}) => (isOwn ? '2px solid ' + COLOR_ORANGE : '2px solid ' + COLOR_LIGHT_GREY)};
  border-radius: 50%;
  background: #fff;
  display: block;
  filter: ${({shaded}) => (shaded ? 'grayscale(100%)' : 'none')};
  opacity: ${({shaded}) => (shaded ? '0.6' : '1')};

  margin: 0;
  width: 32px;
  height: 32px;
  padding: 4px;

  @media ${device.modernMobile} {
    width: 60px;
    height: 60px;
    padding: 4px;
    margin: 0 auto;
  }
`;
