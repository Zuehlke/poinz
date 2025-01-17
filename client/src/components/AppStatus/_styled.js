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
  margin: 4px 0;
  padding: 0;

  .headers {
    font-weight: 700;

    > div {
      border-bottom: 1px solid #ccc;
    }
  }

  li {
    display: table-row;

    > div {
      display: table-cell;
      padding: 2px 4px;
    }
  }
`;

export const StyledRoomsListPagination = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  > button {
    font-size: 60%;
  }

  > div {
    margin: 0 12px;
  }
`;
