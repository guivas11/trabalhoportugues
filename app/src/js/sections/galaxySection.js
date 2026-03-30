'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Galaxy = require('../objects3D/GalaxyObject3D');

var galaxySection = new Section('galaxy');

var galaxy = new Galaxy();
galaxy.el.rotation.x = -1;
galaxySection.add(galaxy.el);

galaxy.el.visible = false;

var text = new TextPanel(
  'M  O  D  E  R  N  I  S  M  O \n B  R  A  S  I  L  E  I  R  O',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(0, 20, -20);
text.el.rotation.y = 0;
galaxySection.add(text.el);

galaxySection.onIn(function (way) {
  galaxy.in(way);
  text.in();
});

galaxySection.onOut(function (way) {
  galaxy.out(way);
  text.out(way);
});

galaxySection.onStart(function () {
  galaxy.start();

  galaxy.el.visible = true;
});

galaxySection.onStop(function () {
  galaxy.stop();

  galaxy.el.visible = false;
});

module.exports = galaxySection;
