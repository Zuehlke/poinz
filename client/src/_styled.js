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


  /**  ----   "Fork me on Github" ribbon ---- **/
  /*!
 * "Fork me on GitHub" CSS ribbon v0.2.3 | MIT License
 * https://github.com/simonwhitaker/github-fork-ribbon-css
*/.github-fork-ribbon{width:12.1em;height:12.1em;position:absolute;overflow:hidden;top:0;right:0;z-index:9999;pointer-events:none;font-size:13px;text-decoration:none;text-indent:-999999px}.github-fork-ribbon.fixed{position:fixed}.github-fork-ribbon:active,.github-fork-ribbon:hover{background-color:rgba(0,0,0,0)}.github-fork-ribbon:after,.github-fork-ribbon:before{position:absolute;display:block;width:15.38em;height:1.54em;top:3.23em;right:-3.23em;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.github-fork-ribbon:before{content:"";padding:.38em 0;background-color:#a00;background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,0)),to(rgba(0,0,0,.15)));background-image:-webkit-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,.15));background-image:-moz-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,.15));background-image:-ms-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,.15));background-image:-o-linear-gradient(top,rgba(0,0,0,0),rgba(0,0,0,.15));background-image:linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,.15));-webkit-box-shadow:0 .15em .23em 0 rgba(0,0,0,.5);-moz-box-shadow:0 .15em .23em 0 rgba(0,0,0,.5);box-shadow:0 .15em .23em 0 rgba(0,0,0,.5);pointer-events:auto}.github-fork-ribbon:after{content:attr(data-ribbon);color:#fff;font:700 1em "Helvetica Neue",Helvetica,Arial,sans-serif;line-height:1.54em;text-decoration:none;text-shadow:0 -.08em rgba(0,0,0,.5);text-align:center;text-indent:0;padding:.15em 0;margin:.15em 0;border-width:.08em 0;border-style:dotted;border-color:#fff;border-color:rgba(255,255,255,.7)}.github-fork-ribbon.left-bottom,.github-fork-ribbon.left-top{right:auto;left:0}.github-fork-ribbon.left-bottom,.github-fork-ribbon.right-bottom{top:auto;bottom:0}.github-fork-ribbon.left-bottom:after,.github-fork-ribbon.left-bottom:before,.github-fork-ribbon.left-top:after,.github-fork-ribbon.left-top:before{right:auto;left:-3.23em}.github-fork-ribbon.left-bottom:after,.github-fork-ribbon.left-bottom:before,.github-fork-ribbon.right-bottom:after,.github-fork-ribbon.right-bottom:before{top:auto;bottom:3.23em}.github-fork-ribbon.left-top:after,.github-fork-ribbon.left-top:before,.github-fork-ribbon.right-bottom:after,.github-fork-ribbon.right-bottom:before{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}



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
