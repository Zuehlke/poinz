import styled from 'styled-components';
import {COLOR_BACKGROUND_GREY, COLOR_BLUE, COLOR_PURPLE} from './colors';
import {LEFT_MENU_WIDTH, MEDIA_MIN_WIDTH_THRESH, ZuehlkeFont} from './dimensions';

export const StyledTopBar = styled.div`
  z-index: 1003;
  display: flex;
  justify-content: space-between;
  position: fixed;
  box-shadow: 0 1px 2px 0 #cccccc;
  background: ${COLOR_BACKGROUND_GREY};
  top: 0;
  left: 0;
  right: 0;
  height: 34px;
  padding: 0;
  box-sizing: border-box;
`;

export const StyledTopLeft = styled.div`
  display: flex;
`;

export const StyledPoinzLogo = styled.div`
  font-family: ${ZuehlkeFont};
  font-size: 29px;
  padding-left: 8px;
  color: ${COLOR_PURPLE};
`;

export const StyledTopRight = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledWhoAmI = styled.div`
  padding: 0 8px;
  display: block;
`;
export const StyledWhoAmISimple = styled.span`
  max-width: 10vh;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  white-space: nowrap;

  ${StyledWhoAmI}:hover & {
    display: none;
  }
`;
export const StyledWhoAmIExtended = styled.span`
  display: none;

  ${StyledWhoAmI}:hover & {
    display: inline-block;
  }
`;

// three buttons on the top right (user menu, action log, leave room)
export const StyledQuickMenuButton = styled.a`
  display: block;
  width: 34px;
  height: 34px;
  font-size: 22px;
  padding: 4px 8px;
  box-sizing: border-box;
  color: white;
  border-radius: 0;
  background: ${COLOR_BLUE};
`;

// hamburger icon to toggle backlog on small screens
export const StyledBacklogToggle = styled.a`
  display: block;
  font-size: 10px;
  z-index: 10;
  width: 34px;
  height: 34px;
  background: ${COLOR_BLUE};

  @media (min-width: ${MEDIA_MIN_WIDTH_THRESH}) {
    position: fixed;
    left: ${LEFT_MENU_WIDTH};
    display: none;
  }
`;

export const StyledBacklogToggleIcon = styled.span`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  padding: 8px;
  height: 100%;
  width: 100%;

  span,
  span:before,
  span:after {
    background-color: #fff;
    width: 17px;
    height: 0.2em;
    display: inline-block;
  }

  span:before,
  span:after {
    position: absolute;
    margin-top: -0.6em;
    content: ' ';
  }

  span:after {
    margin-top: 0.6em;
  }
`;
