'use strict';

const utils = require('./utils');

const navigation = document.querySelector('.navigation');
const btn = document.querySelector('.js-btn-menu');
const header = document.querySelector('.page-header');


let isScrolled = function() {
  let bodyPosition = document.body.getBoundingClientRect();
  return bodyPosition.top < 0;
};

let previousScroll = 0;

let throttleScroll = utils.throttle(function() {
  let bodyPosition = document.body.getBoundingClientRect();
  let isNearTop = bodyPosition.top > -100;
  let isScrollUp = bodyPosition.top > previousScroll;

  if (isScrollUp) {
    if (isNearTop) {
      header.classList.remove('page-header--sticky');
      header.classList.remove('page-header--unpinned');
      header.classList.remove('page-header--pinned');
      header.classList.add('page-header--top');
    } else {
      header.classList.add('page-header--pinned');
      header.classList.remove('page-header--unpinned');
    }
  } else {
    if (!isNearTop) {
      header.classList.add('page-header--sticky');
      header.classList.add('page-header--unpinned');
      header.classList.remove('page-header--pinned');
      header.classList.remove('page-header--top');
    }
  }
  previousScroll = bodyPosition.top;

}, 100);



window.addEventListener('scroll', throttleScroll);

btn.addEventListener('click',function() {
  btn.classList.toggle('page-header__btn-burger--open');
  header.classList.toggle('page-header--open');
  navigation.classList.toggle('navigation--open');
});
