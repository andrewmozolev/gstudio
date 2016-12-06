'use strict';

var navigation = document.querySelector('.navigation');
var btn = document.querySelector('.js-btn-menu');
var header = document.querySelector('.page-header');


var isScrolled = function() {
  var bodyPosition = document.body.getBoundingClientRect();
  return bodyPosition.top < 0;
};

window.addEventListener('scroll', function() {
  if (isScrolled()) {
    header.classList.add('page-header--sticky');
  } else {
    header.classList.remove('page-header--sticky');
  }
});

btn.addEventListener('click',function() {
  btn.classList.toggle('page-header__btn-burger--open');
  header.classList.toggle('page-header--open');
  navigation.classList.toggle('navigation--open');
});
