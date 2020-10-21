import styled from 'styled-components';

import {device} from './dimensions';

export const StyledUsers = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;

  padding: 48px 16px 16px;

  @media ${device.modernMobile} {
    display: block;
  }
`;
