import styled from 'styled-components';

import {COLOR_FONT_GREY, COLOR_LIGHT_GREY, COLOR_LIGHTER_GREY, COLOR_ORANGE} from '../colors';
import {device, ZuehlkeFont} from '../dimensions';

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

export const StyledValueBadge = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: 8px;
  flex-shrink: 0;
  background: ${({cardColor}) => (cardColor ? cardColor : COLOR_LIGHTER_GREY)};
  justify-content: center;
  align-items: center;

  > div {
    font-size: 12px;
    color: white;
    font-family: ${ZuehlkeFont};
  }
`;

export const StyledUndecidedBadge = styled(StyledValueBadge)`
  background: none;
  width: 16px;
  height: 16px;
  border: 4px solid #ccc;
`;

export const StyledPasswordFieldWrapper = styled.div`
  position: relative;
  width: 100%;

  .clickable {
    display: block;
    position: absolute;
    right: 4px;
    top: 10px;
  }
`;

export const StyledPasswordInput = styled.input`
  height: 100%;
`;

export const StyledDropdown = styled.div`
  position: absolute;
  z-index: 1002;
  background: white;
  border: 1px solid #575d6273;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
  padding: 8px 0;
  width: 100%;
  right: 0;
  top: 100%;
  box-sizing: border-box;

  > div.clickable {
    padding: 4px 8px;
    margin-top: 4px;

    &:hover {
      background-color: ${COLOR_LIGHTER_GREY};
    }
  }

  @media ${device.desktop} {
    right: 8px;
    min-width: 132px;
    width: auto;
  }
`;

export const StyledStoryText = styled.div`
  margin-top: 4px;
  white-space: ${({md}) => (md ? 'inherit' : 'pre-wrap')};
  display: inline-block;
  overflow-x: ${({scroll}) => (scroll ? 'auto' : 'hidden')};
  width: 100%;
  position: relative;
`;

export const StyledToggleIcon = styled.i`
  display: inline-block;
  color: ${({on}) => (on ? COLOR_ORANGE : 'inherit')};
  cursor: pointer;
  position: absolute;
  bottom: 16px;
  right: 8px;
`;

export const StyledStoryTextExpandButton = styled.button`
  display: block;
  padding: 3px;
  font-size: small;
  margin: 4px 0 0 0;
`;

export const StyledToggleButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media ${device.desktop} {
    display: block;
  }
`;

export const StyledToggleButton = styled.button`
  padding: 4px 8px;
  font-size: small;
  box-shadow: ${({active}) =>
    active ? '0 0 0 1px rgb(0 0 0 / 15%) inset, 0 0 6px rgb(0 0 0 / 20%) inset' : 'inherit'};
  color: ${({active}) => (active ? '#fff' : COLOR_FONT_GREY)};
  background: ${({active}) => (active ? COLOR_ORANGE : '#e6e6e6')};
`;
