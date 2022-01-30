import {createGlobalStyle} from 'styled-components';

import {COLOR_BLUE, COLOR_FONT_GREY, COLOR_LIGHTER_GREY, COLOR_ORANGE} from './components/colors';
import zFontWoff from './assets/aazuotps_30.12.13-webfont.woff2';

import {StyledCardInner} from './components/EstimationArea/_styled';
import {device} from './components/dimensions';

const Global = createGlobalStyle`

  @font-face {
    font-family: 'aa_zuehlke_otpsregular';
    src: url('${zFontWoff}') format("woff2");
    font-weight: normal;
    font-style: normal;
  }

  body {
    color: ${COLOR_FONT_GREY};
  }

  #app-root {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  /* purecss form overrides */
  .pure-form {

    .pure-group {
      input:first-child, textarea:first-child, input:last-child, textarea:last-child {
        border-radius: 0;
        top: 0;
        margin-top: 4px;
      }

      textarea {
        padding: 10px 0;
      }
    }

    textarea, input[type=text], input[type=password], input[readonly] {
      box-shadow: none;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid ${COLOR_LIGHTER_GREY};
      padding: 10px 0;
      background: transparent;

      &:focus {
        border-bottom: 1px solid ${COLOR_BLUE};
      }
    }

    &.pure-form-stacked label {
      margin-top: 16px;
    }

  }

  .pure-button {
    border-radius: 2px;

    &.pure-button-primary {
      background-color: ${COLOR_BLUE};
    }

    i.button-icon-left {
      padding-right: 8px;
    }

    i.button-icon-right {
      padding-left: 8px;
    }

    &.pure-button-stripped {
      background: none;
      border: none;
      box-shadow: none;
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }

      &.active {
        opacity: 1;
        color: ${COLOR_ORANGE};
      }
    }
  }

  a {
    color: ${COLOR_ORANGE};
  }

  .waiting-spinner {
    /* this is needed, so that we can position the gray overlay accordingly */
    position: relative;

    &:before {
      display: inline-block;
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      left: 0;
      top: 0;
      content: " ";
    }

    &${StyledCardInner}:before {
      border-radius: 12px;
    }

    &:after {
      animation: spin 2s infinite linear;
      font: normal normal normal 14px / 1 poinz;
      text-rendering: auto;
      content: "\\f110";
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 26px;
      margin-left: -13px;
      margin-top: -13px;
    }
  }

  .clickable {
    cursor: pointer;
  }

  .pure-button-group .pure-button:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .pure-button-group .pure-button:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  /**  ----   changing browser scrollbars ---- **/
  @media ${device.desktop} {
    /* Works on Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    }

    /* Works on Chrome, Edge, and Safari */
    *::-webkit-scrollbar {
      width: 5px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      border: 3px solid transparent;
    }
  }

`;

export default Global;
