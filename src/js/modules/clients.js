'use strict';

let utils = require('./utils');

const container = document.querySelector('.clients__wrap');
const clients = container.querySelector('.clients__list');

if (utils.isTouchDevice()) {
  container.classList.add('clients__wrap--touch');
} else {
  utils.mouseScroll(clients);
}
