import styled from 'styled-components';

export const StyledAppStatus = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledAppStatusMain = styled.div`
  padding: 12px 48px;
`;

export const StyledRoomsList = styled.ul`
  display: table;
  margin: 0;
  padding: 0;

  .headers {
    font-weight: 700;
  }

  li {
    display: table-row;

    > div {
      display: table-cell;
      padding: 0 4px;
    }
  }
`;
