'use strict';

var Section = require('../classes/SectionClass');

var Wave = require('../objects3D/WaveObject3D');

var waveSection = new Section('wave');

var wave = new Wave();
waveSection.add(wave.el);

wave.el.visible = false;

waveSection.onIn(function (way) {
  wave.in(way);
});

waveSection.onOut(function (way) {
  wave.out(way);
});

waveSection.onStart(function () {
  wave.start();

  wave.el.visible = true;
});

waveSection.onStop(function () {
  wave.stop();

  wave.el.visible = false;
});

module.exports = waveSection;
