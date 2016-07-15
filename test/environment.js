import localStorage from 'localStorage';
import {jsdom} from 'jsdom';

// say we're not in webpack environment
// this is required to skip including styles
global.__WEBPACK__ = false; // eslint-disable-line no-underscore-dangle

// init jsdom
global.document = jsdom('<html><body><div id="mainContainer"></div></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

// mock location
global.window.location.href = 'http://localhost/';

// local storage polyfill
global.window.localStorage = localStorage;
global.localStorage = localStorage;
