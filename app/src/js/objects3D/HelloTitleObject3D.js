'use strict';

var THREE = require('three');
var TweenLite = require('tweenlite');

var TextPanel = require('./TextPanelObject3D');

/**
 * Hello title
 *
 * Replaces the original sprite-based title with a text panel so the
 * first slide can show the current school presentation title.
 */
function Title () {
  var title = new TextPanel('TRABALHO DE\nPORTUGUÊS', {
    size: 96,
    align: 'center',
    lineSpacing: 16,
    color: 'rgba(220, 220, 220, 0.92)'
  });

  var group = new THREE.Object3D();
  group.add(title.el);
  group.position.set(0, 3.5, 0);

  var cache = { y: 18, opacity: 0 };

  function updateOpacity (value) {
    title.el.traverse(function (child) {
      if (child.material && child.material.opacity !== undefined) {
        child.material.opacity = value;
      }
    });
  }

  function update () {
    group.position.y = cache.y;
    updateOpacity(cache.opacity);
  }

  this.el = group;

  this.in = function () {
    title.in();

    TweenLite.to(cache, 1.2, {
      y: 3.5,
      opacity: 1,
      onStart: function () {
        group.visible = true;
      },
      onUpdate: update
    });
  };

  this.out = function () {
    title.out('up');

    TweenLite.to(cache, 0.9, {
      y: 18,
      opacity: 0,
      onUpdate: update,
      onComplete: function () {
        group.visible = false;
      }
    });
  };

  this.start = function () {};
  this.stop = function () {};

  group.visible = false;
  update();
}

module.exports = Title;
