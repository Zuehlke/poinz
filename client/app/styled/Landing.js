import styled from 'styled-components';
import backgroundImage from '../assets/landing_bg_z2020_lightblue.jpg';
import {COLOR_FONT_GREY} from './colors';

export const StyledLanding = styled.div`
  z-index: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed !important;
  background: url(${backgroundImage}) no-repeat center center fixed;
  background-size: cover;
`;

export const StyledActionLog = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    padding: 4px;
    margin-bottom: 8px;
    box-sizing: border-box;

    > span {
      display: block;
    }

    > span:first-child {
      font-size: 12px;
    }
  }
`;

export const StyledLandingInner = styled.div`
  margin-top: 20%;
`;

export const StyledInfoText = styled.div`
  display: flex;
  align-items: center;

  i {
    font-size: ${({small}) => (small ? '20px' : '30px')};
    margin-right: 16px;
  }
`;

export const StyledEyecatcher = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 400px;
  max-width: 85%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 18px 32px 32px 32px;
  border-radius: 2px;
  margin: 12px auto 0 auto;

  input {
    color: ${COLOR_FONT_GREY};
  }

  &.disclaimer-text {
    font-size: 13px;
  }
`;

export const StyledLargeFontEyecatcher = styled(StyledEyecatcher)`
  font-size: larger;
`;

export const StyledLandingDoubleButtonL = styled.button`
  border-radius: 2px 0 0 2px;
`;
export const StyledLandingDoubleButtonR = styled.button`
  border-radius: 0 2px 2px 0;
`;

export const StyledLandingForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;

  input[type='text'],
  input[type='text']:focus,
  input[type='text']:active {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid white;
    color: white;

    margin-top: 12px;
    margin-bottom: 12px;

    &::placeholder {
      color: white;
      opacity: 0.7;
    }
  }
`;
