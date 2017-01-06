'use strict';

let utils = {
  mouseScroll: function(container) {
    let clientWidth = document.body.clientWidth;
    let scrollWidth = container.scrollWidth;
    let offset = scrollWidth - clientWidth;
    let ratio = offset / clientWidth;

    container.addEventListener('mousemove', function(evt) {
      let mouseX = evt.clientX;
      container.style.left = '-' + Math.round(mouseX * ratio) + 'px';
    });
  },

  isTouchDevice: function() {
   return (('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
  },

  throttle: function(callback,time) {
    let lastDate = Date.now();
    return function() {
      if (Date.now() - lastDate >= time) {
        callback();
        lastDate = Date.now();
      }
    };
  }

};

module.exports = utils;

