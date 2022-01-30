import styled, {keyframes} from 'styled-components';
import {COLOR_BACKGROUND_GREY, COLOR_BLUE, COLOR_PURPLE, COLOR_WARNING} from '../colors';
import {LEFT_MENU_WIDTH, device, TOPBAR_HEIGHT, ZuehlkeFont} from '../dimensions';
import {StyledAvatar, StyledDropdown} from '../common/_styled';

export const StyledTopBar = styled.div`
  position: relative;
  flex-grow: 0;
  height: ${TOPBAR_HEIGHT}px;
  padding: 0 0 4px 0;
  box-sizing: border-box;
`;

export const StyledTopBarInner = styled.div`
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 2px 0 #cccccc;
  background: ${COLOR_BACKGROUND_GREY};
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > span {
    max-width: 10vh;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 4px;
  }

  ${StyledAvatar} {
    width: 27px;
    height: 27px;
    padding: 1px;
    border: 3px solid white;
    cursor: pointer;

    &:hover {
      box-shadow: inset 0 82px 15px -60px rgb(194 194 194 / 65%);
    }
  }

  ${StyledDropdown} {
    padding: 8px;

    > div {
      margin: 4px 0;
      display: flex;
      flex-direction: row;
      align-items: baseline;

      > i {
        display: inline-block;
        margin-right: 8px;
      }

      > input {
        flex-grow: 1;
        padding: 2px;
      }
    }

    @media ${device.desktop} {
      right: ${4 * 36}px;
      min-width: 280px;
    }
  }
`;

// four buttons on the top right (settings, action log, help, leave room)
export const StyledQuickMenuButton = styled.a`
  display: block;
  width: ${TOPBAR_HEIGHT - 2}px;
  height: ${TOPBAR_HEIGHT - 2}px;
  font-size: 22px;
  padding: 4px 8px;
  box-sizing: border-box;
  color: ${({warning}) => (warning ? COLOR_WARNING : 'white')};
  border-radius: 0;
  background: ${COLOR_BLUE};
  position: relative;

  &:hover {
    background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.1));
  }

  /* Hide "Estimation Matrix" toggle button on non-desktop */

  &.matrix-toggle {
    display: none;
  }

  @media ${device.desktop} {
    &.matrix-toggle {
      display: block;
    }
  }
`;

const shaky = keyframes`
  10%, 90% {
    transform: rotate(-10deg);
  }

  20%, 80% {
    transform: rotate(10deg);
  }

  30%, 50%, 70% {
    transform: rotate(-20deg);
  }

  40%, 60% {
    transform: rotate(20deg);
  }
`;

export const StyledIconExclamation = styled.i`
  position: absolute;
  right: 4px;
  color: ${COLOR_WARNING};
  animation: ${shaky} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both 4;
  transform: rotate(0);
`;

// hamburger icon to toggle backlog on small screens
export const StyledBacklogToggle = styled.a`
  display: block;
  font-size: 10px;
  z-index: 10;
  width: 34px;
  height: 34px;
  background: ${COLOR_BLUE};

  @media ${device.desktop} {
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
