'use strict';

let utils = require('./utils');

const container = document.querySelector('.reviews');
const reviews = container.querySelector('.reviews__wrap');

if (utils.isTouchDevice()) {
  container.classList.add('reviews--touch');
} else {
  utils.mouseScroll(reviews);
}
