(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Event bus
 *
 * @class Events
 * @constructor
 */
function Events () {
  this.events = {};
  this.id = -1;
}

/**
 * Register event
 *
 * @method on
 * @param {String} [name]
 * @param {Function} [callback]
 * @return {Number} [id]
 */
Events.prototype.on = function (name, callback) {
  if (!this.events[name]) {
    this.events[name] = [];
  }

  var id = (++this.id).toString();

  this.events[name].push({
    id: id,
    callback: callback
  });

  return id;
};

/**
 * Trigger event
 *
 * @method trigger
 * @param {String} [name]
 * @param {Object} [data]
 */
Events.prototype.trigger = function (name, data) {
  if (!this.events[name]) {
    return false;
  }

  var suscribers = this.events[name];
  for (var i = 0, j = suscribers.length; i < j; i++) {
    suscribers[i].callback.apply(data);
  }
};

module.exports = Events;
},{}],2:[function(require,module,exports){
'use strict';

/**
 * Preload images. Notify on update/complete
 *
 * @class ImagesLoader
 * @constructor
 * @param {Array} [images=[]] Images sources
 */
function ImagesLoader (images) {
  this.images = images || [];
  this.total = this.images.length;

  var fn = function () {};
  this.progress = fn;
  this.complete = fn;
}

/**
 * Start to preload
 *
 * @method start
 */
ImagesLoader.prototype.start = function () {
  var loaded = 0;

  var updateQueue = function () {
    loaded++;

    var percent = (loaded * 100) / this.total;
    this.progress(percent);

    if (loaded === this.total) {
      this.complete();
    }
  }.bind(this);

  for (var i = 0; i < this.total; i++) {
    var image = new Image();
    image.src = this.images[i];
    image.onload = image.onerror = updateQueue;
  }
};

/**
 * Pass the update handler
 *
 * @method onProgress
 * @param {Function} [progress] 
 */
ImagesLoader.prototype.onProgress = function (progress) {
  this.progress = progress;
};

/**
 * Pass the complete handler
 *
 * @method onComplete
 * @param {Function} [complete] 
 */
ImagesLoader.prototype.onComplete = function (complete) {
  this.complete = complete;
};

module.exports = ImagesLoader;
},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Section class
 * 
 * @class Section
 * @constructor
 * @param {String} [name]
 * @requires THREE
 */
function Section (name) {
  this.name = name;
  this.playing = false;

  var fn = function () {};
  this._in = fn;
  this._out = fn;
  this._start = fn;
  this._stop = fn;

  this.el = new THREE.Object3D();
}

/**
 * Add a new object
 *
 * @method add
 * @param {THREE.Object3D} [object]
 */
Section.prototype.add = function (object) {
  this.el.add(object);
};

/**
 * Section's in animation
 *
 * @method in
 * @param {String} [way]
 */
Section.prototype.in = function (way) {
  this._in(way);
};

/**
 * Section's out animation
 *
 * @method out
 * @param {String} [way]
 */
Section.prototype.out = function (way) {
  this._out(way);
};

/**
 * Start the section
 *
 * @method start
 */
Section.prototype.start = function () {
  if (this.playing) {
    return false;
  }

  this._start();

  this.playing = true;
};

/**
 * Stop the section
 *
 * @method stop
 */
Section.prototype.stop = function () {
  if (!this.playing) {
    return false;
  }

  this._stop();

  this.playing = false;
};

/**
 * Pass the in handler
 *
 * @method onIn
 * @param {Function} [callback]
 */
Section.prototype.onIn = function (callback) {
  this._in = callback;
};

/**
 * Pass the out handler
 *
 * @method onOut
 * @param {Function} [callback]
 */
Section.prototype.onOut = function (callback) {
  this._out = callback;
};

/**
 * Pass the start handler
 *
 * @method onStart
 * @param {Function} [callback]
 */
Section.prototype.onStart = function (callback) {
  this._start = callback;
};

/**
 * Pass the stop handler
 *
 * @method onStop
 * @param {Function} [callback]
 */
Section.prototype.onStop = function (callback) {
  this._stop = callback;
};

module.exports = Section;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Slider
 *
 * @class Slider
 * @constructor
 * @requires jQuery
 */
function Slider ($el) {
  this.$el = $el;

  // els
  this.$container = this.$el.find('.slider__slides');
  this.$slides = this.$container.find('.slider__slide');
  this.$map = this.$el.find('.slider__map');

  // vars
  this.totalSlides = this.$slides.length;
  this.slideWidth = 100 / this.totalSlides;
  this.current = 0;
  this.interval = null;

  // init container
  this.$container.css('width', (this.totalSlides * 100) + '%');

  // methods
  this.onResize = null;

  // init slides and map
  var $node = jQuery('<div class="slider__map__node">');
  this.$nodes = jQuery();

  this.$slides.each(function (index, el) {
    var $slide = jQuery(el);
    
    $slide.css({
      width: this.slideWidth + '%',
      left: (index * this.slideWidth) + '%'
    });

    var $nodeCopy = $node.clone();
      
    // first slide/node setup
    if (index === 0) {
      $slide.addClass('is-active');
      $nodeCopy.addClass('is-active');
    }

    this.$nodes = this.$nodes.add($nodeCopy);
  }.bind(this));

  this.$map.html(this.$nodes);

  // init resize method
  this.onResize = function () {
    var maxHeight = 0;

    this.$slides.each(function () {
      var height = jQuery(this).height();

      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    maxHeight += 10;

    this.$el.css({ height: maxHeight, marginTop: -(maxHeight / 2) });
  }.bind(this);

  this.onResize();
}

/**
 * Go to next slide
 *
 * @method next
 */
Slider.prototype.next = function () {
  this.current++;

  if (this.current >= this.totalSlides) {
    this.current = 0;
  }

  this.goTo(this.current);
};

/**
 * Go to previous slide
 *
 * @method prev
 */
Slider.prototype.prev = function () {
  this.current--;

  if (this.current <= 0) {
    this.current = this.totalSlides;
  }

  this.goTo(this.current);
};

/**
 * Go to a specific slide
 *
 * @method goTo
 * @param {Number} [index] Slide's index
 */
Slider.prototype.goTo = function (index) {
  var target = -(index * 100) + '%';

  this.updateMap(index);

  this.$container.stop().animate({ left: target }, 500);

  this.$slides.removeClass('is-active');
  jQuery(this.$slides[index]).addClass('is-active');
};

/**
 * Update control nodes
 *
 * @method updateMap
 * @param {Number} [index] Current index
 */
Slider.prototype.updateMap = function (index) {
  this.$nodes.removeClass('is-active');
  jQuery(this.$nodes[index]).addClass('is-active');
};

/**
 * Start the slider
 *
 * @method start
 */
Slider.prototype.start = function () {
  this.$nodes.on('click', function (e) {
    var index = jQuery(e.currentTarget).index();
    this.goTo(index);
  }.bind(this));

  // autoplay with pause on hover
  this.interval = window.setInterval(function () {
    this.next();
  }.bind(this), 10000);

  var _this = this;
  
  this.$el.on({
    mouseenter: function () {
      window.clearInterval(_this.interval);
    },
    mouseleave: function () {
      _this.interval = window.setInterval(function () {
        _this.next();
      }, 10000);
    }
  });

  jQuery(window).on('resize', this.onResize);
  this.onResize();
};

/**
 * Stop the slider
 *
 * @method next
 */
Slider.prototype.stop = function () {
  this.$nodes.off('click');
  this.$el.off('mouseenter mouseleave');
  jQuery(window).off('resize', this.onResize);

  window.clearInterval(this.interval);
};

module.exports = Slider;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Sprite animation on a mesh using texture's offset
 *
 * @module SPRITE3D
 * @requires jQuery, THREE
 */
var SPRITE3D = SPRITE3D || (function () {
  var sprites = [];
  var previousTime = Date.now();

  return {
    /**
     * Add a new Sprite to the render queue
     *
     * @method add
     * @param {SPRITE3D.Sprite} [Sprite]
     */
    add: function (Sprite) {
      // update previousTime to avoid frame jumping
      // if inactive for too long
      if (sprites.length === 0) {
        previousTime = Date.now();
      }

      sprites.push(Sprite);
    },

    /**
     * Remove a Sprite from the render queue
     *
     * @method remove
     * @param {SPRITE3D.Sprite} [Sprite]
     */
    remove: function (Sprite) {
      var i = sprites.indexOf(Sprite);

      if (i !== -1) {
        sprites.splice(i, 1);
      }
    },

    /**
     * Update Sprites in the render queue
     *
     * @method update
     */
    update: function () {
      if (!sprites.length) {
        return false;
      }

      var time = Date.now();
      var delta = time - previousTime;
      previousTime = time;

      var i = 0;

      while (i < sprites.length) {
        if (sprites[i].update(delta)) {
          i++;
        } else {
          sprites.splice(i, 1);
        }
      }
    }
  };
})();

/**
 * Sprite
 *
 * @class SPRITE3D.Sprite
 * @constructor
 * @param {THREE.Texture} [texture]
 * @param {Object} [options]
 * @params {Number} [options.duration=100] Time per image
 * @params {Number} [options.horizontal=1] Horizontal steps
 * @params {Number} [options.vertical=1] Vertical steps
 * @params {Number} [options.total=1] Total steps
 * @params {Boolean} [options.loop=true] Loop?
 * @requires SPRITE3D, jQuery, THREE
 */
SPRITE3D.Sprite = function (texture, options) {
  this.texture = texture;

  this.parameters = jQuery.extend({
    duration: 100,
    horizontal: 1,
    vertical: 1,
    total: 1,
    loop: true
  }, options);

  this.texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
  this.texture.repeat.set(1 / this.parameters.horizontal, 1 / this.parameters.vertical);
  this.texture.offset.x = this.texture.offset.y = 1;

  this.isPlaying = false;
  this.current = 0;
  this.currentTime = 0;
};

/**
 * Start the animation (add it to render queue)
 *
 * @method start
 */
SPRITE3D.Sprite.prototype.start = function () {
  if (this.isPlaying) {
    return false;
  }

  SPRITE3D.add(this);

  this.isPlaying = true;
};

/**
 * Stop the animation (remove it from render queue)
 *
 * @method stop
 */
SPRITE3D.Sprite.prototype.stop = function () {
  if (!this.isPlaying) {
    return false;
  }

  SPRITE3D.remove(this);

  this.isPlaying = false;
};

/**
 * Update thre Sprite
 *
 * @method update
 * @param {Number} [delta] Time delta (time elapsed since last update)
 */
SPRITE3D.Sprite.prototype.update = function (delta) {
  this.currentTime += delta;

  while (this.currentTime > this.parameters.duration) {
    this.currentTime -= this.parameters.duration;

    this.current++;

    if (this.current === this.parameters.total - 1) {
      if (this.parameters.loop) {
        this.current = 0;  
      } else {
        this.current = 0;
        this.stop();
        return false;
      }
    }

    var factor = this.parameters.total - this.current;

    var row = Math.floor(factor / this.parameters.horizontal);
    var col = Math.floor(factor % this.parameters.horizontal);

    this.texture.offset.x = col / this.parameters.horizontal;
    this.texture.offset.y = row / this.parameters.vertical;
  }

  return true;
};

module.exports = SPRITE3D;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var debounce = require('../utils/debounceUtil');

module.exports = (function ($) {
  /**
   * Trigger event on element when they enter/leave viewport
   *
   * @class waypoint
   * @constructor
   * @param {Object} [options]
   * @param {jQuery} [options.$viewport=jQuery(window)] Viewport
   * @param {Number} [options.offset=0] Offset
   * @param {Number} [options.startAt=null] Start after certain distance (for performances)
   * @requires jQuery, debounce
   */
  $.fn.waypoint = function (options) {
    var isInContainer = options.$viewport ? true : false;

    var parameters = $.extend({
      $viewport: $(window),
      offset: 0,
      startAt: null
    }, options);

    var $els = $(this);
    var $viewport = parameters.$viewport;

    var viewportHeight = $viewport.height();
    var scrollTop = $viewport.scrollTop();
    var threshold = viewportHeight * (parameters.offset / 100);

    // Store height and top on elements to avoid consecutive computations
    function cacheAttributes () {
      $els.each(function () {
        var $el = $(this);

        var height = parseInt($el.outerHeight());
        var top = isInContainer
          ? parseInt($el.position().top) + scrollTop
          : parseInt($el.offset().top);

        $el.attr({ 'data-height': height, 'data-top': top });
      });
    }

    function onResize () {
      /*jshint validthis: true */

      viewportHeight = $viewport.height();
      threshold = viewportHeight * (parameters.offset / 100);

      cacheAttributes();

      $(this).trigger('scroll');
    }

    var onScroll = debounce(function onScroll () {
      scrollTop = $(this).scrollTop();

      if (parameters.startAt && scrollTop < parameters.startAt) {
        return false;
      }

      var topLimit = scrollTop + threshold;
      var bottomLimit = scrollTop + (viewportHeight - threshold);

      $els.each(function () {
        var $el = $(this);

        var state = $el.attr('data-state');

        var height = parseInt($el.attr('data-height')) || $el.outerHeight();
        var top = isInContainer
          ? parseInt($el.attr('data-top')) + 1 || $el.position().top + 1
          : parseInt($el.attr('data-top')) + 1 || $el.offset().top + 1;
        var bottom = top + height;

        if (top > topLimit && top < bottomLimit
            || bottom > topLimit && bottom < bottomLimit
            || top < topLimit && bottom > bottomLimit) {

          if (!state) {
            $el.attr('data-state', 'visible');
            $el.trigger('active');
            $el.trigger('stateChange', 'active');
          }
        } else {
          if (state) {
            $el.attr('data-state', null);
            $el.trigger('inactive');
            $el.trigger('stateChange', 'inactive');
          }
        }

      });
    }, 20);

    return {
      /**
       * Start waypoint
       *
       * @method start
       */
      start: function () {
        $(window).on('resize', onResize);
        $viewport.on('scroll', onScroll);
        cacheAttributes();
        onScroll();
      },

      /**
       * Stop waypoint
       *
       * @method stop
       */
      stop: function () {
        $(window).off('resize', onResize);
        $viewport.off('scroll', onScroll);
      }
    };
  };

})(jQuery);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/debounceUtil":60}],7:[function(require,module,exports){
(function (global){
'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);
TweenLite.defaultEase = window.Quad.easeInOut;

require('./libs/waypointLib');
  
var APP = require('./modules/appModule');
var SCENE = require('./modules/sceneModule');
var SOUNDS = require('./modules/soundsModule');
var HASH = require('./modules/hashModule');

var ImagesLoader = require('./classes/LoaderClass');

var Loader = require('./objects2D/LoaderObject2D');
var Menu = require('./objects2D/menuObject2D');
var Help = require('./objects2D/HelpObject2D');
var Wireframe = require('./objects2D/WireframeObject2D');

var helloSection = require('./sections/helloSection');
var beamsSection = require('./sections/beamsSection');
var dropSection = require('./sections/dropSection');
var ballSection = require('./sections/ballSection');
var flowSection = require('./sections/flowSection');
var neonsSection = require('./sections/neonsSection');
var heightSection = require('./sections/heightSection');
var waveSection = require('./sections/waveSection');
var faceSection = require('./sections/faceSection');
var rocksSection = require('./sections/rocksSection');
var galaxySection = require('./sections/galaxySection');
var gravitySection = require('./sections/gravitySection');
var citySection = require('./sections/citySection');
var endSection = require('./sections/endSection');

jQuery(function () {
  HASH.replacePlaceholders();

  var loader = new Loader();
  var help = new Help();
  var menu = new Menu();
  var imagesLoader = new ImagesLoader([
    './app/public/img/texture-ball.png',
    './app/public/img/texture-ballAlpha.png',
    './app/public/img/sprite-smoke.png',
    './app/public/img/sprite-AKQA.png'
  ]);

  // preload
  imagesLoader.start();

  imagesLoader.onProgress(function (percent) {
    loader.update(percent);
  });

  imagesLoader.onComplete(function () {
    loader.out();

    TweenLite.delayedCall(0.8, SCENE.in);
    TweenLite.delayedCall(1.5, function () {
      map.in();
      menu.in();
    });
  });

  menu.onClick(function () {
    var $el = jQuery(this);
    var name = $el.attr('data-button') || '';

    if (name === 'sounds') {
      SOUNDS.toggle();
      $el.html(SOUNDS.isMuted() ? 'UNMUTE' : 'MUTE');
    }
    else if (name === 'help') {
      help.in();
    }
    else if (name === 'quality') {
      var text;
      var quality;

      if (SCENE.getQuality() === 0.5) {
        text = 'QUALITY 1';
        quality = 1;
      } else {
        text = 'QUALITY 0.5';
        quality = 0.5;
      }

      $el.html(text);
      SCENE.quality(quality);
    }
  });  
    
  // scene
  var $heads = jQuery('.heads');
  var $viewport = $heads.find('.heads__viewport');
  var $presentationCopy = $viewport.find('.presentation__copy');
  var $presentationTitle = $presentationCopy.find('.presentation__title');
  var $presentationEyebrow = $presentationCopy.find('.presentation__eyebrow');
  var $presentationTexts = $presentationCopy.find('.presentation__text');

  var sectionsCopy = {
    hello: {
      title: 'FAUVISMO <br> E SEMANA DE 22',
      eyebrow: 'ARTE MODERNA',
      texts: [
        '',
        '',
        '',
        '',
        '',
        ''
      ]
    },
    beams: {
      title: 'O <br> FAUVISMO',
      eyebrow: 'FAUVISMO',
      texts: [
        'O Fauvismo foi uma vanguarda artística francesa associada aos primeiros anos do século XX. Seu nome surgiu quando críticos chamaram seus artistas de "feras" por causa da ousadia visual das obras.',
        'Esse movimento apareceu em um momento de intensa renovação nas artes europeias, quando diferentes grupos buscavam superar o naturalismo e experimentar linguagens mais livres.',
        'Entre os nomes mais conhecidos estão Henri Matisse e André Derain, artistas que passaram a usar a pintura como espaço de sensação, energia e impacto cromático.',
        'Mais do que representar o mundo de maneira fiel, o Fauvismo queria provocar uma experiência visual forte, fazendo da cor um elemento central da composição.',
        'O movimento não durou muito tempo como grupo organizado, mas sua importância foi enorme porque mostrou que a pintura podia ser menos descritiva e muito mais expressiva.',
        'Por isso, estudar o Fauvismo é importante para entender um momento em que a arte europeia assume com mais coragem a liberdade formal e abre caminho para novas experiências modernas.'
      ]
    },
    drop: {
      title: 'COR E <br> EXPRESSÃO',
      eyebrow: 'COR E EXPRESSÃO',
      texts: [
        'No Fauvismo, a cor deixa de ser apenas um recurso para copiar a realidade. Ela passa a ter valor próprio e a transmitir emoção, tensão, movimento e atmosfera.',
        'Por isso, os artistas fauvistas usavam cores puras, contrastantes e muitas vezes não naturais. Um rosto podia ter tons verdes, azuis ou laranjas, se isso ajudasse a ampliar a expressão da cena.',
        'Essa mudança foi importante porque mostrou que a pintura não precisava depender da imitação fiel do mundo visível para ser significativa.',
        'Ao colocar a cor no centro da obra, o Fauvismo abriu caminho para uma visão mais subjetiva e moderna da arte.',
        'Essa escolha alterou a maneira de olhar para a pintura: a obra deixa de ser apenas uma janela para o mundo e passa a ser um espaço de construção sensível e interpretativa.',
        'Para o público, isso significa entender que a arte moderna não quer simplesmente reproduzir a realidade, mas reinventá-la por meio de recursos visuais mais livres e impactantes.'
      ]
    },
    ball: {
      title: 'RUPTURA <br> ARTÍSTICA',
      eyebrow: 'RUPTURA',
      texts: [
        'A grande marca das vanguardas modernas foi a ruptura com regras tradicionais. O artista passa a experimentar forma, cor, ritmo e composição com muito mais liberdade.',
        'No caso do Fauvismo, isso aparece na simplificação das formas, na distorção de proporções e na intensidade visual das imagens.',
        'Essa ruptura não era apenas técnica. Ela representava uma nova forma de pensar a arte: menos voltada a repetir modelos do passado e mais aberta a inventar novas linguagens.',
        'Esse clima de experimentação influenciou muitos movimentos modernos e ajuda a entender por que o início do século XX foi tão importante para a história da arte.',
        'A ideia de ruptura também aparece no comportamento dos artistas, que passam a se colocar como agentes ativos de transformação cultural, e não apenas como continuadores de tradições consolidadas.',
        'Desse modo, o Fauvismo ajuda a compreender como a arte moderna se afirmou historicamente: como gesto de confronto, pesquisa e renovação da sensibilidade.'
      ]
    },
    flow: {
      title: 'SEMANA <br> DE 22',
      eyebrow: 'SEMANA DE 22',
      texts: [
        'No Brasil, o principal marco do modernismo foi a Semana de Arte Moderna, realizada no Theatro Municipal de São Paulo em 13, 15 e 17 de fevereiro de 1922.',
        'O evento reuniu exposições, conferências, poesia, música e debates, propondo uma renovação cultural ampla e não apenas uma mudança na pintura.',
        'A Semana de 22 deu visibilidade pública a artistas e intelectuais que defendiam uma arte mais moderna, mais experimental e mais ligada ao tempo presente.',
        'Por isso, ela é lembrada como um momento simbólico da entrada do Brasil no debate moderno das artes e da cultura.',
        'Mesmo tendo recebido críticas e reações negativas na época, a Semana de 22 consolidou uma postura de enfrentamento ao conservadorismo artístico e intelectual.',
        'Seu valor histórico está justamente no fato de ter tornado visível, para um público amplo, a ideia de que a cultura brasileira precisava encontrar formas novas de se expressar.'
      ]
    },
    neons: {
      title: 'OBJETIVO <br> MODERNISTA',
      eyebrow: 'OBJETIVO',
      texts: [
        'Os modernistas brasileiros queriam romper com o academicismo, isto é, com uma arte muito presa a regras, modelos fixos e referências do passado.',
        'Ao mesmo tempo, defendiam a construção de uma linguagem capaz de dialogar com a realidade brasileira, valorizando experiências, temas e ritmos do país.',
        'Isso significava renovar a forma de escrever, pintar, compor e pensar a cultura, aproximando o Brasil das discussões modernas internacionais.',
        'O objetivo não era negar toda influência europeia, mas transformar essas referências em algo próprio, crítico e criativo.',
        'Por isso, o modernismo brasileiro envolve ao mesmo tempo abertura ao novo e desejo de afirmação cultural. Não se trata apenas de importar novidades, mas de reelaborar ideias a partir do contexto nacional.',
        'Esse ponto é importante para o público entender que modernizar, no caso brasileiro, era também buscar autonomia e construir uma nova consciência artística.'
      ]
    },
    height: {
      title: 'PRINCIPAIS <br> NOMES',
      eyebrow: 'PRINCIPAIS NOMES',
      texts: [
        'A Semana de 22 reuniu nomes de diferentes linguagens, mostrando que a renovação modernista era ampla e envolvia literatura, música e artes visuais.',
        'Na pintura, Anita Malfatti teve papel fundamental por sua produção inovadora e pelo impacto que suas obras causaram no debate artístico brasileiro.',
        'Na literatura, Mário de Andrade, Oswald de Andrade e Menotti Del Picchia participaram ativamente da formulação das ideias modernistas.',
        'Na música, Heitor Villa-Lobos simbolizou a busca por uma linguagem moderna capaz de dialogar com elementos brasileiros.',
        'Cada um desses nomes ajudou a dar forma concreta ao modernismo, mostrando que a mudança não dependia de um único artista, mas de uma rede de criadores e pensadores.',
        'Ao apresentar esses nomes, o objetivo é mostrar ao público que a Semana de 22 foi um encontro de vozes diversas, todas comprometidas com a renovação cultural.'
      ]
    },
    wave: {
      title: 'IMPORTÂNCIA <br> DA SEMANA',
      eyebrow: 'IMPORTÂNCIA',
      texts: [
        'A Semana de 22 foi importante porque transformou uma vontade de renovação artística em um acontecimento público, visível e historicamente marcante.',
        'Ela reuniu artistas, escritores e músicos em defesa de uma cultura brasileira mais moderna, crítica e aberta à experimentação.',
        'Depois de 1922, o modernismo ganhou mais legitimidade e passou a influenciar novas gerações em várias áreas da arte.',
        'Por isso, a Semana se tornou símbolo de ruptura com o academicismo e de busca por uma linguagem cultural mais autônoma no Brasil.',
        '',
        ''
      ]
    },
    face: {
      title: 'RELAÇÃO <br> ENTRE TEMAS',
      eyebrow: 'RELAÇÃO',
      texts: [
        'A Semana de 22 não foi um evento fauvista, mas os dois temas se conectam porque fazem parte de um clima mais amplo de transformação da arte moderna.',
        'No Fauvismo, vemos a liberdade da cor e da forma. Na Semana de 22, vemos a defesa de uma cultura brasileira menos presa ao academicismo e mais aberta à experimentação.',
        'Em ambos os casos, a arte deixa de apenas repetir modelos tradicionais e passa a afirmar novos pontos de vista, novos ritmos e novas maneiras de criar.',
        'Essa relação ajuda o público a perceber que a modernidade artística foi, em muitos lugares, uma resposta à necessidade de renovar linguagens e imaginar outros caminhos.',
        'Assim, o que une os dois temas não é uma identidade direta, mas a presença de um mesmo impulso histórico: romper limites, buscar autenticidade e reinventar a expressão artística.',
        'Comparar esses dois momentos torna mais fácil entender que a arte moderna foi, ao mesmo tempo, internacional em suas influências e local em suas formas de afirmação.'
      ]
    },
    rocks: {
      title: 'BRASIL <br> 1922',
      eyebrow: 'BRASIL 1922',
      texts: [
        'No Brasil de 1922, modernizar a arte não significava apenas copiar as vanguardas europeias. Era preciso reinterpretar essas influências a partir da realidade brasileira.',
        'Os modernistas queriam superar a repetição rígida de modelos externos e construir uma produção com identidade própria.',
        'Essa busca aparece no interesse por temas nacionais, pela linguagem coloquial, por ritmos brasileiros e por uma visão mais crítica da cultura.',
        'Assim, o modernismo brasileiro procurou unir renovação formal e afirmação cultural em um mesmo movimento.',
        'Esse processo foi importante porque ajudou a criar uma arte mais consciente de seu contexto histórico e social, menos dependente de validação externa.',
        'Para o público, isso mostra que a Semana de 22 não deve ser vista apenas como um evento artístico, mas como parte de uma mudança cultural mais profunda no Brasil.'
      ]
    },
    galaxy: {
      title: 'MODERNISMO <br> BRASILEIRO',
      eyebrow: 'MODERNISMO',
      texts: [
        'A Semana de 22 não esgotou o modernismo brasileiro. Pelo contrário, ela abriu caminhos para novas obras, manifestos, livros, pesquisas e experimentos artísticos.',
        'Depois de 1922, a arte moderna no Brasil se expandiu por várias linguagens e continuou a discutir identidade, forma, linguagem e cultura nacional.',
        'Na poesia, na prosa, na música e nas artes visuais, a busca por autonomia e inventividade se tornou cada vez mais forte.',
        'Por isso, o modernismo brasileiro deve ser entendido como um processo mais amplo, e não apenas como um evento isolado.',
        'Ao longo das décadas seguintes, muitos artistas retomaram essas questões e ampliaram o debate sobre brasilidade, vanguarda, linguagem e experimentação.',
        'Assim, a Semana de 22 funciona como ponto de partida simbólico para um movimento maior, cujos efeitos se espalharam por toda a cultura brasileira.'
      ]
    },
    gravity: {
      title: 'IDEIA <br> CENTRAL',
      eyebrow: 'IDEIA CENTRAL',
      texts: [
        'A ideia central deste trabalho é mostrar que a arte moderna se construiu por meio de rupturas: rupturas de linguagem, de forma, de tema e de atitude diante da criação.',
        'No Fauvismo, a ruptura aparece no uso intenso da cor e na liberdade visual. Na Semana de 22, aparece na defesa de uma nova cultura artística brasileira.',
        'Esses dois casos mostram que a modernidade não depende apenas de inovação técnica, mas também de coragem para questionar modelos estabelecidos.',
        'Assim, cor, expressão, identidade e experimentação se tornam chaves para compreender o sentido histórico e cultural desses movimentos.',
        'Essa leitura ajuda a apresentar o tema de forma clara ao público: primeiro, entender a transformação da linguagem artística; depois, perceber como essa transformação assume sentidos diferentes em cada contexto.',
        'Em resumo, o trabalho mostra que a arte moderna nasce da vontade de criar novas maneiras de ver, sentir e representar o mundo.'
      ]
    },
    city: {
      title: 'HERANÇA <br> CULTURAL',
      eyebrow: 'HERANÇA CULTURAL',
      texts: [
        'O legado desses movimentos ultrapassa o tempo em que surgiram. Ainda hoje, eles são lembrados como exemplos de ousadia, inventividade e transformação cultural.',
        'O Fauvismo continua importante por mostrar como a cor pode reorganizar completamente a experiência visual de uma obra.',
        'A Semana de 22 permanece central porque simboliza um momento em que a cultura brasileira decidiu se repensar de maneira crítica e criativa.',
        'Em ambos os casos, a herança deixada é a de uma arte que não teme experimentar, questionar e reinventar a forma de ver o mundo.',
        'Esse legado aparece hoje sempre que valorizamos criatividade, liberdade formal, identidade cultural e atitude crítica na produção artística.',
        'Por isso, estudar esses temas não é apenas olhar para o passado, mas compreender fundamentos que ainda influenciam a arte contemporânea.'
      ]
    },
    end: {
      title: 'CONCLUSÃO <br> DO TEMA',
      eyebrow: 'CONCLUSÃO',
      texts: [
        'Como conclusão, o trabalho mostra que Fauvismo e Semana de 22 podem ser estudados juntos quando o foco está na ideia de modernidade, renovação e ruptura.',
        'O primeiro evidencia a força da cor e da liberdade expressiva; o segundo, a afirmação de uma cultura artística brasileira mais moderna e autônoma.',
        'Ao relacionar os dois temas, fica mais fácil perceber como a arte moderna nasceu da necessidade de criar novas linguagens e questionar velhas formas de pensar.',
        'Por isso, entender esses movimentos ajuda o público a compreender não apenas obras e eventos, mas o próprio sentido histórico da arte como transformação.',
        'A apresentação procura mostrar que a modernidade artística não se resume a um estilo visual: ela é uma mudança de atitude diante da criação, da cultura e da história.',
        'Em última instância, Fauvismo e Semana de 22 revelam como a arte pode ser ao mesmo tempo experiência sensível, debate intelectual e afirmação de novos horizontes culturais.'
      ]
    }
  };

  function updatePresentationCopy (name) {
    var data = sectionsCopy[name] || sectionsCopy.hello;

    $presentationCopy.stop().animate({ opacity: 0, y: 20 }, 200, function () {
      $presentationCopy.removeClass('presentation__copy--drop presentation__copy--right presentation__copy--center');

      if (name === 'drop') {
        $presentationCopy.addClass('presentation__copy--drop');
        $presentationCopy.css({
          top: '44px',
          left: 'auto',
          right: '52px',
          width: '380px',
          maxWidth: '380px',
          paddingRight: '0'
        });
      } else if (name === 'wave') {
        $presentationCopy.addClass('presentation__copy--right');
        $presentationCopy.css({
          top: '44px',
          left: 'auto',
          right: '52px',
          width: '400px',
          maxWidth: '400px',
          paddingRight: '0',
          transform: 'none'
        });
      } else if (name === 'flow' || name === 'neons' || name === 'height') {
        $presentationCopy.addClass('presentation__copy--right');
        $presentationCopy.css({
          top: '44px',
          left: 'auto',
          right: '52px',
          width: '400px',
          maxWidth: '400px',
          paddingRight: '0',
          transform: 'none'
        });
      } else {
        $presentationCopy.css({
          top: '44px',
          left: '42px',
          right: 'auto',
          width: '100%',
          maxWidth: '460px',
          paddingRight: '24px',
          transform: 'none'
        });
      }

      $presentationTitle.html(data.title || '');
      $presentationEyebrow.html(data.eyebrow || '');
      $presentationTexts.eq(0).html(data.texts[0] || '');
      $presentationTexts.eq(1).html(data.texts[1] || '');
      $presentationTexts.eq(2).html(data.texts[2] || '');
      $presentationTexts.eq(3).html(data.texts[3] || '');
      $presentationTexts.eq(4).html(data.texts[4] || '');
      $presentationTexts.eq(5).html('');
      $presentationCopy.animate({ opacity: 1, y: 0 }, 350);
    });
  }

  SCENE.config({ quality: 1 });
  SCENE.setViewport($viewport);
  SCENE.addSections([
    helloSection,
    beamsSection,
    dropSection,
    ballSection,
    flowSection,
    neonsSection,
    heightSection,
    waveSection,
    faceSection,
    rocksSection,
    galaxySection,
    gravitySection,
    citySection,
    endSection
  ]);

  SCENE.on('section:changeBegin', function () {
    var way = this.way;
    var to = this.to.name;
    var from = this.from.name;

    updatePresentationCopy(to);

    // in begin
    if (to === 'hello') {
      helloSection.in();
      helloSection.start();
      helloSection.smokeStart();

      beamsSection.out('up');
      beamsSection.start();
    }
    else if (to === 'beams') {
      helloSection.smokeStart();

      beamsSection.in();
      beamsSection.start();
    }
    else if (to === 'drop') {
      beamsSection.out('down');
      beamsSection.start();

      dropSection.in();
      dropSection.start();
    }
    else if (to === 'ball') {
      dropSection.out('down');
      dropSection.start();

      ballSection.in();
      ballSection.start();

      flowSection.fieldIn();
      flowSection.start();
    }
    else if (to === 'flow') {
      flowSection.in();
      flowSection.fieldIn();
      flowSection.start();

      neonsSection.smokeStart();
    }
    else if (to === 'neons') {
      flowSection.fieldIn();
      flowSection.start();

      neonsSection.start();
      neonsSection.smokeStart();

      heightSection.show();
    }
    else if (to === 'height') {
      flowSection.fieldIn();
      flowSection.start();

      neonsSection.smokeStart();

      heightSection.show();
      heightSection.in();
      heightSection.start();
    }
    else if (to === 'wave') {
      heightSection.show();

      waveSection.in(way);
      waveSection.start();
    }
    else if (to === 'face') {
      faceSection.in();
      faceSection.start();

      rocksSection.show();
    }
    else if (to === 'rocks') {
      rocksSection.show();
      rocksSection.in();
      rocksSection.start();
    }
    else if (to === 'galaxy') {
      rocksSection.show();

      galaxySection.in(way);
      galaxySection.start();

      gravitySection.show();
    }
    else if (to === 'gravity') {
      gravitySection.show();
      gravitySection.in();
      gravitySection.start();
    }
    else if (to === 'end') {
      endSection.in();
    }

    // out begin
    if (from === 'hello') {
      helloSection.out(way);
    }
    else if (from === 'beams') {
      beamsSection.out(way);
    }
    else if (from === 'drop') {
      dropSection.out(way);
    }
    else if (from === 'ball') {
      ballSection.out(way);
    }
    else if (from === 'flow') {
      flowSection.out(way);
    }
    else if (from === 'neons') {
      neonsSection.out(way);
    }
    else if (from === 'height') {
      heightSection.out(way);
    }
    else if (from === 'wave') {
      waveSection.out(way);
    }
    else if (from === 'face') {
      faceSection.out(way);
    }
    else if (from === 'rocks') {
      rocksSection.out(way);
    }
    else if (from === 'galaxy') {
      galaxySection.out(way);
    }
    else if (from === 'gravity') {
      gravitySection.out(way);
    }
    else if (from === 'end') {
      endSection.out(way);
    }
  });

  SCENE.on('section:changeComplete', function () {
    var to = this.to.name;
    var from = this.from.name;

    // out complete
    if (from === 'hello') {
      helloSection.stop();

      if (to !== 'beams') {
        helloSection.smokeStop();
      }

      if (to !== 'beams' && to !== 'drop') {
        beamsSection.stop();
      }
    }
    else if (from === 'beams') {
      if (to !== 'hello') {
        helloSection.smokeStop();
      }

      if (to !== 'hello' && to !== 'drop') {
        beamsSection.stop();
      }
    }
    else if (from === 'drop') {
      if (to !== 'hello' && to !== 'beams') {
        beamsSection.stop();
      }

      if (to !== 'ball') {
        dropSection.stop();
      }
    }
    else if (from === 'ball') {
      ballSection.stop();

      if (to !== 'drop') {
        dropSection.stop();
      }

      if (to !== 'flow' && to !== 'neons' && to !== 'height') {
        flowSection.stop();
      }
    }
    else if (from === 'flow') {
      if (to !== 'neons' && to !== 'height') {
        neonsSection.smokeStop();
      }

      if (to !== 'ball' && to !== 'neons' && to !== 'height') {
        flowSection.stop();
      }
    }
    else if (from === 'neons') {
      neonsSection.stop();

      if (to !== 'flow' && to !== 'height') {
        neonsSection.smokeStop();
      }

      if (to !== 'ball' && to !== 'flow' && to !== 'height') {
        flowSection.stop();
      }

      if (to !== 'height' && to !== 'wave') {
        heightSection.hide();
      }
    }
    else if (from === 'height') {
      heightSection.stop();

      if (to !== 'neons' && to !== 'wave') {
        heightSection.hide();
      }

      if (to !== 'flow' && to !== 'neons') {
        neonsSection.smokeStop();
      }

      if (to !== 'ball' && to !== 'flow' && to !== 'neons') {
        flowSection.stop();
      }
    }
    else if (from === 'wave') {
      waveSection.stop();

      if (to !== 'neons' && to !== 'height') {
        heightSection.hide();
      }
    }
    else if (from === 'face') {
      faceSection.stop();

      if (to !== 'rocks' && to !== 'galaxy') {
        rocksSection.hide();
      }
    }
    else if (from === 'rocks') {
      rocksSection.stop();

      if (to !== 'face' && to !== 'galaxy') {
        rocksSection.hide();
      }
    }
    else if (from === 'galaxy') {
      galaxySection.stop();

      if (to !== 'face' && to !== 'rocks') {
        rocksSection.hide();
      }

      if (to !== 'gravity') {
        gravitySection.hide();
      }
    }
    else if (from === 'gravity') {
      gravitySection.stop();

      if (to !== 'galaxy') {
        gravitySection.hide();
      }
    }
  });

  SCENE.on('end', function () {
    SCENE.lock();
    APP.slide(SCENE.unlock);
  });

  // map
  var map = SCENE.getMap();

  $heads.prepend(map.$el);

  map.init();

  map.onClick(function (index) {
    SCENE.goTo(index);
  });

  SCENE.on('section:changeBegin', function () {
    map.setActive(this.to.index);
  });

  // tails
  var wireframe = new Wireframe(jQuery('.wireframe'));

  var $tailsSections = jQuery('.tails__section');
  $tailsSections.find('.tails__section__el').animate({ opacity: 0, y: 100 }, 0);

  var waypoint = $tailsSections.waypoint({
    $viewport: jQuery('.tails'),
    offset: 30
  });

  $tailsSections.on('active', function () {
    var $el = jQuery(this);
    
    if ($el.attr('data-appeared')) {
      return false;
    }

    jQuery(this).find('.tails__section__el').each(function (i) {
      jQuery(this).stop().delay(i * 100).animate({ opacity: 1, y: 0 }, 500);
    });

    $el.attr('data-appeared', true);
  });

  jQuery('.tails__section--site').on('stateChange', function (e, state) {
    if (state === 'active') {
      wireframe.start();
      wireframe.in();
    } else {
      wireframe.stop();
    }
  });

  APP.on('slideBegin', function () {
    if (this.to === 'heads') {
      waypoint.stop();

      try {
        SOUNDS.background.fadeIn(1, 2000);  
      } catch (e) {
        console.warn(e);
      }
      
    } else {
      SOUNDS.background.fadeOut(0, 2000);
    }
  });

  APP.on('slideComplete', function () {
    if (this.to === 'tails') {
      waypoint.start();
    }
  });
 
  // SCENE on/off
  APP.on('heads:visible', function () {
    SCENE.start();
  });

  APP.on('heads:invisible', function () {
    SCENE.stop();
  });

  APP.start();
  SCENE.start();

  SOUNDS.background.fadeIn(1, 2000);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./classes/LoaderClass":2,"./libs/waypointLib":6,"./modules/appModule":11,"./modules/hashModule":12,"./modules/sceneModule":13,"./modules/soundsModule":14,"./objects2D/HelpObject2D":15,"./objects2D/LoaderObject2D":18,"./objects2D/WireframeObject2D":21,"./objects2D/menuObject2D":22,"./polyfills/animFramePolyfill":43,"./polyfills/bindPolyfill":44,"./polyfills/indexOfPolyfill":45,"./sections/ballSection":46,"./sections/beamsSection":47,"./sections/citySection":48,"./sections/dropSection":49,"./sections/endSection":50,"./sections/faceSection":51,"./sections/flowSection":52,"./sections/galaxySection":53,"./sections/gravitySection":54,"./sections/heightSection":55,"./sections/helloSection":56,"./sections/neonsSection":57,"./sections/rocksSection":58,"./sections/waveSection":59}],8:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var glitch = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 10.0 },
    resolution: { type: 'v2', value: new THREE.Vector2(10, 10) },
    fInverseViewportDimensions: { type: 'v2', value: new THREE.Vector2(10, 10) }
  },
  vertexShader: [

    'void main () {',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'

  ].join('\n'),
  fragmentShader: [

    'float time;',
    'uniform vec2 resolution;',
    'vec2 fInverseViewportDimensions;',

    'vec2 rota (vec2 p, float theta) {',
      'vec2 q;',
      'q.x = cos(theta) * p.x - sin(theta) * p.y;',
      'q.y = sin(theta) * p.y + cos(theta) * p.x;',
      'return q;',
    '}',

    'vec4 ConvertToVPos (vec4 p) {',
      'return vec4(0.5*(vec2(p.x + p.w, p.w - p.y) + p.w * fInverseViewportDimensions.xy), p.zw);',
    '}',

    'void main (void) {',
      'time = 1.0;',
      'vec2 p = (vec2(1, 1).xy / resolution.xy) - 0.5;',

      'for (float i = 0.0; i < 1.0; i++) {',
        'p = rota(p, time + length(p * 0.1) * (20.0 * cos(time * 0.5)));',
        'float s = 2.0;',
        'float dy = 1.0 / (5.0 * abs(p.y * s));',
        'gl_FragColor += vec4(dy * 0.1 * dy, 0.5 * dy, dy, 1.0);',
      '}',
    '}'

  ].join('\n')
});

module.exports = glitch;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var sphereEnvMapShader = new THREE.ShaderMaterial({
  uniforms: {
    map: { type: 't', value: null }
  },
  vertexShader: [

    'varying vec2 vN;',

    'void main() {',
        'vec4 p = vec4( position, 1. );',

        'vec3 e = normalize( vec3( modelViewMatrix * p ) );',
        'vec3 n = normalize( normalMatrix * normal );',

        'vec3 r = reflect( e, n );',
        'float m = 2. * sqrt( ',
            'pow( r.x, 2. ) + ',
            'pow( r.y, 2. ) + ',
            'pow( r.z + 1., 2. ) ',
        ');',
        'vN = r.xy / m + .5;',

        'gl_Position = projectionMatrix * modelViewMatrix * p;',
    '}'

  ].join('\n'),
  fragmentShader: [

    'uniform sampler2D map;',

    'varying vec2 vN;',

    'void main() {    ',
        'vec3 base = texture2D( map, vN ).rgb;',
        'gl_FragColor = vec4( base, 1. );',
    '}'

  ].join('\n')
});

module.exports = sphereEnvMapShader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Basic material that accepts vec4 as vertices colors (rgba).
 *
 * @attribute {Object} [customColor]
 * @attribute {Array} [customColor.value]
 */
var outlineShader = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 1 }
  },
  attributes: {
    customColor: { type: 'v4', value: [] }
  },
  vertexShader: [

    'attribute vec4 customColor;',
    'varying vec4 vColor;',

    'void main () {',
      'vColor = customColor;',
      'gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));',
    '}'

  ].join('\n'),
  fragmentShader: [

    'uniform float time;',
    'varying vec4 vColor;',

    'void main () {',
      'gl_FragColor = vColor;',
      'gl_FragColor.a += sin(time) - time;',
    '}'

  ].join('\n'),
  transparent: true,
  side: THREE.BackSide
});

module.exports = outlineShader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var Events = require('../classes/EventsClass');

/**
 * Handle navigation between heads/tails
 *
 * @module APP
 * @event [heads:visible] Heads is at least partially in the viewport
 * @event [heads:invisible] Heads is completely out of the viewport
 * @requires jQuery, Events
 */
var APP = (function () {
  var instance;

  function init () {
    var events = new Events();

    var $trigger = jQuery('.trigger');
    var $heads = jQuery('.heads');
    var $tails = jQuery('.tails');
    var $infoArrow = $heads.find('.trigger__info--arrow');
    var $infoHeads = $heads.find('.trigger__info--heads');
    var $infoTails = $heads.find('.trigger__info--tails');

    // reset scroll
    jQuery('body').stop().animate({ scrollTop: 0 }, 2000);

    function navigation () {

      var isOpen = false;
      var isSliding = false;

      // Update the location of the trigger area
      function updateTrigger () {
        var properties;

        if (isOpen) {
          properties = { top: 0, bottom: 'auto' };
        } else {
          properties = { top: 'auto', bottom: 0 };
        }

        $trigger.css(properties);
      }

      function open () {
        if (isSliding) {
          return false;
        }

        var to;
        var y;

        if (isOpen) {
          to = 'heads';
          y = -90;
          events.trigger('heads:visible');
        } else {
          to = 'tails';
          y = -10;
          $infoArrow.stop().animate({ opacity: 0, bottom: 20 }, 500);
        }

        var props = { y: y + '%' };

        $heads.stop().animate(props, { duration: 400, easing: 'swing' });
        $tails.stop().animate(props, { duration: 400, easing: 'swing' });
      }

      function close () {
        if (isSliding) {
          return false;
        }

        var to;
        var y;

        if (isOpen) {
          to = 'heads';
          y = -100;
        } else {
          to = 'tails';
          y = 0;
          $infoArrow.stop().animate({ opacity: 0.5, bottom: 0 }, 500);
        }

        var props = { y: y + '%' };

        function onComplete () {
          if (to === 'heads') {
            events.trigger('heads:invisible');
          }
        }
        
        $heads.stop().animate(props, { duration: 400, easing: 'swing' });
        $tails.stop().animate(props, { duration: 400, easing: 'swing', complete: onComplete });
      }

      // Slide between heads and tails 
      function slide (callback) {
        isSliding = true;

        var to;
        var y;
        var durations;

        if (isOpen) {
          to = 'heads';
          y = 0;
          durations = [1050, 1000];
          events.trigger('heads:visible');
          $infoHeads.animate({ opacity: 0 }, 800);
          $infoArrow.stop().animate({ opacity: 0.5, bottom: 0 }, 500);
        } else {
          to = 'tails';
          y = -100;
          durations = [1000, 1050];
          $infoTails.animate({ opacity: 0 }, 800);
        }

        events.trigger('slideBegin', { to: to });

        var props = { y: y + '%' };

        function onComplete () {
          isSliding = false;

          events.trigger('slideComplete', { to: to });

          if (to === 'tails') {
            events.trigger('heads:invisible');

            $infoHeads.css('opacity', 1);
          } else {
            $infoTails.css('opacity', 1);
          }

          if (callback) {
            callback();
          }
        }

        $heads.stop().animate(props, { duration: durations[0], easing: 'easeInOutCubic' });
        $tails.stop().animate(props, { duration: durations[1], easing: 'easeInOutCubic', complete: onComplete });

        isOpen = !isOpen;

        updateTrigger();
      }

      $trigger.on({
        mouseenter: function () {
          open();
        },
        mouseleave: function () {
          close();
        },
        click: function () {
          slide();
        }
      });

      events.on('endSlide', function () {
        slide(this);
      });

      $infoHeads.css('opacity', 0);
    }

    function setup () {
      navigation();
      return APP.getInstance();
    }

    return {
      /**
       * Start APP
       *
       * @method start
       */
      start: setup,

      /**
       * Listen to APP event bus
       *
       * @method on
       * @param {String} [event]
       * @param {Function} [callback]
       **/
      on: function () {
        events.on.apply(events, arguments);
      },

      /**
       * Trigger slide on APP event bus
       * 
       * @method slide
       **/
      slide: function (callback) {
        events.trigger('endSlide', callback);
      }
    };
  }

  return {
    /**
     * Return APP instance
     *
     * @method getInstance
     * @return {APP}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = APP.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/EventsClass":1}],12:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Extract the current hash
 * and return the corresponding name
 *
 * @module HASH
 * @requires jQuery
 */
var HASH = HASH || (function () {
  var instance = null;

  function init () {
    var agencies = {
      akqa: 'AKQA',
      hki: 'HKI',
      grouek: 'Grouek',
      mediamonks: 'Media Monks',
      soleilnoir: 'Soleil Noir',
      thread: 'Thread',
      ultranoir: 'Ultra Noir'
    };

    function getHash () {
      return window.location.hash.split('#')[1];
    }

    function getAgency (hash) {
      var agency;

      if (hash && agencies[hash]) {
        agency = agencies[hash];
      } else {
        agency = '';
      }

      return agency;
    }

    var hash = getHash();
    var agency = getAgency(hash);

    return {
      hash: hash,
      agency: agency,

      /**
       * Replace all the placeholders by correct agency name
       *
       * @method replacePlaceholders
       */
      replacePlaceholders: function () {
        var $placeholders = jQuery('.placeholder--agency');
        
        $placeholders.each(function () {
          var $placeholder = jQuery(this);

          if ($placeholder.hasClass('placeholder--agency--you')) {
            if (agency !== '') {
              $placeholder.html(agency);
            } else {
              $placeholder.html('you');
            }
          } else {
            if ($placeholder.hasClass('placeholder--agency--capital')) {
              $placeholder.html(agency.toUpperCase());
            } else {
              $placeholder.html(agency);
            }
          }
        });

        var $email = jQuery('.placeholder--email');

        var subject = hash ? '?subject=Hi from ' + agency : '?subject=Hi';
        var body = hash ? '&body=Hi V, we like your work and would love to meet you.' : '&body=Hi V';

        $email.attr('href', [
          'mailto:valentin.marmonier@gmail.com',
          subject,
          body
        ].join(''));
      }
    };
  }

  return {
    /**
     * Get HASH current instance
     *
     * @method getInstance
     * @return {HASH}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = HASH.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SPRITE3D = require('../libs/sprite3DLib');

var SOUNDS = require('../modules/soundsModule');

var Events = require('../classes/EventsClass');

var MapObj = require('../objects2D/MapObject2D');

var BackgroundParticles = require('../objects3D/BackgroundParticlesObject3D');
var BackgroundLines = require('../objects3D/BackgroundLinesObject3D');

/**
 * 3D Scene
 *
 * @module SCENE
 * @event [section:changeBegin]
 * @event [section:changeComplete]
 * @requires jQuery, THREE, TweenLite, SPRITE3D, SOUNDS, Events, MapObj, BackgroundParticles, BackgroundLines
 */
var SCENE = (function () {
  var instance;

  function init () {
    // params
    var parameters = {
      fogColor: '#0a0a0a',
      quality: 1,
      sectionHeight: 50
    };

    // DOM element
    var $viewport;
    var width;
    var height;

    // THREE Scene
    var resolution;
    var renderer;
    var scene;
    var light;
    var camera;
    var frameId;
    var cameraShakeY = 0;

    // mouse
    var mouseX = 0;

    // general
    var isLocked = false; // used to prevent additional event when slide() called from outside
    var isActive;
    var isStarted = false;

    // camera
    var cameraCache = { speed: 0 };
    var isScrolling = false;

    // background lines
    var backgroundLines;

    // sections
    var sections = [];
    var sectionsMap = {}; // map name with index
    var totalSections;
    var currentIndex = 0;
    var previousIndex = 0;
    
    // events
    var events = new Events();

    function navigation () {
      function next () {
        if (currentIndex === totalSections) {
          if (!isLocked) {
            events.trigger('end');  
          }
          
          return false;
        }

        currentIndex++;

        animateCamera(currentIndex);
      }

      function prev () {
        if (currentIndex === 0) {
          return false;
        }

        currentIndex--;

        animateCamera(currentIndex);
      }

      // scroll
      var newDate;
      var oldDate = new Date();
      
      function onScroll (event) {
        newDate = new Date();

        var elapsed = newDate.getTime() - oldDate.getTime();

        // handle scroll smoothing (mac trackpad for instance)
        if (elapsed > 50 && !isScrolling) {
          if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
            next();
          } else {
            prev();
          }
        }

        oldDate = new Date();

        return false;
      }

      function onKeyDown (event) {
        if (!isScrolling && isActive) {
          var keyCode = event.keyCode;
          
          if (keyCode === 40) {
            next();
          } else if (keyCode === 38) {
            prev();
          }
        }
      }

      $viewport.on('DOMMouseScroll mousewheel', onScroll);
      jQuery(document).on('keydown', onKeyDown);
    }

    function setup () {
      if (!$viewport) {
        console.warn('set viewport first');
        return false;
      }

      resolution = parameters.quality;

      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false
      });
      // for transparent bg, also set alpha: true
      // renderer.setClearColor(0x000000, 0);
      renderer.setClearColor('#0a0a0a', 1);
      renderer.setSize(width * resolution, height * resolution);
      $viewport.append(renderer.domElement);

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(parameters.fogColor, 0.01);

      light = new THREE.DirectionalLight('#ffffff', 0.5);
      light.position.set(0.2, 1, 0.5);
      scene.add(light);

      camera = new THREE.PerspectiveCamera(20, width / height, 1, 4000);
      camera.position.set(0, 0, 40);

      function onMouseMove (event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      }

      jQuery(window).on('resize', onResize);
      $viewport.on('mousemove', onMouseMove);

      navigation();
      draw();

      return SCENE.getInstance();
    }

    function setupBackground () {
      // add background particles and lines
      // rangeY based on the size and the number of sections
      var rangeY = [
        parameters.sectionHeight,
        (-sections.length * parameters.sectionHeight) - parameters.sectionHeight
      ];

      var backgroundParticles = new BackgroundParticles({ rangeY: rangeY, count: 1000 });
      scene.add(backgroundParticles.el);

      backgroundLines = new BackgroundLines({ rangeY: rangeY, count: 200 });
      scene.add(backgroundLines.el);
    }

    function draw () {
      SPRITE3D.update();
      render();
      frameId = window.requestAnimationFrame(draw);
    }

    function render () {
      // camera noise
      camera.position.y += Math.cos(cameraShakeY) / 50;
      cameraShakeY += 0.02;

      // mouse camera move
      camera.position.x += ((mouseX * 5) - camera.position.x) * 0.03;

      renderer.render(scene, camera);
    }

    function onResize () {
      width = $viewport.width();
      height = $viewport.height();

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width * resolution, height * resolution);
    }

    function animateCamera (index) {
      // in case goTo is called
      // otherwise navigation set currentIndex
      currentIndex = index;

      var nextPosition = index * -parameters.sectionHeight;
      
      // which way are we animating?
      var way = index < previousIndex ? -1 : 1;

      // event's data
      var data = {
        from: {
          name: sectionsMap[previousIndex],
          index: previousIndex
        },
        to: {
          name: sectionsMap[index],
          index: index
        },
        way: way === -1 ? 'up' : 'down'
      };

      TweenLite.to(camera.position, 1.5, { y: nextPosition, ease: window.Quart.easeInOut,
        onStart: function () {
          isScrolling = true;
          SOUNDS.wind.play();
          events.trigger('section:changeBegin', data);
        },
        onComplete: function () {
          if (previousIndex === index) {
            return false;
          }

          isScrolling = false;
          events.trigger('section:changeComplete', data);
          previousIndex = index;
        }
      });

      TweenLite.to(cameraCache, 1.5, {
        bezier: { type: 'soft', values: [{ speed: 10 }, { speed: 0 }] },
        onUpdate: function () {
          backgroundLines.updateY(this.target.speed);
        }
      });
    }

    return {
      /**
       * Set the SCENE viewport
       *
       * @method setViewport
       * @param {jQuery} [$el] $viewport DOM element
       */
      setViewport: function ($el) {
        $viewport = $el;

        width = $viewport.width();
        height = $viewport.height();

        setup();
      },

      /**
       * Set config
       *
       * @method config
       * @param {Object} [options]
       * @param {String} [options.fogColor='#0a0a0a'] Fog color
       * @param {Number} [options.quality=1] Quality
       * @param {Number} [options.sectionHeight=50] Height of each section
       * @param {Boolean} [screenshot=false] If set on true, press P to output imgData to the console
       */
      config: function (options) {
        parameters = jQuery.extend(parameters, options);
      },

      /**
       * Add sections
       *
       * @method addSections
       * @param {Array} [sections] Array of Sections
       */
      addSections: function (_sections) {
        sections = _sections;
        totalSections = sections.length - 1;

        for (var i = 0, j = sections.length; i < j; i++) {
          var section = sections[i];

          sectionsMap[i] = section.name;

          section.el.position.y = i * -parameters.sectionHeight;
          scene.add(section.el);
        }

        setupBackground();
      },

      /**
       * Listen to SCENE event bus
       *
       * @method on
       * @param {String} [event]
       * @param {Function} [callback]
       **/
      on: function () {
        events.on.apply(events, arguments);
      },

      /**
       * Animate camera to section
       *
       * @method goTo
       * @param {Number} [index] Section's index
       */
      goTo: function (index) {
        if (index === currentIndex) {
          return false;
        }

        animateCamera(index);
      },

      /**
       * Get SCENE map
       *
       * @method getMap
       * @return {Map}
       */
      getMap: function () {

        var map = new MapObj();

        for (var i = 0, j = sections.length; i < j; i++) {
          map.addNode(i);
        }

        return map;
      },

      /**
       * Start drawing loop
       *
       * @method stop
       */
      start: function () {
        isActive = true;

        if (!isStarted) {
          // first event
          var data = {
            from: {
              name: sectionsMap[previousIndex],
              index: previousIndex
            },
            to: {
              name: sectionsMap[currentIndex],
              index: currentIndex
            },
            way: 'down'
          };

          events.trigger('section:changeBegin', data);

          isStarted = true;
        }

        if (!frameId) {
          draw();
        }
      },

      /**
       * Stop drawing loop
       *
       * @method stop
       */
      stop: function () {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = undefined;
          isActive = false;
        }
      },

      /**
       * Set scene quality
       *
       * @method quality
       * @param {Number} [ratio]
       */
      quality: function (value) {
        resolution = value;
        renderer.setSize(width * resolution, height * resolution);
      },

      /**
       * Return current scene quality
       *
       * @method getQuality
       * @return {Number}
       */
      getQuality: function () {
        return resolution;
      },

      /**
       * Lock scene (forbid triggering end event)
       *
       * @method lock
       */
      lock: function () {
        isLocked = true;
      },

      /**
       * Unlock scene (allow triggering end event)
       *
       * @method unlock
       */
      unlock: function () {
        isLocked = false;
      },

      /**
       * in animation
       *
       * @method in
       */
      in: function () {
        TweenLite.to({ fov: 200, speed: 0 }, 2, {
          bezier: { type: 'soft', values: [{ speed: 20 }, { speed: 0 }]},
          fov: 60,
          ease: 'easeOutCubic',
          onUpdate: function () {
            backgroundLines.updateZ(this.target.speed);
            camera.fov = this.target.fov;
            camera.updateProjectionMatrix();
          }
        });
      }
    };
  }

  return {
    /**
     * Return SCENE instance
     *
     * @method getInstance
     * @return {SCENE}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = SCENE.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/EventsClass":1,"../libs/sprite3DLib":5,"../modules/soundsModule":14,"../objects2D/MapObject2D":19,"../objects3D/BackgroundLinesObject3D":23,"../objects3D/BackgroundParticlesObject3D":24}],14:[function(require,module,exports){
(function (global){
'use strict';

var Howler = (typeof window !== "undefined" ? window['Howler'] : typeof global !== "undefined" ? global['Howler'] : null);
var Howl = (typeof window !== "undefined" ? window['Howl'] : typeof global !== "undefined" ? global['Howl'] : null);
var visibly = (typeof window !== "undefined" ? window['visibly'] : typeof global !== "undefined" ? global['visibly'] : null);

/**
 * Sounds module
 *
 * @module SOUNDS
 * @requires Howler, visibly
 */
var SOUNDS = (function () {
  var instance;

  function init () {

    var isMuted = false;

    return {
      /**
       * Toggle on/off sounds
       *
       * @method toogle
       */
      toggle: function () {
        if (isMuted) {
          Howler.unmute();
        } else {
          Howler.mute();
        }

        isMuted = !isMuted;
      },

      /**
       * Is muted
       * @method isMuted
       * @return {Boolean}
       */
      isMuted: function () {
        return Howler._muted;
      },

      background: new Howl({
        urls: [
          './app/public/sounds/background.mp3',
          './app/public/sounds/background.ogg',
          './app/public/sounds/background.wav'
        ],
        loop: true,
        volume: 0.5
      }),
      wind: new Howl({
        urls: [
          './app/public/sounds/wind.mp3',
          './app/public/sounds/wind.ogg',
          './app/public/sounds/wind.wav'
        ]
      }),
      whitenoise: new Howl({
        urls: [
          './app/public/sounds/whitenoise.mp3',
          './app/public/sounds/whitenoise.ogg',
          './app/public/sounds/whitenoise.wav'
        ],
        volume: 0.05
      }),
      neon: new Howl({
        urls: [
          './app/public/sounds/neon.mp3',
          './app/public/sounds/neon.ogg',
          './app/public/sounds/neon.wav'
        ],
        volume: 0.05
      })
    };
  }

  return  {
    /**
     * Return SOUNDS instance
     *
     * @method getInstance
     * @return {SOUNDS}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

// tab active/inactive
visibly.onHidden(function () {
  Howler.mute();
});

visibly.onVisible(function () {
  Howler.unmute();
});

module.exports = SOUNDS.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var Slider = require('../libs/sliderLib');

var Layout = require('../objects2D/LayoutObject2D');
var Mouse = require('../objects2D/MouseObject2D');
var Keys = require('../objects2D/KeysObject2D');

/**
 * Help overlay
 *
 * @class Help
 * @constructor
 * @requires jQuery, Sider, Layout, Mouse, Keys
 */
function Help () {
  this.$el = jQuery('.help');
  this.slider = new Slider(this.$el.find('.slider'));

  this.keys = new Keys(this.$el.find('.keys'));
  this.mouse = new Mouse(this.$el.find('.mouse'));
  this.layout = new Layout(this.$el.find('.layout'));
}

/**
 * In animation
 *
 * @method in
 */
Help.prototype.in = function () {
  this.$el.css({ display: 'block', opacity: 0 });

  this.slider.start();

  this.slider.$el.delay(100).css({ top: '60%', opacity: 0 })
    .animate({ top: '50%', opacity: 1 }, 500);

  this.$el.stop().animate({ opacity: 0.9 }, 500, function () {
    this.keys.start();
    this.mouse.start();
    this.layout.start();
  }.bind(this));

  this.$el.on('click', function (event) {
    if (event.target === this) {
      this.out();
    }
  }.bind(this));

  this.$el.find('.help__quit').on('click', function () {
    this.out();
  }.bind(this));
};

/**
 * Out animation
 *
 * @method out
 */
Help.prototype.out = function () {
  this.$el.stop().animate({ opacity: 0 }, 500, function () {
    this.$el.css('display', 'none');

    this.slider.stop();

    this.keys.stop();
    this.mouse.stop();
    this.layout.stop();
  }.bind(this));

  this.$el.off('click');
  this.$el.find('.help__quit').off('click');
};

module.exports = Help;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/sliderLib":4,"../objects2D/KeysObject2D":16,"../objects2D/LayoutObject2D":17,"../objects2D/MouseObject2D":20}],16:[function(require,module,exports){
'use strict';

/**
 * Animated keyboard keys
 *
 * @class Keys
 * @constructor
 * @requires jQuery
 */
function Keys ($el) {
  this.$el = $el;

  this.$top = this.$el.find('.key--top');
  this.$bottom = this.$el.find('.key--bottom');

  this.interval = null;
  this.current = 'top';
}

/**
 * Hightlight a key
 *
 * @method highlight
 */
Keys.prototype.highlight = function () {
  this.current = this.current === 'top' ? 'bottom' : 'top';
  var $el = this.current === 'top' ? this.$top : this.$bottom;

  $el.stop().animate({
      opacity: 1
    }, 400, function () {
      $el.stop().animate({
        opacity: 0.2
      }, 300);
  });
};

/**
 * Start animation
 *
 * @method start
 */
Keys.prototype.start = function () {
  this.interval = window.setInterval(function () {
    this.highlight();
  }.bind(this), 1000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Keys.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Keys;
},{}],17:[function(require,module,exports){
'use strict';

/**
 * Animated layout
 *
 * @class Layout
 * @constructor
 * @requires jQuery
 */
function Layout ($el) {
  this.$el = $el;

  this.$container = this.$el.find('.layout__parts');
  this.$mouse = this.$el.find('.layout__mouse');
  this.$click = this.$mouse.find('.layout__mouse__click');

  // targets
  this.y = 0;
  this.openY = -15;
  this.mouseY = 90;

  this.interval = null;
}

/**
 * Animation next step
 *
 * @method slide
 */
Layout.prototype.slide = function () {
  // update targets
  if (this.y === 0) {
    this.y = -100;
    this.openY = -15;
    this.mouseY = 83;
  } else {
    this.y = 0;
    this.openY = -85;
    this.mouseY = 3;
  }

  var open = function () {
    this.$container.animate({
      'top': this.openY + '%'
    }, 800, function () {
      click();
    });
  }.bind(this);

  var moveMouse = function () {
    var flag = false;

    this.$mouse.animate({
      'top': this.mouseY + '%'
    }, {
      duration: 500,
      progress: function (animation, progress) {
        if (!flag && progress > 0.5) {
          flag = !flag;
          open();
        }
      }
    });
  }.bind(this);

  var click = function () {
    var flag = false;

    this.$click.delay(500).animate({
      'width': 70,
      'height': 70,
      'margin-left': -35,
      'margin-top': -35,
      'opacity': 0
    }, {
      duration: 400,
      progress: function (animation, progress) {
        if (!flag && progress > 0.7) {
          flag = !flag;
          slide();
        }
      },
      complete: function () {
        this.$click.css({
          'width': 0,
          'height': 0,
          'margin-left': 0,
          'margin-top': 0,
          'opacity': 1
        }.bind(this));
      }
    });
  }.bind(this);

  var slide = function () {
    this.$container.animate({
      'top': this.y + '%'
    }, 500);

    centerMouse();
  }.bind(this);

  var centerMouse = function () {
    this.$mouse.delay(300).animate({
      'top': '45%'
    }, 500);
  }.bind(this);

  moveMouse();
};

/**
 * Start animation
 *
 * @method start
 */
Layout.prototype.start = function () {
  this.slide();

  this.interval = window.setInterval(function () {
    this.slide();
  }.bind(this), 4000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Layout.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Layout;
},{}],18:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Preloader
 *
 * @class Loader
 * @constructor
 * @requires jQuery
 */
function Loader () {
  this.$el = jQuery('.loader');
  this.$title = this.$el.find('.loader__title');
  this.$progress = this.$el.find('.loader__progress');
}

/**
 * Out animation
 *
 * @method out
 */
Loader.prototype.out = function () {
  this.$progress.stop().animate({ width: '100%' }, 1000, function () {
    this.$el.animate({ opacity: 0 }, 1000, function () {
      this.$el.css('display', 'none');
    }.bind(this));

    this.$title.animate({ top: '-10%', opacity: 0 }, 500);
    this.$progress.animate({ height: 0 }, 400);
  }.bind(this));
};

/**
 * Update the percent loaded
 *
 * @method update
 * @param {Number} [percent]
 */
Loader.prototype.update = function () {};

module.exports = Loader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Navigation Map
 *
 * @class Map
 * @constructor
 * @requires jQuery
 */
function Map () {
  this.$el = jQuery('<div class="map"></div>');
  this.$nodes = null;
  this.callback = function () {};
}

/**
 * Default node
 * 
 * @property $node
 */
Map.prototype.$node = jQuery('<div class="map__node"></div>');

/**
 * Add a new node
 *
 * @method addNode
 * @param {Number} [index]
 */
Map.prototype.addNode = function (index) {
  var $node = this.$node.clone();
  $node.attr('data-index', index);
  
  this.$el.append($node);
};

/**
 * Initialize
 *
 * @method init
 */
Map.prototype.init = function () {
  var _this = this;

  // event
  this.$el.on('click', '.map__node', function () {
    var index = jQuery(this).data('index');
    _this.callback(index);
  });

  // center
  this.$el.css('margin-top', - this.$el.height() / 2);

  // nodes
  this.$nodes = this.$el.find('.map__node');
};

/**
 * Set onClick callback
 *
 * @method onClick
 * @param {Function} [callback]
 */
Map.prototype.onClick = function (callback) {
  this.callback = callback;
};
  
/**
 * Set active node (.is-active)
 *
 * @method setActive
 * @param {Number} [index]
 */
Map.prototype.setActive = function (index) {
  this.$nodes.removeClass('is-active');
  jQuery(this.$nodes[index]).addClass('is-active');
};

/**
 * In animation
 *
 * @method in
 */
Map.prototype.in = function () {
  this.$nodes.each(function (i) {
    jQuery(this).delay(i * 50).animate({ right: 0, opacity: 1 }, 500);
  });
};

module.exports = Map;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],20:[function(require,module,exports){
'use strict';

/**
 * Animated mouse
 *
 * @class Mouse
 * @constructor
 * @requires jQuery
 */
function Mouse ($el) {
  this.$el = $el;

  this.$wheel = this.$el.find('.mouse__wheel');
  this.$lines = this.$wheel.find('.mouse__wheel__lines');

  this.interval = null;
  this.y = 0;
}

/**
 * Animate wheel
 *
 * @method scroll
 */
Mouse.prototype.scroll = function () {
  this.y = this.y === 0 ? -80 : 0;

  this.$wheel.stop().animate({ opacity: 1 }, 400);

  var y = this.y;

  this.$lines.stop().animate({
      top: y + '%'
    }, 500, function () {
      this.$wheel.stop().animate({
        opacity: 0.2
      }, 300);
  }.bind(this));
};

/**
 * Start animation
 *
 * @method start
 */
Mouse.prototype.start = function () {
  this.interval = window.setInterval(function () {
    this.scroll();
  }.bind(this), 2000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Mouse.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Mouse;
},{}],21:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Animated wireframe
 *
 * @class Wireframe
 * @constructor
 * @param {jQuery} [$el] DOM element
 * @param {Object} [options]
 * @param {Number} [options.delay] Delay between frames
 * @param {Array} [options.positions] Animated scroll positions
 * @requires jQuery
 */
function Wireframe ($el, options) {
  this.parameters = jQuery.extend({
    delay: 200,
    positions: [-20, -90, -135, -200, -20, 40]
  }, options);

  this.$topLines = $el.find('.wireframe__frame--top');
  this.$bottomLines = $el.find('.wireframe__frame--bottom');
  this.$leftLines = $el.find('.wireframe__frame--left');
  this.$rightLines = $el.find('.wireframe__frame--right');
  this.$leftColumn = $el.find('.wireframe__column--left');
  this.$textLines = $el.find('.wireframe__text__line');
  this.$controlNodes = $el.find('.wireframe__controls__node');

  this.interval = null;
  this.totalPositions = this.parameters.positions.length;
  this.currentPosition = 0;
}

/**
 * In animation
 *
 * @method in
 * @param {Boolean} [out] Out instead of in?
 */
Wireframe.prototype.in = function (out) {
  // targets
  var targetLines;
  var targetTextLines;
  var targetIncompleteTextLines;
  var targetNodes;

  if (out === 0) {
    targetLines = targetTextLines = targetIncompleteTextLines = 0;
    targetNodes = 30;
  } else {
    targetLines = targetTextLines = '100%';
    targetIncompleteTextLines = '60%';
    targetNodes = 0;
  }

  // frames
  var totalFrames = this.$topLines.length;

  var setAnimation = function (index) {
    var $top = jQuery(this.$topLines[index]);
    var $bottom = jQuery(this.$bottomLines[index]);
    var $left = jQuery(this.$leftLines[index]);
    var $right = jQuery(this.$rightLines[index]);

    setTimeout(function () {
      $top.css('width', targetLines);
      $right.css('height', targetLines);
    }, (index * this.parameters.delay) + 400);

    setTimeout(function () {
      $left.css('height', targetLines);
      $bottom.css('width', targetLines);
    }, (index * this.parameters.delay) + 600);
  }.bind(this);

  // set animations for each frame
  for (var i = 0; i < totalFrames; i++) {
    setAnimation(i);
  }

  // text
  var delay = this.parameters.delay;

  this.$textLines.each(function (i) {
    var $line = jQuery(this);

    setTimeout(function () {
      $line.css('width', $line.hasClass('wireframe__text__line--incomplete')
        ? targetIncompleteTextLines
        : targetTextLines);
      
    }, i * delay);
  });

  // control nodes
  this.$controlNodes.each(function (i) {
    var $node = jQuery(this);

    setTimeout(function () {
      $node.css('top', targetNodes);
    }, i * delay);
  });
};

/**
 * Out animation
 *
 * @method out
 */
Wireframe.prototype.out = function () {
  this.$topLines.css('width', 0);
  this.$bottomLines.css('width', 0);
  this.$leftLines.css('height', 0);
  this.$rightLines.css('height', 0);
  this.$textLines.css('width', 0);
  this.$controlNodes.css('top', 30);
};

/**
 * Start animation
 *
 * @method start
 */
Wireframe.prototype.start = function () {
  if (this.interval) {
    return false;
  }

  this.interval = setInterval(function () {
    if (this.currentPosition > this.totalPositions) {
      this.currentPosition = 0;
    }

    this.$leftColumn.css('top', this.parameters.positions[this.currentPosition] + 'px');

    this.currentPosition++;
  }.bind(this), 2000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Wireframe.prototype.stop = function () {
  if (!this.interval) {
    return false;
  }

  window.clearInterval(this.interval);
  this.interval = null;
};

module.exports = Wireframe;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Menu
 *
 * @class Menu
 * @constructor
 * @requires jQuery
 */
function Menu () {
  var $el = jQuery('.menu');
  var $button = $el.find('.menu__button');
  var $itemsContainer = $el.find('.menu__items');
  var $items = $el.find('.menu__item');

  var _callback = function () {};
  var timeouts = [];

  function onMouseover () {
    $items.on('click', _callback);

    $itemsContainer.css('display', 'block');

    $el.stop().animate({ left: 0 }, { duration: 400, easing: 'easeOutQuart' });
    $button.stop().animate({ opacity: 0 }, 400);

    $items.each(function (i) {
      var $el = jQuery(this);

      var timeout = window.setTimeout(function () {
        $el.stop().animate({ opacity: 1 }, 400);
      }, i * 200);

      timeouts.push(timeout);
    });

    $el.one('mouseleave', onMouseout);
  }

  function onMouseout () {
    if (timeouts) {
      for (var i = 0, j = timeouts.length; i < j; i++) {
        window.clearTimeout(timeouts[i]);
      }
      timeouts = [];
    }

    $el.stop().animate({ left: 30 }, { duration: 400, easing: 'easeOutQuart' });
    $button.stop().animate({ opacity: 0.5 }, 400);
    $items.stop().animate({ opacity: 0 }, 400, function () {
      $itemsContainer.css('display', 'none');
      $items.off('click', _callback);
    });

    $button.one('mouseover click', onMouseover);
  }

  $button.one('mouseover click', onMouseover);

  return {
    in: function () {
      $el.animate({ top: 0, opacity: 1 }, 500);
    },

    onClick: function (callback) {
      _callback = callback;
    }
  };
}

module.exports = Menu;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],23:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var random = require('../utils/randomUtil');

/**
 * Background floating lines
 *
 * @class BackgroundLines
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.count=200] Number of lines
 * @param {Array} [options.rangeY=[-100, 100]] Y range for the random
 * @requires jQuery, THREE, random
 */
function BackgroundLines (options) {
  var parameters = jQuery.extend(BackgroundLines.defaultOptions, options);

  var group = new THREE.Object3D();

  var line = this.getLine();

  for (var i = 0; i < parameters.count; i++) {
    var lineCopy = line.clone();

    lineCopy.position.x = random(-20, 20);
    lineCopy.position.y = random(parameters.rangeY[0], parameters.rangeY[1]);
    lineCopy.position.z = random(-50, 50);

    group.add(lineCopy);
  }

  this.el = group;
  this.line = line;
}

BackgroundLines.defaultOptions = {
  count: 200,
  rangeY: [-100, 100]
};

/**
 * Get base line
 *
 * @method getLine
 * @return {THREE.Line} 
 */
BackgroundLines.prototype.getLine = function () {
  var material = new THREE.LineBasicMaterial();

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0.2, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));

  var line = new THREE.Line(geometry, material);

  return line;  
};

/**
 * Update lines Y size
 *
 * @method updateY
 * @param {Number} [speed]
 */
BackgroundLines.prototype.updateY = function (speed) {
  this.line.geometry.vertices[0].y = speed + 0.2;
  this.line.geometry.verticesNeedUpdate = true;
  this.line.geometry.computeBoundingSphere();
};

/**
 * Update lines Z size
 *
 * @method updateZ
 * @param {Number} [speed]
 */
BackgroundLines.prototype.updateZ = function (speed) {
  this.line.geometry.vertices[0].z = speed;
  this.line.geometry.verticesNeedUpdate = true;
  this.line.geometry.computeBoundingSphere();
};

module.exports = BackgroundLines;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/randomUtil":65}],24:[function(require,module,exports){
(function (global){
/* jshint shadow: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var random = require('../utils/randomUtil');

/**
 * Background floating particles/strips
 *
 * @class BackgroundParticles
 * @constructor
 * @param {Object} [options]
 * @param {Object} [strips=true] Strips?
 * @param {Number} [options.count=1000] Number of particles
 * @param {Number} [options.particleSize=0.5] Size of a particle
 * @param {Array} [options.rangeY=[-100, 100]] Y range for positions
 * @requires jQuery, THREE, random
 */
function BackgroundParticles (options) {
  var parameters = jQuery.extend(BackgroundParticles.defaultOptions, options);

  var material = new THREE.PointCloudMaterial({
    size: parameters.particleSize
  });

  var geometry = new THREE.Geometry();

  for (var i = 0; i < parameters.count; i++) {
    var particle = new THREE.Vector3(
      random(-50, 50),
      random(parameters.rangeY[0], parameters.rangeY[1]),
      random(-50, 100)
    );

    geometry.vertices.push(particle);
  }

  var group = new THREE.Object3D();

  group.add(new THREE.PointCloud(geometry, material));
  
  if (parameters.strips) {
    var stripsGeometry = new THREE.Geometry();

    var stripGeometry = new THREE.PlaneGeometry(5, 2);
    var stripMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });

    for (var i = 0; i < parameters.stripsCount; i++) {
      var stripMesh = new THREE.Mesh(stripGeometry, stripMaterial);
      stripMesh.position.set(
        random(-50, 50),
        random(parameters.rangeY[0], parameters.rangeY[1]),
        random(-50, 0)
      );

      stripMesh.scale.set(
        random(0.5, 1),
        random(0.1, 1),
        1
      );

      stripMesh.updateMatrix();
      stripsGeometry.merge(stripMesh.geometry, stripMesh.matrix);
    } 

    var totalMesh = new THREE.Mesh(stripsGeometry, stripMaterial);

    group.add(totalMesh);
  }

  this.el = group;
}

BackgroundParticles.defaultOptions = {
  count: 1000,
  particleSize: 0.5,
  rangeY: [-100, 100],
  strips: true,
  stripsCount: 20
};

module.exports = BackgroundParticles;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/randomUtil":65}],25:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SOUNDS = require('../modules/soundsModule');
var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');
var glitchMaterial = require('../materials/glitchMaterial');

/**
 * Animated ball
 *
 * @class Ball
 * @constructor
 * @requires THREE, TweenLite, SOUNDS, random, yoyo, glitchMaterial
 */
function Ball () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-ball.png');
  var textureAlpha = THREE.ImageUtils.loadTexture('./app/public/img/texture-ballAlpha.png');
  texture.wrapS = textureAlpha.wrapS = THREE.RepeatWrapping;
  texture.wrapT = textureAlpha.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = textureAlpha.repeat.x = 0;
  texture.repeat.y = textureAlpha.repeat.y = 0;

  var materialStripe = new THREE.MeshLambertMaterial({
    map: texture,
    color: '#ffffff',
    emissive: '#0a0a0a',
    depthWrite: false,
    depthTest: true,
    transparent: true
  });

  var geometry = new THREE.SphereGeometry(10, 30, 30);

  var mesh = new THREE.Mesh(geometry, materialStripe);

  var colorA = new THREE.Color('#000000');
  var colorB = new THREE.Color('#ffffff');

  // Make the ball blink once
  function blink () {
    materialStripe.emissive = colorB;
    materialStripe.color = colorA;

    TweenLite.delayedCall(random(0.1, 1), function () {
      materialStripe.emissive = colorA;
      materialStripe.color = colorB;
    });
  }

  // Make the ball glitch once
  function glitch () {
    mesh.material = glitchMaterial;

    SOUNDS.whitenoise.play();

    TweenLite.delayedCall(random(0.2, 1), function () {
      mesh.material = materialStripe;
      SOUNDS.whitenoise.stop();
    });
  }
  
  var inTween = TweenLite.to({ y: 40, opacity: 0 }, 1.5, { y: 0, opacity: 1, paused: true,
    onUpdate: function () {
      mesh.position.y = this.target.y;
      materialStripe.opacity = this.target.opacity;  
    }
  });

  var appearTweenSteps = 6;
  var appearTweenCurrent = 0;
  var repeatValues = [1, 10, 30, 0, 1, 5];

  var appearTween = TweenLite.to({}, 0.1, { paused: true,
      onComplete: function () {
        appearTweenCurrent++;

        if (appearTweenCurrent < appearTweenSteps) {
          mesh.material.map = textureAlpha;
          textureAlpha.repeat.set(1, repeatValues[appearTweenCurrent]);

          this.duration(0.2);
          this.restart();
        } else {
          mesh.material.map = texture;
          appearTweenCurrent = 0;
        }
      }
    });

  var rotateY = 0;
  var rotateX = 0;

  var idleTweens = {
    rotate: TweenLite.to({ textureRepeat: 3 }, 5, { textureRepeat: 8, paused: true,
        onUpdate: function () {
          texture.repeat.set(1, this.target.textureRepeat);

          mesh.rotation.y = rotateY;
          mesh.rotation.x = rotateX;

          rotateY += 0.01;
          rotateX += 0.02;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      }),

    glitch: TweenLite.to({}, random(0.1, 5), { paused: true,
        onComplete: function () {
          glitch();
          this.duration(random(0.1, 5));
          this.restart();
        }
      }),

    blink: TweenLite.to({}, random(0.1, 5), { paused: true,
        onComplete: function () {
          blink();
          this.duration(random(0.1, 5));
          this.restart();
        }
      })
  };

  this.el = mesh;

  this.in = function () {
    inTween.play();
    appearTween.restart();
  };

  this.out = function () {
    inTween.reverse();
  };

  this.start = function () {
    idleTweens.rotate.resume();
    // idleTweens.glitch.resume();
    idleTweens.blink.resume();
  };

  this.stop = function () {
    idleTweens.rotate.pause();
    // idleTweens.glitch.pause();
    idleTweens.blink.pause();
  };
}

module.exports = Ball;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../materials/glitchMaterial":8,"../modules/soundsModule":14,"../utils/randomUtil":65,"../utils/yoyoUtil":66}],26:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');

/**
 * Light beam
 *
 * @class Beam
 * @constructor
 * @param {Object} [options]
 * @param {String} [options.color='#ffffff'] Beam color
 * @param {Number} [options.height=15] Beam expanded height
 * @param {Number} [options.width=2] Beam width
 * @param {Number} [options.cubeSize=0.5] Extremity cube size
 * @param {Number} [options.delay=0] Animations delay
 * @requires jQuery, THREE, TweenLite, random, yoyo
 */
function Beam (options) {
  var parameters = jQuery.extend(Beam.defaultOptions, options);

  var width = parameters.width;
  var height = parameters.height;

  var group = new THREE.Object3D();

  var baseMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    color: parameters.color
  });

  var bodyTexture = THREE.ImageUtils.loadTexture('./app/public/img/texture-laserBody.png');
  var capTexture = THREE.ImageUtils.loadTexture('./app/public/img/texture-laserCap.png');
  var flareTexture = THREE.ImageUtils.loadTexture('./app/public/img/texture-laserFlare.png');

  var lineMaterial = new THREE.LineBasicMaterial({ color: parameters.color });
  var bodyMaterial = baseMaterial.clone();
  var capMaterial = baseMaterial.clone();
  var flareMaterial = baseMaterial.clone();
  var cubeMaterial = baseMaterial.clone();

  bodyMaterial.map = bodyTexture;
  capMaterial.map = capTexture;
  flareMaterial.map = flareTexture;

  var bodyGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
  var capGeometry = new THREE.PlaneGeometry(width, width, 1, 1);
  var flareGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
  var movingFlareGeometry = new THREE.PlaneGeometry(10, 40);
  var cubeGeometry = new THREE.BoxGeometry(
    parameters.cubeSize,
    parameters.cubeSize,
    parameters.cubeSize
  );

  // set height 0
  bodyGeometry.vertices[2].y = bodyGeometry.vertices[3].y = (height / 2) + (width / 2);
  bodyGeometry.verticesNeedUpdate = true;
  bodyGeometry.computeBoundingSphere();

  var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  var capMeshTop = new THREE.Mesh(capGeometry, capMaterial);
  var capMeshBottom = capMeshTop.clone();
  var flareMesh = new THREE.Mesh(flareGeometry, flareMaterial);
  var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  bodyMesh.position.y = 0;
  capMeshTop.position.y = (height / 2) + (width / 2);
  capMeshBottom.position.y = -(height / 2) - (width / 2);
  capMeshBottom.rotation.z = Math.PI;
  flareMesh.position.y = -(height / 2) - (width / 2);

  // line
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(new THREE.Vector3(0, (height / 2) + (width / 2), 0));
  lineGeometry.vertices.push(new THREE.Vector3(0, (height / 2) + (width / 2), 0));

  var lineMesh = new THREE.Line(lineGeometry, lineMaterial);

  group.add(lineMesh);

  // body 
  var body = new THREE.Object3D();

  var bodyPlane = new THREE.Object3D();

  bodyPlane.add(bodyMesh);
  bodyPlane.add(capMeshTop);
  bodyPlane.add(capMeshBottom);

  body.add(bodyPlane);

  group.add(body);

  // flare
  group.add(flareMesh);

  // moving flare
  var movingFlareMaterial = flareMaterial.clone();
  var movingFlareMesh = new THREE.Mesh(movingFlareGeometry, movingFlareMaterial);
  movingFlareMesh.scale.x = 3;
  group.add(movingFlareMesh);

  // cube group
  var cubeGroup = new THREE.Object3D();
  cubeGroup.add(cubeMesh);
  cubeGroup.add(movingFlareMesh);
  group.add(cubeGroup);

  // animations
  var cache = { y: (height / 2) + (width / 2) };

  function positionUpdate () {
    /*jshint validthis: true */
    
    var extremity = this.target.y - (width /2);

    lineGeometry.vertices[1].y = extremity;
    lineGeometry.verticesNeedUpdate = true;
    lineGeometry.computeBoundingSphere();

    bodyGeometry.vertices[2].y = bodyGeometry.vertices[3].y = this.target.y;
    bodyGeometry.verticesNeedUpdate = true;
    bodyGeometry.computeBoundingSphere();

    capMeshBottom.position.y = extremity;

    flareMesh.position.y = extremity;
    cubeGroup.position.y = extremity;
  }

  var idleTweens = {
    flare: TweenLite.to({ scale: 1, opacity: 1 }, random(1, 2), { scale: 2, opacity: 0.6, paused: true,
        onUpdate: function () {
          flareMesh.scale.set(this.target.scale, this.target.scale, 1);
          flareMaterial.opacity = this.target.opacity;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      }),

    movingflare: TweenLite.to({ y: 0, scale: 3, opacity: 1 }, random(2, 6), { y: 30, scale: 1, opacity: 0, paused: true,
        onUpdate: function () {
          movingFlareMesh.position.y = this.target.y;
          movingFlareMesh.scale.x = this.target.scale;
          movingFlareMaterial.opacity = this.target.opacity;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      }),

    body: TweenLite.to({ opacity: 1 }, random(1, 2), { opacity: 0.5,
        onUpdate: function () {
          bodyMaterial.opacity = capMaterial.opacity = this.target.opacity;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      })
  };

  this.el = group;

  var delay = parameters.delay;

  this.in = function () {
    TweenLite.to(cache, 1, { y: -5, delay: delay, onUpdate: positionUpdate });
  };

  this.out = function (way) {
    var y = way === 'up' ? ((height / 2) + (width / 2)) - 1 : -70;
    TweenLite.to(cache, 1, { y: y, delay: delay, onUpdate: positionUpdate });
  };

  this.start = function () {
    idleTweens.flare.resume();
    idleTweens.movingflare.resume();
    idleTweens.body.resume();
  };

  this.stop = function () {
    idleTweens.flare.pause();
    idleTweens.movingflare.pause();
    idleTweens.body.pause();
  };
}

Beam.defaultOptions = {
  color: '#ffffff',
    height: 15,
    width: 2,
    cubeSize: 0.5,
    delay: 0
  };

module.exports = Beam;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/randomUtil":65,"../utils/yoyoUtil":66}],27:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var dilate = require('../utils/dilateUtil');

var outlineMaterial = require('../materials/outlineMaterial');

function City () {
  this.el = new THREE.Object3D();

  this.groups = {};
  this.baseMaterial = new THREE.MeshLambertMaterial({ color: '#333333' });

  this.loader = new THREE.JSONLoader();
}

City.prototype.addGroup = function (data) {
  if (!this.groups[data.name]) {
    this.groups[data.name] = new THREE.Object3D();
  }

  if (!data.outline) {
    data.outline = {};
  }

  var groupName = data.name;

  for (var objName in data.objs) {
    if (data.objs.hasOwnProperty(objName)) {
      var url = data.objs[objName];

      if (!data.outline[objName]) {
        data.outline[objName] = {};
      }

      var isSolid = data.outline[objName].solid ? true : false;
      var offset = data.outline[objName].offset
        ? data.outline[objName].offset
        : 0.15;

      this.loadObj(groupName, url, offset, isSolid);
    }
  }
};

City.prototype.loadObj = function (groupName, url, offset, isSolid) {
  var _this = this;

  this.loader.load(url, function (geometry) {
    _this.processObj({
      geometry: geometry,
      group: groupName,
      offset: offset,
      solid: isSolid
    });
  });
};

City.prototype.processObj = function (data) {
  var groupName = data.group;
  var geometry = data.geometry;

  var mesh = new THREE.Mesh(geometry, this.baseMaterial);

  this.groups[groupName].add(mesh);

  var outlineGeometry = geometry.clone();
  dilate(outlineGeometry, data.offset);

  var localOutlineMaterial = outlineMaterial.clone();
  localOutlineMaterial.uniforms = THREE.UniformsUtils.clone(outlineMaterial.uniforms);
  localOutlineMaterial.attributes = THREE.UniformsUtils.clone(outlineMaterial.attributes);

  var outlineMesh = new THREE.Mesh(outlineGeometry, localOutlineMaterial);

  outlineGeometry.computeBoundingBox();
  var height = outlineGeometry.boundingBox.max.y - outlineGeometry.boundingBox.min.y;

  for (var i = 0, j = outlineGeometry.vertices.length; i < j; i++) {
    var color;

    if (data.solid) {
      color = new THREE.Vector4(0.7, 0.7, 0.7, 1.0);
    } else {
      var vertex = outlineGeometry.vertices[i];
      var percent = Math.floor(vertex.y * 100 / height) - 10;
      color = new THREE.Vector4(0.7, 0.7, 0.7, percent / 100);
    }

    localOutlineMaterial.attributes.customColor.value[i] = color;
  }

  this.groups[groupName].add(outlineMesh);
};

City.prototype.showGroup = function (name) {
  this.el.add(this.groups[name]);
};

module.exports = City;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../materials/outlineMaterial":10,"../utils/dilateUtil":61}],28:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var loop = require('../utils/loopUtil');

/**
 * Animated water ripple
 *
 * @class Drop
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.count=6] Rings number
 * @param {String} [options.color='#ffffff'] Rings color
 * @param {Number} [options.amplitude=2] Rings max expanded amplitude 
 * @requires jQuery, THREE, TweenLite, loop
 */
function Drop (options) {
  this.parameters = jQuery.extend(Drop.defaultOptions, options);

  var group = new THREE.Object3D();

  var plane = this.getPlane();

  var caches = [];
  var idleTweens = [];

  for (var i = 0; i < this.parameters.count; i++) {
    var planeCopy = plane.clone();
    planeCopy.material = planeCopy.material.clone();

    var tween = this.getTween(planeCopy, i);
    var cache = { duration: (10 + i) / 10, z: (this.parameters.count - i) * 5 };

    group.add(planeCopy);
    caches.push(cache);
    idleTweens.push(tween);
  }

  this.el = group;

  this.in = function () {
    for (var i = 0, j = group.children.length; i < j; i++) {
      var el = group.children[i];
      var cache = caches[i];
      TweenLite.to(el.position, cache.duration, { z: 0 });
    }
  };

  this.out = function (way) {
    var factor = way === 'up' ? 1 : -1;

    for (var i = 0, j = group.children.length; i < j; i++) {
      var el = group.children[i];
      var cache = caches[i];
      TweenLite.to(el.position, cache.duration, { z: factor * cache.z });
    }
  };

  this.start = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].resume();
    }
  };

  this.stop = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].pause();
    }
  };
}

Drop.defaultOptions = {
  count: 6,
  color: '#ffffff',
  amplitude: 2
};

/**
 * Get water ripple plane
 *
 * @method getPlane
 * @return {THREE.Mesh}
 */
Drop.prototype.getPlane = function () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-drop.png');
  
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    color: this.parameters.color,
    side: THREE.DoubleSide
  });

  var geometry = new THREE.PlaneGeometry(20, 20, 1, 1);

  return new THREE.Mesh(geometry, material);
};

/**
 * Get ripple animation
 *
 * @method getTween
 * @param {THREE.Mesh} [plane]
 * @param {Number} [index]
 * @return {TweenLite}
 */
Drop.prototype.getTween = function (plane, index) {
  var cache = { scale: 0.1, opacity: 1 };
  var scale = (index + 1) * (this.parameters.amplitude) / this.parameters.count;

  return TweenLite.to(cache, 1.5, { scale: scale, opacity: 0, paused: true, delay: (index * 100) / 1000,
      onUpdate: function () {
        plane.scale.x = plane.scale.y = cache.scale;
        plane.material.opacity = cache.opacity;
      },
      onComplete: loop
    });
};

module.exports = Drop;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/loopUtil":62}],29:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var yoyo = require('../utils/yoyoUtil');

var matCap = require('../materials/matCapMaterial');
matCap.uniforms.map.value = THREE.ImageUtils.loadTexture('./app/public/img/matCap-shiny.jpg');

/**
 * 3D face
 *
 * @class Face
 * @constructor
 * @requires THREE, TweenLite, random, yoyo, matCap
 */
function Face () {
  var group = new THREE.Object3D();

  var loader = new THREE.JSONLoader();
  loader.load('./app/public/3D/face-hp.js', function (geometry) {
    var mesh = new THREE.Mesh(geometry, matCap);
    mesh.scale.x = 1.5;
    mesh.scale.y = 1.5;

    group.add(mesh);

    var idleTween = TweenLite.to({ y: -0.2 }, 2, { y: 0.2, paused: true,
      onUpdate: function () {
        mesh.rotation.y = this.target.y;
      },
      onComplete: yoyo,
      onReverseComplete: yoyo
    });

    this.in = function () {
      TweenLite.to(mesh.rotation, 1.5, { x: 0 });
    };

    this.out = function (way) {
      var x = way === 'up' ? -1 : 1;
      TweenLite.to(mesh.rotation, 1.5, { x: x });
    };

    this.start = function () {
      idleTween.resume();
    };

    this.stop = function () {
      idleTween.pause();
    };
  }.bind(this));

  this.el = group;

  this.start = function () {};

  this.stop = this.start;

  this.in = this.start;

  this.out = this.start;
}

module.exports = Face;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../materials/matCapMaterial":9,"../utils/yoyoUtil":66}],30:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var noise = require('../utils/noiseUtil');
var map = require('../utils/mapUtil');

/**
 * 3D Flow field
 * Fake flocking
 *
 * @param {Array} [points] MainCurve's points
 * @param {Object} [options]
 * @param {Object} [options.subsNumber=3] SubCurves number
 * @param {Number} [options.subsAmplitude=30] SubCurves amplitude
 * @param {Number} [options.subsPrecision=10] SubCurves precision (=subdivisions)
 * @param {Number} [options.noiseXincrement=0.1] SubCurves x noise
 * @param {Number} [options.moiseYincrement=0.1] SubCurves y noise
 * @param {Number} [options.noiseZincrement=0.1] SubCurves z noise
 * @param {Number} [options.renderResolution=100] SubCurves render precision (=subdivisions)
 * @param {String} [options.mainColor='#ffffff'] MainCurve's color
 * @param {String} [options.subsColor='#4c4c4c'] SubCurves color
 * @requires jQuery, THREE, TweenLite, random, noise, map
 */
function FlowField (points, options) {
  this.parameters = jQuery.extend(FlowField.defaultOptions, options);

  var group = new THREE.Object3D();

  var curves = this.getCurves(points);
  var main = curves.main;
  var subs = curves.subs;
  var lines = this.getLines(main, subs);
  var inTweens = [];

  for (var i = 0, j = lines.length; i < j; i++) {
    group.add(lines[i]);
    inTweens.push(this.getInTween(lines[i]));
  }

  var triangleGeometry = new THREE.TetrahedronGeometry(3);
  var triangleMaterial = new THREE.MeshLambertMaterial({ shading: THREE.FlatShading });
  var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

  var follow = this.getFollow(triangleMesh, subs);

  for (var k = 0, l = follow.meshes.length; k < l; k++) {
    group.add(follow.meshes[k]);
  }

  this.el = group;

  this.in = function () {
    for (var i = 0, j = inTweens.length; i < j; i++) {
      inTweens[i].restart();
    }
  };

  this.out = function () {
    for (var i = 0, j = inTweens.length; i < j; i++) {
      inTweens[i].reverse();
    }
  };

  this.start = function () {
    for (var i = 0, j = follow.tweens.length; i < j; i++) {
      follow.tweens[i].resume();
    }
  };

  this.stop = function () {
    for (var i = 0, j = follow.tweens.length; i < j; i++) {
      follow.tweens[i].pause();
    }
  };
}

FlowField.defaultOptions = {
  subsNumber: 3,
  subsAmplitude: 30,
  subsPrecision: 10,
  noiseXincrement: 0.1,
  moiseYincrement: 0.1,
  noiseZincrement: 0.1,
  renderResolution: 100,
  mainColor: '#ffffff',
  subsColor: '#4c4c4c',
  subsHiddenColo: '#0a0a0a'
};

/**
 * Get main and subs curves
 *
 * @method getCurves
 * @return {Object}
 */
FlowField.prototype.getCurves = function (points) {
  var main = new THREE.SplineCurve3(points);

  var subsPoints = main.getPoints(this.parameters.subsPrecision);

  var subs = [];

  for (var i = 0; i < this.parameters.subsNumber; i++) {
    var noiseX = random(0, 10);
    var noiseY = random(0, 10);
    var noiseZ = random(0, 10);

    var newPoints = [];
    for (var j = 0, k = subsPoints.length; j < k; j++) {
      var point = subsPoints[j].clone();

      point.x += map(noise(noiseX), [0, 1], [-this.parameters.subsAmplitude, this.parameters.subsAmplitude]);
      point.y += map(noise(noiseY), [0, 1], [-this.parameters.subsAmplitude, this.parameters.subsAmplitude]);
      point.z += map(noise(noiseZ), [0, 1], [-this.parameters.subsAmplitude, this.parameters.subsAmplitude]);

      noiseX += this.parameters.noiseXincrement;
      noiseY += this.parameters.moiseYincrement;
      noiseZ += this.parameters.noiseZincrement;

      newPoints.push(point);
    }

    subs.push(new THREE.SplineCurve3(newPoints));
  }

  return {
    main: main,
    subs: subs
  };
};

/**
 * Get lines
 *
 * @method getLines
 * @param {THREE.SplineCurve3} [main] Main curve
 * @param {Array} [subs] Sub curves
 * @return {Array}
 */
FlowField.prototype.getLines = function (main, subs) {
  var lines = [];

  var mainMaterial = new THREE.LineBasicMaterial({ color: this.parameters.mainColor });

  var mainGeometry = new THREE.Geometry();
  var mainPoints = main.getPoints(this.parameters.renderResolution);
  mainGeometry.vertices = mainPoints;

  var mainLine = new THREE.Line(mainGeometry, mainMaterial);
  mainLine.visible = false;
  lines.push(mainLine);

  var subMaterial = new THREE.LineBasicMaterial({ color: this.parameters.subsColor });

  for (var i = 0, j = subs.length; i < j; i++) {
    var subGeometry = new THREE.Geometry();
    var subPoints = subs[i].getPoints(this.parameters.renderResolution);
    subGeometry.vertices = subPoints;

    var subLine = new THREE.Line(subGeometry, subMaterial);
    subLine.visible = false;
    lines.push(subLine);
  }

  return lines;
};

/**
 * Get in animation
 *
 * @method getInTween
 * @param {THREE.Line} [line] Line to animate
 * @return {TweenLite}
 */
FlowField.prototype.getInTween = function (line) {
  return TweenLite.to({}, random(1, 3), { paused: true,
      onComplete: function () {
        line.visible = true;

        TweenLite.delayedCall(0.2, function () {
          line.visible = false;
        });

        TweenLite.delayedCall(0.3, function () {
          line.visible = true;
        });
      },
      onReverseComplete: function () {
        line.visible = false;
      }
    });
};

/**
 * Get follow animatiom
 *
 * @method getFollor
 * @param {THREE.Mesh} Mesh following
 * @param {Array} Curves
 * @return {Object}
 */
FlowField.prototype.getFollow = function (mesh, curves) {
  var meshes = [];
  var tweens = [];

  function getTween (mesh, sub) {
    return TweenLite.to({ i: 0 }, random(4, 8), { i: 1, paused: true, ease: window.Linear.easeNone,
        onUpdate: function () {
          var position = sub.getPoint(this.target.i);
          var rotation = sub.getTangent(this.target.i);
          
          mesh.position.set(position.x, position.y, position.z);
          mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        },
        onComplete: function () {
          this.restart();
        }
      });
  }

  for (var i = 0, j = curves.length; i < j; i++) {
    var meshCopy = mesh.clone();
    var curve = curves[i];

    meshes.push(meshCopy);
    tweens.push(getTween(meshCopy, curve));
  }

  return {
    tweens: tweens,
    meshes: meshes
  };
};

module.exports = FlowField;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/mapUtil":63,"../utils/noiseUtil":64,"../utils/randomUtil":65}],31:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var map = require('../utils/mapUtil');
var loop = require('../utils/loopUtil');

/**
 * @class Galaxy
 * @constructor
 * @param {Object} [options]
 * @param {String} [ringFromColor='#ffffff'] Off color
 * @param {String} [ringToColor='#333333'] On color
 * @param {Number} [ringDivisions=100] Rings divisions
 * @param {Number} [ringColorSteps=30] Gradient steps
 * @requires jQuery, THREE, TweenLite, random, map, loop
 */
function Galaxy (options) {
  this.parameters = jQuery.extend(Galaxy.defaultOptions, options);

  var group = new THREE.Object3D();

  var ring = this.getRing();
  var planet = this.getPlanet();

  var greyPlanet = planet.clone();
  greyPlanet.material = greyPlanet.material.clone();
  greyPlanet.material.color = new THREE.Color('#4c4c4c');

  var blackPlanet = planet.clone();
  blackPlanet.material = blackPlanet.material.clone();
  blackPlanet.material.color = new THREE.Color('#000000');

  var radius = [8, 10, 16, 25, 31];
  var planets = {
    8: { el: planet.clone(), scale: 0.2, increment: 0.03 },
    10: { el: greyPlanet.clone(), scale: 0.1, increment: 0.03 },
    16: { el: greyPlanet.clone(), scale: 0.5, increment: 0.02 },
    25: { el: planet.clone(), scale: 0.7 },
    31: { el: blackPlanet.clone(), scale: 0.5, increment: 0.05 }
  };

  for (var i = 0, j = radius.length; i < j; i++) {
    var ringRadius = radius[i];

    var ringCopy = ring.clone();
    ringCopy.scale.x = ringCopy.scale.y = ringRadius;
    ringCopy.rotation.z = random(0, Math.PI);

    group.add(ringCopy);

    if (planets[ringRadius]) {
      var planetCopy = planets[ringRadius].el;
      var scale = planets[ringRadius].scale;

      planetCopy.scale.x = planetCopy.scale.y = planetCopy.scale.z = scale;

      // random start theta
      var theta = random(0, 2 * Math.PI);
      var x = ringRadius * Math.cos(theta);
      var y = ringRadius * Math.sin(theta);
      planets[ringRadius].theta = theta;
      planetCopy.position.set(x, y, 0);

      group.add(planetCopy);
    }
  }

  var cache = { rotationX: 0, rotationY: 0 };

  function update () {
    group.rotation.y = cache.rotationY;
    group.rotation.x = cache.rotationX;
  }

  this.el = group;

  this.in = function (way) {
    cache = way === 'up'
      ? { rotationY: -0.6, rotationX: -0.5 }
      : { rotationY: 0.6, rotationX: -1.5 };

    update();

    TweenLite.to(cache, 2, { rotationX: -1, rotationY: 0.2, onUpdate: update });
  };

  this.out = function (way) {
    var to = way === 'up'
      ? { rotationY: 0.6, rotationX: -1.5, onUpdate: update }
      : { rotationY: -0.6, rotationX: -0.5, onUpdate: update };
  
    TweenLite.to(cache, 1, to);
  };

  var idleTween = TweenLite.to({}, 10, { paused: true,
      onUpdate: function () {
        for (var radius in planets) {
          if (planets.hasOwnProperty(radius)) {
            var el = planets[radius].el;
            var theta = planets[radius].theta;
            var increment = planets[radius].increment || 0.01;

            var x = radius * Math.cos(theta);
            var y = radius * Math.sin(theta);

            planets[radius].theta -= increment;

            el.position.x = x;
            el.position.y = y;
          }
        }

        ring.geometry.colors = ring.geometry.colors.concat(ring.geometry.colors.splice(0, 1));
        ring.geometry.colorsNeedUpdate = true;
      },
      onComplete: loop
    });

  this.start = function () {
    idleTween.resume();
  };

  this.stop = function () {
    idleTween.pause();
  };
}

Galaxy.defaultOptions = {
  ringFromColor: '#ffffff',
  ringToColor: '#333333',
  ringDivisions: 100,
  ringColorSteps: 30
};

/**
 * Get base planet
 *
 * @method getPlanet
 * @return {THREE.Mesh}
 */
Galaxy.prototype.getPlanet = function () {
  var planetMaterial = new THREE.MeshBasicMaterial();
  var planetGeometry = new THREE.SphereGeometry(5, 20, 20);
  var planet = new THREE.Mesh(planetGeometry, planetMaterial);

  return planet;
};

/**
 * Get base ring
 *
 * @method getRing
 * @return {THREE.Line}
 */
Galaxy.prototype.getRing = function () {
  var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

  var geometry = new THREE.Geometry();

  var step = 2 * Math.PI / this.parameters.ringDivisions;

  for (var i = 0; i < this.parameters.ringDivisions + 1; i++) {
    var theta = i * step;

    var vertex = new THREE.Vector3(1 * Math.cos(theta), 1 * Math.sin(theta), 0);

    geometry.vertices.push(vertex);
  }

  var fromColor = new THREE.Color(this.parameters.ringFromColor);
  var toColor = new THREE.Color(this.parameters.ringToColor);

  var colors = [];

  for (var j = 0; j < this.parameters.ringColorSteps; j++) {
    var percent = map(j + 1, [0, this.parameters.ringColorSteps], [0, 1]);
    colors[j] = fromColor.clone().lerp(toColor, percent);
  }

  var total = geometry.vertices.length;
  var start = 0;
  var current = start;

  var verticesColors = [];

  for (var k = 0; k < total; k++) {
    current++;

    if (current > total) {
      current = 0;
    }

    var vertexColor = colors[current] ? colors[current] : toColor;

    verticesColors.push(vertexColor);
  }

  geometry.colors = verticesColors;

  var ring = new THREE.Line(geometry, material);

  return ring;
};

module.exports = Galaxy;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/loopUtil":62,"../utils/mapUtil":63,"../utils/randomUtil":65}],32:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var map = require('../utils/mapUtil');
var random = require('../utils/randomUtil');

/**
 * Simple 3D grid that can receive forces
 *
 * @class Grid
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.stepsX=10] x steps
 * @param {Number} [options.stepsY=10] y steps
 * @param {Number} [options.stepSize=2] Step's size,
 * @param {String} [options.linesFromColor='#ffffff'] Height min color
 * @param {String} [options.linesToColor='#333333'] Height max color
 * @requires jQuery, THREE
 */
function Grid (options) {
  this.parameters = jQuery.extend(Grid.defaultOptions, options);

  this.lines = null;
  this.points = null;
  this.colorsCache = {}; // cache vertices colors

  this.el = null;

  this.init();
  this.render();
}

Grid.defaultOptions = {
  stepsX: 10,
  stepsY: 10,
  stepSize: 2,
  linesFromColor: '#ffffff',
  linesToColor: '#333333',
  points: false
};

/**
 * Initialize
 *
 * @method init
 */
Grid.prototype.init = function () {
  var width = (this.parameters.stepsX - 1) * this.parameters.stepSize;
  var height = (this.parameters.stepsY - 1) * this.parameters.stepSize;

  var points = new THREE.Geometry();

  for (var x = 0; x < this.parameters.stepsX; x++) {
    for (var y = 0; y < this.parameters.stepsY; y++) {
      var xPos = (x * this.parameters.stepSize) - (width / 2);
      var yPos = (y * this.parameters.stepSize) - (height / 2);
      var zPos = 0;

      var vertex = new THREE.Vector3(xPos, yPos, zPos);
      points.vertices.push(vertex);
    }
  }

  // init color cache
  var fromColor = new THREE.Color(this.parameters.linesFromColor);
  var toColor = new THREE.Color(this.parameters.linesToColor);

  for (var i = 0; i <= 1; i += 0.1) {
    var percent = Math.round(i * 10) / 10;
    this.colorsCache[percent] = fromColor.clone().lerp(toColor, percent);
  }

  this.points = points;
};

/**
 * Render the points and lines
 *
 * @method render
 */
Grid.prototype.render = function () {
  var group = new THREE.Object3D();

  // points
  var pointCloudMaterial = new THREE.PointCloudMaterial({
    size: 0.3
  });
  var pointCloud = new THREE.PointCloud(this.points, pointCloudMaterial);

  if (this.parameters.points) {
    group.add(pointCloud);
  }

  // lines
  var lines = new THREE.Object3D();

  var lineMaterial = new THREE.LineBasicMaterial({
    color: this.parameters.linesColor,
    vertexColors: THREE.VertexColors
  });

  // horizontal
  for (var i = 0; i < this.parameters.stepsY; i++) {
    var hLineGeometry = new THREE.Geometry();

    for (var j = 0; j < this.parameters.stepsX; j++) {
      hLineGeometry.vertices.push(
        this.points.vertices[i + (j * this.parameters.stepsY)]
      );
    }

    var hLine = new THREE.Line(hLineGeometry, lineMaterial);

    lines.add(hLine);
  }

  // vertical
  for (var k = 0; k < this.parameters.stepsX; k++) {
    var vLineGeometry = new THREE.Geometry();

    for (var l = 0; l < this.parameters.stepsY; l++) {
      vLineGeometry.vertices.push(
        this.points.vertices[(k * this.parameters.stepsY) + l]
      );        
    }

    var vLine = new THREE.Line(vLineGeometry, lineMaterial);

    lines.add(vLine);
  }

  group.add(lines);

  // exports
  this.points = pointCloud;
  this.lines = lines;
  this.el = group;
};

/**
 * Apply a force onto the grid
 *
 * @method applyForce
 * @param {THREE.Vector3} [center] Where to apply the force
 * @param {Number} [strength] Strength of the force
 */
Grid.prototype.applyForce = function (center, strength) {
  // update points
  for (var i = 0, j = this.points.geometry.vertices.length; i < j; i++) {
    var dist = this.points.geometry.vertices[i].distanceTo(center);

    this.points.geometry.vertices[i].z -= (strength * 10) / Math.sqrt(dist * 2 ) - (strength * 2);
  }
  this.points.geometry.verticesNeedUpdate = true;

  // update lines
  for (var k = 0, l = this.lines.children.length; k < l; k++) {
    var geometry = this.lines.children[k].geometry;

    // update vertices colors
    for (var m = 0, n = geometry.vertices.length; m < n; m++) {
      var vertex = geometry.vertices[m];
      var percent = map(vertex.z, [0, 5], [0, 1]);
      percent = Math.round(percent * 10) / 10;

      geometry.colors[m] = this.colorsCache[percent];
    }

    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
  }
};

/**
 * Reset all the forces applied
 *
 * @method resetFroce
 */
Grid.prototype.resetForce = function () {
  for (var i = 0, j = this.points.geometry.vertices.length; i < j; i++) {
    this.points.geometry.vertices[i].z = 0;
  }
};

/**
 * Get grid total size
 *
 * @method getSize
 * @return {Object}
 */
Grid.prototype.getSize = function () {
  var width = (this.parameters.stepsX - 1) * this.parameters.stepSize;
  var height = (this.parameters.stepsY - 1) * this.parameters.stepSize;

  return {
    x: {
      min: -(width / 2),
      max: (this.parameters.stepsX * this.parameters.stepSize) - (width / 2)
    },
    y: {
      min: -(height / 2),
      max: (this.parameters.stepsY * this.parameters.stepSize) - (height / 2)
    }
  };
};

/**
 * Gravity grid
 *
 * @class GravityGrid
 * @constructor
 * @requires THREE, TWEEN
 */
function GravityGrid (options) {
  var group = new THREE.Object3D();

  var grid = new Grid({
    stepsX: 30,
    stepsY: 30,
    linesColor: options.linesColor || '#666666'
  });
  group.add(grid.el);

  var size = grid.getSize();
  var rangeX = size.x;
  var rangeY = size.y;

  var sphereRadius = 5;
  var mass = 5;
  var sphereGeometry = new THREE.SphereGeometry(sphereRadius, 20, 20);
  var sphereMaterial = new THREE.MeshBasicMaterial({
    color: '#ffffff'
  });
  var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(0, 30, 40);
  group.add(sphereMesh);

  var satelliteA = sphereMesh.clone();
  var satelliteB = sphereMesh.clone();

  satelliteA.scale.x = satelliteA.scale.y = satelliteA.scale.z = 0.5;
  satelliteB.scale.x = satelliteB.scale.y = satelliteB.scale.z = 0.25;

  satelliteA.position.z = 6;
  satelliteB.position.z = 6;

  var massA = 2.5;
  var massB = 2;

  group.add(satelliteA);
  group.add(satelliteB);
  
  var cache = { xA: 0, yA: 0, xB: 0, yB: 0 };

  function setIdleTween (paused) {
    var properties = {
      bezier: {
        type: 'soft',
        values: [
          {
            xA: random(rangeX.min, rangeX.max),
            yA: random(rangeX.min, rangeX.max),
            xB: random(rangeX.min, rangeX.max),
            yB: random(rangeY.min, rangeY.max)
          },
          {
            xA: random(rangeX.min, rangeX.max),
            yA: random(rangeX.min, rangeX.max),
            xB: random(rangeX.min, rangeX.max),
            yB: random(rangeY.min, rangeY.max)
          }
        ]
      },
      onUpdate: function () {
        satelliteA.position.x = this.target.xA;
        satelliteA.position.y = this.target.yA;

        satelliteB.position.x = this.target.xB;
        satelliteB.position.y = this.target.yB;

        grid.resetForce();
        grid.applyForce(sphereMesh.position, mass);
        grid.applyForce(satelliteA.position, massA);
        grid.applyForce(satelliteB.position, massB);
      },
      onComplete: function () {
        idleTween = setIdleTween();
      }
    };

    if (paused) {
      properties.paused = true;
    }

    return TweenLite.to(cache, 2, properties);
  }

  var idleTween = setIdleTween(true);
  
  // animate for 50 ms to put the sphere in the right position
  idleTween.resume();
  TweenLite.delayedCall(0.1, function () {
    idleTween.pause();
  });

  this.el = group;

  this.in = function () {
    TweenLite.to(sphereMesh.position, 1, {
        x: (rangeX.max + rangeX.min) / 2,
        y: (rangeY.max + rangeY.min) / 2,
        z: 5,
        delay: 0.2
      });
  };

  this.out = function () {
    TweenLite.to(sphereMesh.position, 1, { x: 0, y: 30, z: 40, delay: 0.2 });
  };

  this.start = function () {
    idleTween.resume();
  };

  this.stop = function () {
    idleTween.pause();
  };
}

module.exports = GravityGrid;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/mapUtil":63,"../utils/randomUtil":65}],33:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');

/**
 * Animated grid
 *
 * @class Grid
 * @constructor
 * @param {Object} [options]
 * @param {Boolean} [options.points=false] Points?
 * @param {Number} [options.divisionsSize=10] Divisions size
 * @param {Number} [options.divisionsX=11] X axis divisions
 * @param {Number} [options.divisionsY=11] Y axis divisions
 * @param {String} [options.fromColor='#ffffff'] On color
 * @param {String} [options.toColor='#0a0a0a'] Off color
 * @requires jQuery, THREE, TweenLite, random, yoyo
 */
function Grid (options) {
  this.parameters = jQuery.extend(Grid.defaultOptions, options);

  this.width = (this.parameters.divisionsX - 1) * this.parameters.divisionsSize;
  this.height = (this.parameters.divisionsY - 1) * this.parameters.divisionsSize;

  var group = new THREE.Object3D();

  var vertices = this.getVertices();

  if (this.parameters.points) {
    var pointsGeometry = new THREE.Geometry();

    for (var i = 0, j = vertices.length; i < j; i++) {
      pointsGeometry.vertices.push(vertices[i][0]);
      pointsGeometry.vertices.push(vertices[i][1]);
      pointsGeometry.vertices.push(vertices[i][2]);
    }
    
    var pointsMaterial = new THREE.PointCloudMaterial({ size: 0.2 });
    var points = new THREE.PointCloud(pointsGeometry, pointsMaterial);

    group.add(points);
  }

  var lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    linewidth: 1
  });

  var colorsCache = {};
  var fromColor = new THREE.Color(this.parameters.fromColor);
  var toColor = new THREE.Color(this.parameters.toColor);

  var idleTweens = [];

  for (var k = 0, l = vertices.length; k < l; k++) {
    var lineGeometry = new THREE.Geometry();

    var firstTo = vertices[k][0].clone();
    var secondTo = vertices[k][2].clone();

    lineGeometry.vertices.push(vertices[k][1].clone());
    lineGeometry.vertices.push(vertices[k][1]);
    lineGeometry.vertices.push(vertices[k][1].clone());

    for (var m = 0, n = lineGeometry.vertices.length; m < n; m++) {

      var color = null;
      var percent = null;

      if (k >= this.parameters.divisionsX) {
        // horizontal
        var y = lineGeometry.vertices[m].y;
        percent = Math.abs((y * 100 / this.height) / 100);
      } else {
        // vertical
        var x = lineGeometry.vertices[m].x;
        percent = Math.abs((x * 100 / this.width) / 100);
      }

      if (!colorsCache[percent]) {
        color = fromColor.clone().lerp(toColor, percent + 0.2);
        colorsCache[percent] = color;
      } else {
        color = colorsCache[percent];
      }

      lineGeometry.colors.push(toColor);
      lineGeometry.colors.push(color);
      lineGeometry.colors.push(toColor);
    }

    var line = new THREE.Line(lineGeometry, lineMaterial);

    idleTweens.push(this.getTween(line, line.geometry.vertices[0], firstTo));
    idleTweens.push(this.getTween(line, line.geometry.vertices[2], secondTo));
    
    group.add(line);
  }

  this.el = group;

  this.start = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].resume();
    }
  };

  this.stop = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].pause();
    }
  };

  this.in = function () {
    TweenLite.to(group.position, 1, { y: 0 });
  };

  this.out = function (way) {
    var y = way === 'up' ? -50 : 50;
    TweenLite.to(group.position, 1, { y: y });
  };
}

Grid.defaultOptions = {
  points: false,
  divisionsSize: 10,
  divisionsX: 11,
  divisionsY: 11,
  fromColor: '#ffffff',
  toColor: '#0a0a0a'
};

/**
 * Get vertices
 *
 * @method getVertices
 * @return {Array} vertices
 */
Grid.prototype.getVertices = function () {
  var vertices = [];

  // horizontal
  for (var x = 0; x < this.parameters.divisionsX; x++) {
    var xPosH = (x * this.parameters.divisionsSize) - (this.width / 2);
    var yPosH = this.height - (this.height / 2);

    vertices.push([
      new THREE.Vector3(xPosH, -this.height / 2, 0),
      new THREE.Vector3(xPosH, yPosH - (this.height / 2) , 0),
      new THREE.Vector3(xPosH, yPosH, 0)
    ]);
  }

  // vertical
  for (var y = 0; y < this.parameters.divisionsY; y++) {
    var xPosV = this.width - (this.width / 2);
    var yPosV = (y * this.parameters.divisionsSize) - (this.height / 2);

    vertices.push([
      new THREE.Vector3(-this.width / 2, yPosV, 0),
      new THREE.Vector3(xPosV - (this.width / 2), yPosV, 0),
      new THREE.Vector3(xPosV, yPosV, 0)
    ]);
  }

  return vertices;
};

/**
 * Get line animation
 *
 * @method getTween
 * @param {THREE.Line} [line] Line to animate
 * @param {THREE.Vector3} [from] Start coordinates
 * @param {THREE.Vector3} [to] End coordinates
 */
Grid.prototype.getTween = function (line, from, to) {
  var parameters = {
    paused: true,
    delay: random(0, 2),
    onUpdate: function () {
      line.geometry.verticesNeedUpdate = true;
      line.geometry.computeBoundingSphere();
    },
    onComplete: yoyo,
    onReverseComplete: yoyo,
    x: to.x,
    y: to.y,
    z: to.z
  };

  return TweenLite.to(from, random(1, 2), parameters);
};

module.exports = Grid;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/randomUtil":65,"../utils/yoyoUtil":66}],34:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */
/* jshint shadow:true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var Events = require('../classes/EventsClass');

var random = require('../utils/randomUtil');
var map = require('../utils/mapUtil');

/**
 * Animated height map
 *
 * @class HeightMap
 * @constructor
 * @param {Object} [options]
 * @param {Boolean} [options.horizontal=true] Horizontal lines?
 * @param {Boolean} [options.vertical=false] Vertical lines?
 * @param {Boolean} [options.plane=false] Plane?
 * @param {Boolean} [options.points=false] Points?
 * @param {Number} [options.divisionsX=30] X axis divisions
 * @param {Number} [options.divisionsY=30] Y axis divisions
 * @param {String} [options.fromColor='#4c4c4c'] Height min color
 * @param {String} [options.toColor='#ffffff'] Height max color
 * @param {Array} [options.maps=[]] Maps sources
 * @requires jQuery, THREE, TweenLite, Events, random, map
 */
function HeightMap (options) {
  this.parameters = jQuery.extend(HeightMap.defaultOptions, options);

  this.events = new Events();

  this.fromColor = new THREE.Color(this.parameters.fromColor);
  this.toColor = new THREE.Color(this.parameters.toColor);
  this.colorsCache = {};
  this.faceIndices = ['a', 'b', 'c', 'd'];

  this.ready = false;
  this.data = null;
  this.total = this.parameters.maps.length;
  this.previous = undefined;
  this.current = undefined;

  var group = new THREE.Object3D();

  this.geometry = new THREE.PlaneGeometry(50, 50, this.parameters.divisionsX, this.parameters.divisionsY);

  if (this.parameters.plane) {
    this.plane = this.getPlane();
    group.add(this.plane);
  }

  if (this.parameters.points) {
    this.points = this.getPoints();
    group.add(this.points);
  }

  if (this.parameters.horizontal || this.parameters.vertical) {
    this.lines = this.getLines();
    group.add(this.lines);
  }

  this.loadMaps();

  this.el = group;

  this.start = function () {};
  
  this.stop = this.start;

  this.on('ready', function () {
    this.ready = true;

    var idleTween = this.getIdleTween();

    this.start = function () {
      idleTween.resume();
    };

    this.stop = function () {
      idleTween.pause();
    };
  }.bind(this));
}

HeightMap.defaultOptions = {
  horizontal: true,
  vertical: false,
  plane: false,
  points: false,
  divisionsX: 30,
  divisionsY: 30,
  fromColor: '#4c4c4c',
  toColor: '#ffffff',
  maps: []
};

/**
 * Get plane
 *
 * @method getPlane
 * @param {THREE.Geometry} geometry
 * @return {THREE.Mesh}
 */
HeightMap.prototype.getPlane = function () {
  var material = new THREE.MeshLambertMaterial({
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors
  });

  var plane = new THREE.Mesh(this.geometry, material);

  return plane;
};

/**
 * Get points
 *
 * @method getPoints
 * @param {THREE.Geometry} geometry
 * @return {THREE.PointCloud}
 */
HeightMap.prototype.getPoints = function () {
  var material = new THREE.PointCloudMaterial({ size: 0.3 });
  var points = new THREE.PointCloud(this.geometry, material);

  return points;
};

/**
 * Get lines
 *
 * @method getLines
 * @param {THREE.Geometry} geometry
 * @return {THREE.Object3D}
 */
HeightMap.prototype.getLines = function () {
  var material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors
  });

  var lines = new THREE.Object3D();

  if (this.parameters.vertical) {
    for (var x = 0; x < this.parameters.divisionsX + 1; x++) {
      var lineGeometry = new THREE.Geometry();

      for (var y = 0; y < this.parameters.divisionsY + 1; y++) {
        var vertex = this.geometry.vertices[x + ((y * this.parameters.divisionsX) + y)];
        lineGeometry.vertices.push(vertex);
      }

      var line = new THREE.Line(lineGeometry, material);
      lines.add(line);
    }
  }

  if (this.parameters.horizontal) {
    for (var y = 0; y < this.parameters.divisionsY + 1; y++) {
      var lineGeometry = new THREE.Geometry();

      for (var x = 0; x < this.parameters.divisionsX + 1; x++) {
        var vertex = this.geometry.vertices[(y * (this.parameters.divisionsX + 1)) + x];
        lineGeometry.vertices.push(vertex);

        if (x === 0) {
          vertex.x -= random(0, 20);
        }

        if (x === this.parameters.divisionsX) {
          vertex.x += random(0, 20);
        }
      }

      var line = new THREE.Line(lineGeometry, material);
      lines.add(line);
    }
  }

  return lines;
};

/**
 * Get animations
 *
 * @method getIdleTween
 * @return {TweenLite}
 */
HeightMap.prototype.getIdleTween = function () {
  var _this = this;

  return TweenLite.to({}, 2, { paused: true,
      onComplete: function () {
        _this.current++;

        if (_this.current === _this.total) {
          _this.current = 0;
        }

        _this.applyMap();

        this.duration(random(1.5, 5));
        this.restart();
      }
    });
};

/**
 * Load maps
 *
 * @method loadMaps
 */
HeightMap.prototype.loadMaps = function () {
  var totalData = (this.parameters.divisionsX + 1) * (this.parameters.divisionsY + 1);
  this.data = { default: new Float32Array(totalData) };
  
  var loader = new THREE.ImageLoader();
  var total = this.parameters.maps.length;
  var loaded = 0;

  var addMap = function (name, image) {
    var width = image.width;
    var height = image.height;

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);

    var stepX = width / this.parameters.divisionsX;
    var stepY = height / this.parameters.divisionsY;

    var data = new Float32Array(totalData);
    var i = 0;

    for (var y = 0; y < height; y += stepY) {
      for (var x = 0; x < width; x += stepX) {
        var pixelData = context.getImageData(x, y, 1, 1).data;

        // Luminance = R + G + B
        // int8 must be in the [-127, 127] range
        // Max luminance = 765 (255 * 3), dividing by 10 ensures it can only be 76.5 at max
        data[i++] = (pixelData[0] + pixelData[1] + pixelData[2]) / 100;
      }
    }

    _this.data[name] = data;
  }.bind(this);

  var _this = this;
  
  function loadMap (map, index) {
    loader.load(map.url, function (image) {
      addMap(map.name, image);

      loaded++;

      if (loaded === 1) {
        _this.current = index;
        _this.applyMap();
      }

      if (loaded === total) {
        _this.trigger('ready');
      }
    });
  }

  for (var i = 0; i < total; i++) {
    var map = this.parameters.maps[i];
    loadMap(map, i);
  }
};

/**
 * Apply current map
 *
 * @method applyMap
 */
HeightMap.prototype.applyMap = function () {
  var previousName = typeof this.previous === 'undefined'
    ? 'default'
    : this.parameters.maps[this.previous].name;

  var currentName = this.parameters.maps[this.current].name;

  var previousData = this.data[previousName];
  var currentData = this.data[currentName];

  var _this = this;

  TweenLite.to({ factor: 1 }, 1, { factor: 0, ease: window.Elastic.easeOut,
      onUpdate: function () {

        for (var i = 0, j = _this.geometry.vertices.length; i < j; i++) {
          var vertex = _this.geometry.vertices[i];
          var offset = currentData[i] + ((previousData[i] - currentData[i]) * this.target.factor);
          vertex.z = offset;
        }

        _this.geometry.verticesNeedUpdate = true;

        if (_this.lines) {
          for (var k = 0, l = _this.lines.children.length; k < l; k++) {
            _this.lines.children[k].geometry.verticesNeedUpdate = true;
          }
        }

        _this.setColors();
      }
    });

  this.previous = this.current;
};

/**
 * Set lines/points/plane vertices colors
 *
 * @method setColors
 */
HeightMap.prototype.setColors = function () {
  // lines
  if (this.lines) {
    for (var i = 0, j = this.lines.children.length; i < j; i++) {
      var line = this.lines.children[i];

      for (var k = 0, l = line.geometry.vertices.length; k < l; k++) {
        var vertex = line.geometry.vertices[k];

        // (255 + 255 + 255) / 10 = 76.5, 76.5 / 20 = 3.8
        var percent = map(vertex.z, [0, 3.8], [0, 2]);
        percent = Math.round(percent * 10) / 10;

        if (!this.colorsCache[percent]) {
          this.colorsCache[percent] = this.fromColor.clone().lerp(this.toColor, percent);
        }

        line.geometry.colors[k] = this.colorsCache[percent];
      }

      line.geometry.colorsNeedUpdate = true;
    }
  }

  // planes/points
  if (this.plane || this.points) {
    for (var i = 0, j = this.geometry.faces.length; i < j; i++) {
      var face = this.geometry.faces[i];

      // Assumption : instanceof THREE.Face3
      for (var k = 0; k < 3; k++) {
        var vertexIndex = face[this.faceIndices[k]];
        var vertex = this.geometry.vertices[vertexIndex];

        // (255 + 255 + 255) / 10 = 76.5, 76.5 / 20 = 3.8
        var percent = map(vertex.z, [0, 3.8], [0, 2]);
        percent = Math.round(percent * 10) / 10;

        if (!this.colorsCache[percent]) {
          this.colorsCache[percent] = this.fromColor.clone().lerp(this.toColor, percent);
        }

        face.vertexColors[k] = this.colorsCache[percent];
      }
    }

    this.geometry.colorsNeedUpdate = true;
  }
};

/**
 * Listen to event bus
 *
 * @method on
 */
HeightMap.prototype.on = function () {
  this.events.on.apply(this.events, arguments);
};

/**
 * Trigger event on event bus
 *
 * @method trigger
 */
HeightMap.prototype.trigger = function () {
  this.events.trigger.apply(this.events, arguments);
};

module.exports = HeightMap;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/EventsClass":1,"../utils/mapUtil":63,"../utils/randomUtil":65}],35:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./TextPanelObject3D":41}],36:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');

/**
 * Cloud of meshes looking at the same coordinates
 *
 * @class LookAtField
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.count=100] Meshes number
 * @requires jQuery, THREE, TweenLite, random
 */
function LookAtField (options) {
  var parameters = jQuery.extend({
    count: 100
  }, options);

  var center = new THREE.Vector3(0, 50, 0);

  var triangleGeometry = new THREE.TetrahedronGeometry(3);

  var triangleMaterial = new THREE.MeshLambertMaterial({ shading: THREE.FlatShading });
  var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

  var group = new THREE.Object3D();

  for (var i = 0; i < parameters.count; i++) {
    var triangleCopy = triangleMesh.clone();
    triangleCopy.position.x = random(-50, 50);
    triangleCopy.position.y = random(-50, 50);
    triangleCopy.position.z = random(-50, 30);

    triangleCopy.rotation.x = random(0, 2 * Math.PI);
    triangleCopy.rotation.y = random(0, 2 * Math.PI);
    triangleCopy.rotation.z = random(0, 2 * Math.PI);

    triangleCopy.scale.x = triangleCopy.scale.y = triangleCopy.scale.z = random(0.6, 1);

    triangleCopy.lookAt(center);

    group.add(triangleCopy);
  }

  group.position.y = -50;

  function update () {
    for (var i = 0; i < parameters.count; i++) {
      group.children[i].lookAt(center);
    }
  }

  this.el = group;

  this.in = function () {
    group.visible = true;
    TweenLite.to(center, 2, { y: 0, onUpdate: update });
    TweenLite.to(group.position, 1, { y: 0 });
  };

  this.out = function () {
    TweenLite.to(center, 1, { y: 50, onUpdate: update, onComplete: function () { group.visible = false; } });
    TweenLite.to(group.position, 1, { y: -50 });
  };
}

module.exports = LookAtField;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/randomUtil":65}],37:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SOUNDS = require('../modules/soundsModule');
var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');

/**
 * Animated Neon
 *
 * @class Neon
 * @constructor
 * @params {Object} [options]
 * @params {String} [options.color='#ffffff'] Neon color
 * @params {Number} [options.width=20] Neon width
 * @params {Boolean} [options.projection=true] Projection halo?
 * @params {Boolean} [options.planes=3] Glow planes
 * @requires jQuery, THREE, TweenLite, SOUNDS, random, yoyo
 */
function Neon (options) {
  this.parameters = jQuery.extend(Neon.defaultOptions, options);

  this.el = new THREE.Object3D();

  // setup 3d els
  this.tube = this.getTube();
  this.glow = this.getGlow();

  var glows = this.getGlows(this.glow);

  this.el.add(this.tube);
  this.el.add(glows);

  if (this.parameters.projection) {
    this.projection = this.getProjection();
    this.el.add(this.projection);
  }

  // flicker
  this.currentFlicker = 0;
  this.totalFlicker = random(3, 6, true);
  this.flickering = false;

  // animations
  var _this = this;

  this.idleIntensityTween = TweenLite.to({ projection: 0.08, glow: 0.4 }, random(0.8, 5), {
    projection: 0.15, glow: 0.7, paused: true,
    onStart: function () {
      _this.tube.material.emissive.set(_this.parameters.color);
    },
    onUpdate: function () {
      if (_this.flickering) {
        return false;
      }

      _this.glow.material.opacity = this.target.glow;
      if (_this.parameters.projection) {
        _this.projection.opacity = this.target.opacity;
      }
    },
    onComplete: yoyo,
    onReverseComplete: yoyo
  });

  this.idleFlickTween = TweenLite.to({}, random(0.1, 10), { paused: true,
    onComplete: function () {
      _this.flickOff();
      this.duration(random(0.1, 10));
      this.restart();
    }
  });

  this.inTween = TweenLite.to({}, random(0.2, 2), { paused: true,
    onComplete: function () {
      if (_this.currentFlicker++ < _this.totalFlicker) {
        _this.flickOn();
        this.duration(random(0.1, 0.5));
        this.restart();
      }
      else {
        _this.animations = [_this.idleIntensityTween, _this.idleFlickTween];
        _this.start();
      }
    }
  });

  this.animations = [this.inTween];
};

Neon.defaultOptions = {
  color: '#ffffff',
  width: 20,
  projection: true,
  planes: 3
};

/**
 * Start animations sequence
 */
Neon.prototype.start = function () {
  for (var i = 0, j = this.animations.length; i < j; i++) {
    this.animations[i].resume();
  }
};

/**
 * Stop animations sequence
 */
Neon.prototype.stop = function () {
  for (var i = 0, j = this.animations.length; i < j; i++) {
    this.animations[i].pause();
  }
};

/**
 * Flick on once
 * from off to on
 */
Neon.prototype.flickOn = function () {
  this.tube.material.emissive.set(this.parameters.color);
  this.tube.material.needsUpdate = true;

  this.glow.material.opacity = 0.3;

  if (this.parameters.projection) {
    this.projection.material.opacity = 0.05;
  }

  SOUNDS.neon.play();

  var _this = this;

  TweenLite.delayedCall(random(0.05, 0.07), function () {
    _this.tube.material.emissive.set('#000000');
    _this.tube.material.needsUpdate = true;

    _this.glow.material.opacity = 0;

    if (_this.parameters.projection) {
      _this.projection.material.opacity = 0;
    }
  });
};

/**
 * Flick off once
 * from on to off
 */
Neon.prototype.flickOff = function () {
  this.flickering = !this.flickering;
  
  this.glow.material.opacity = 0;

  if (this.parameters.projection) {
    this.projection.material.opacity = 0.05;
  }

  var _this = this;

  TweenLite.delayedCall(random(0.05, 0.1), function () {
    _this.flickering = !_this.flickering;

    SOUNDS.neon.play();
  });
};

/**
 * Get neon tube
 *
 * @method getTube
 * @return {THREE.Mesh}
 */
Neon.prototype.getTube = function () {
  var geometry = new THREE.CylinderGeometry(0.2, 0.2, this.parameters.width, 6);
  var material = new THREE.MeshLambertMaterial({
    color: '#808080',
    emissive: '#000000'
  });
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

/**
 * Get neon single glow
 *
 * @method getGlow
 * @return {THREE.Mesh}
 */
Neon.prototype.getGlow = function () {
  var texture = new THREE.ImageUtils.loadTexture('./app/public/img/texture-neonGlow.png');
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    color: this.parameters.color,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  var geometry = new THREE.PlaneGeometry(5, this.parameters.width + 3);
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

/**
 * Get neon glows
 *
 * @method getGlows
 * @param {THREE.Mesh} [glow]
 * @return {THREE.Object3D}
 */
Neon.prototype.getGlows = function (glow) {
  var glows = new THREE.Object3D();

  for (var i = 0; i < this.parameters.planes; i++) {
    var copy = glow.clone();
    copy.rotation.y = i * (0.7 * Math.PI);
    glows.add(copy);
  }

  return glows;
};

/**
 * Get neon projection
 *
 * @method getProjection
 * @return {THREE.Mesh}
 */
Neon.prototype.getProjection = function () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-neonProjection.png');
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    color: this.parameters.color,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  var geometry = new THREE.PlaneGeometry(this.parameters.width * 2, 50);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -1;

  return mesh;
};

module.exports = Neon;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../modules/soundsModule":14,"../utils/randomUtil":65,"../utils/yoyoUtil":66}],38:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var yoyo = require('../utils/yoyoUtil');

/**
 * 3D Rocks
 *
 * @class Rocks
 * @constructor
 * @requires THREE, TweenLite, yoyo
 */
function Rocks () {
  var group = new THREE.Object3D();

  var sphere = this.getSphere(); 
  group.add(sphere);

  var light = this.getLight();
  group.add(light);

  // rocks
  var rocksMaterial = new THREE.MeshLambertMaterial({
    color: '#0a0a0a',
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  var fromColor = new THREE.Color('#0a0a0a');
  var toColor = new THREE.Color('#ffffff');

  var loader = new THREE.JSONLoader();
  loader.load('./app/public/3D/rocks.js', function (geometry) {
    var rocks = new THREE.Mesh(geometry, rocksMaterial);
    rocks.position.set(-70, 0, -30);
    group.add(rocks);

    var cache = { angle: 0, y: 11, intensity: 0, color: 0 };
    function update () {
      rocks.rotation.x = cache.angle;

      light.intensity = cache.intensity;
      
      light.position.y = cache.y;
      sphere.position.y = cache.y;

      sphere.material.color = fromColor.clone().lerp(toColor, cache.color);
    }

    this.in = function () {
      TweenLite.to(cache, 1, { angle: 0.3, y: 20, intensity: 15, color: 1, onUpdate: update });
    };

    this.out = function (way) {
      var y = way === 'up' ? 11 : 20;
      TweenLite.to(cache, 1, { angle: 0, y: y, intensity: 0, color: 0, onUpdate: update });
    };

    var idleTween = TweenLite.to({ x: -2, z: -45 }, 2, { x: 2, z: -35, paused: true,
      onUpdate: function () {
        light.position.z = this.target.z;
        sphere.position.z = this.target.z;
      },
      onComplete: yoyo,
      onReverseComplete: yoyo
    });

    this.start = function () {
      idleTween.resume();
    };

    this.stop = function () {
      idleTween.pause();
    };

  }.bind(this));

  this.el = group;

  this.in = function () {};

  this.out = this.in;

  this.start = this.in;

  this.stop = this.in;
}

/**
 * Get white sphere
 *
 * @method getSphere
 * @return {THREE.Mesh}
 */
Rocks.prototype.getSphere = function () {
  var material = new THREE.MeshBasicMaterial({ color: '#0a0a0a', fog: false });
  var geometry = new THREE.SphereGeometry(5, 20, 20);
  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 11, -40);

  return mesh;
};

/**
 * Get light
 *
 * @method getLight
 * @return {THREE.Light}
 */
Rocks.prototype.getLight = function () {
  var light = new THREE.PointLight('#ffffff', 0, 50);
  light.position.set(0, 11, -40);

  return light;
};

module.exports = Rocks;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/yoyoUtil":66}],39:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var SPRITE3D = require('../libs/sprite3DLib');
var random = require('../utils/randomUtil');

/**
 * Animated smoke
 *
 * @class Smoke
 * @constructor
 * @param {Object} [options]
 * @param {String} [options.frontColor='#9b69b2'] Front layers color
 * @param {String} [options.backColor='#e1455f'] Back layers color
 * @param {Number} [options.layers=5] Planes number
 * @param {Array} [options.data=[]] Non random values
 * @requires jQuery, THREE, SPRITE3D, random
 */
function Smoke (options) {
  var parameters = jQuery.extend(Smoke.defaultOptions, options);

  var texture = new THREE.ImageUtils.loadTexture('./app/public/img/sprite-smoke.png');
  texture.flipY = false;

  this.sprite = new SPRITE3D.Sprite(texture, {
    horizontal: 8,
    vertical: 8,
    total: 64,
    duration: 50
  });

  var baseMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    opacity: 0.2
  });

  var backMaterial = baseMaterial.clone();
  backMaterial.color = new THREE.Color(parameters.backColor);

  var frontMaterial = baseMaterial.clone();
  frontMaterial.color = new THREE.Color(parameters.frontColor);

  var geometry = new THREE.PlaneGeometry(10, 10);

  this.el = new THREE.Object3D();

  for (var i = 0; i < parameters.layers; i++) {
    var positionX;
    var positionY;
    var positionZ;
    var rotationZ;
    var scale;

    if (parameters.data[i]) {
      positionX = parameters.data[i].positionX || random(-20, 20);
      positionY = parameters.data[i].positionY || random(-20, 20);
      positionZ = parameters.data[i].positionZ || random(-20, 20);
      rotationZ = parameters.data[i].rotationZ || random(0, Math.PI);
      scale = parameters.data[i].scale || random(1, 10);
    } else {
      positionX = random(-20, 20);
      positionY = random(-20, 20);
      positionZ = random(-20, 20);
      rotationZ = random(0, Math.PI);
      scale = random(1, 10);
    }

    var material = positionZ < 0 ? backMaterial : frontMaterial;

    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(positionX, positionY, positionZ);
    plane.rotation.z = rotationZ;
    plane.scale.set(scale, scale, 1);

    this.el.add(plane);
  }
}

Smoke.prototype.start = function () {
  this.sprite.start();
};

Smoke.prototype.stop = function () {
  this.sprite.stop();
};

Smoke.defaultOptions = {
  frontColor: '#9b69b2',
  backColor: '#e1455f',
  layers: 5,
  data: []
};

module.exports = Smoke;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../libs/sprite3DLib":5,"../utils/randomUtil":65}],40:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');

/**
 * Animated strip
 *
 * @class Strip
 * @constructor
 * @param {Object} [options]
 * @pram {Number} [options.count=10] Strips count
 * @pram {Array} [options.colors=['#ffffff']] Strips colors
 * @pram {Number} [options.width=10] Strip width
 * @pram {Number} [options.height=3] Strip height
 * @pram {Number} [options.speed=1] Animations speed
 * @pram {Array} [options.rangeX=[-50, 50]] X position range
 * @pram {Array} [options.rangeY=[-50, 50]] Y position range
 * @pram {Array} [options.rangeZ=[-50, 50]] Z position range
 * @requires jQuery, THREE, TweenLite, random
 */
function Strip (options) {
  this.parameters = jQuery.extend(Strip.defaultOptions, options);

  this.geometry = new THREE.PlaneGeometry(this.parameters.width, this.parameters.height);

  this.el = new THREE.Object3D();

  var materials = {};

  for (var i = 0; i < this.parameters.count; i++) {
    var x = random(this.parameters.rangeX[0], this.parameters.rangeX[1]);
    var y = random(this.parameters.rangeY[0], this.parameters.rangeY[1]);
    var z = random(this.parameters.rangeZ[0], this.parameters.rangeZ[1]);

    var color = this.parameters.colors[random(0, this.parameters.colors.length, true)];

    if (!materials[color]) {
      var material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
      });

      materials[color] = material;
    }

    var mesh = new THREE.Mesh(this.geometry, materials[color]);
    mesh.position.set(x, y, z);
    this.el.add(mesh);
  }

  this.from = this.geometry.vertices[0].x;
  this.to = this.geometry.vertices[1].x;
  this.cache =  { x: this.from };

  this.geometry.vertices[1].x = this.geometry.vertices[3].x = this.geometry.vertices[0].x;
};

Strip.prototype.update = function () {
  this.geometry.vertices[1].x = this.geometry.vertices[3].x = this.cache.x;
  this.geometry.verticesNeedUpdate = true;
  this.geometry.computeBoundingSphere();
};

Strip.prototype.in = function () {
  TweenLite.to(this.cache, this.parameters.speed, { x: this.to,
    onUpdate: this.update.bind(this)
  });
};

Strip.prototype.out = function () {
  TweenLite.to(this.cache, this.parameters.speed, { x: this.from,
    onUpdate: this.update.bind(this)
  });
};

Strip.defaultOptions = {
  count: 10,
  colors: ['#ffffff'],
  width: 10,
  height: 3,
  speed: 1,
  rangeX: [-50, 50],
  rangeY: [-50, 50],
  rangeZ: [-50, 50]
};

module.exports = Strip;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/randomUtil":65}],41:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);
  
/**
 * Display a 2D text in 3D space
 *
 * @class TextPanel
 * @constructor
 * @param {String} [text] Text to display, use '\n' for line break
 * @param {Object} [options]
 * @param {Number} [options.size=100] Font size
 * @param {String} [options.font='Futura'] Fonts
 * @param {String} [options.style='Bold'] Font style
 * @param {String} [options.align='center'] Center, left or right
 * @param {Number} [options.lineSpacing=20] Height lines
 * @param {String} [options.color='rgba(200, 200, 200, 1)'] Text color
 * @requires jQuery, THREE, TweenLite
 */
function TextPanel (text, options) {
  var parameters = jQuery.extend(TextPanel.defaultOptions, options);

  text = text || '';

  // split and clean the words
  var words = text.split('\n');
  var wordsCount = words.length;
  for (var i = 0; i < wordsCount; i++) {
    words[i] = words[i].replace(/^\s+|\s+$/g, '');
  }

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var font = parameters.style + ' ' + parameters.size + 'px' + ' ' + parameters.font;

  var texture = new THREE.Texture(canvas);

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    opacity: 0
  });

  // Group is exposed, mesh is animated
  var group = new THREE.Object3D();

  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  mesh.position.y = -20;
  group.add(mesh);

  group.visible = false;

  this.el = group;

  var cache = { y: mesh.position.y, opacity: mesh.material.opacity };

  function update () {
    mesh.position.y = cache.y;
    mesh.material.opacity = cache.opacity;
  }

  function drawText () {
    context.font = font;

    var maxWidth = 0;
    for (var j = 0; j < wordsCount; j++) {
      var tempWidth = context.measureText(words[j]).width;
      if (tempWidth > maxWidth) {
        maxWidth = tempWidth;
      }
    }

    var lineHeight = parameters.size + parameters.lineSpacing;
    var height = lineHeight * wordsCount;

    canvas.width = Math.ceil(maxWidth) + 20;
    canvas.height = Math.ceil(height) + 20;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = font;
    context.fillStyle = parameters.color;
    context.textAlign = parameters.align;
    context.textBaseline = 'top';
    for (var k = 0; k < wordsCount; k++) {
      var word = words[k];
      var left;

      if (parameters.align === 'left') {
        left = 0;
      } else if (parameters.align === 'center') {
        left = canvas.width / 2;
      } else {
        left = canvas.width;
      }

      context.fillText(word, left, lineHeight * k);
    }

    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(canvas.width / 20, canvas.height / 20);
    texture.needsUpdate = true;
  }

  drawText();

  if (document.fonts && document.fonts.load) {
    document.fonts.load(font).then(drawText);
  }

  this.in = function () {
    TweenLite.to(cache, 1.5, { y: 0, opacity: 1,
      onStart: function () { group.visible = true; },
      onUpdate: update
    });
  };

  this.out = function (way) {
    var y = way === 'up' ? -20 : 20;
    TweenLite.to(cache, 1, { y: y, opacity: 0,
      onUpdate: update,
      onComplete: function () { group.visible = false; }
    });
  };
}

TextPanel.defaultOptions = {
  size: 100,
  font: 'Futura, Trebuchet MS, Arial, sans-serif',
  style: 'Bold',
  align: 'center',
  lineSpacing: 20,
  color: 'rgba(200, 200, 200, 1)'
};

module.exports = TextPanel;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var loop = require('../utils/loopUtil');

/**
 * Animated wave
 *
 * @class Wave
 * @constructor
 * @param {Object} [options]
 * @param {Object} [options.amplitude=10] Vertical amplitude
 * @param {Object} [options.divisionSize=2] Grid division size
 * @param {Object} [options.divisionX=50] X axis divisions
 * @param {Object} [options.divisionY=50] Y axis divisions
 * @param {Object} [options.speed=10] Animation speed
 * @requires jQuery, THREE, TweenLite, loop
 */
function Wave (options) {
  this.parameters = jQuery.extend(Wave.defaultOptions, options);

  var plane = this.getPlane();
  
  var time = 0;

  var divisionsX = this.parameters.divisionsX;
  var divisionsY = this.parameters.divisionsY;

  function updateWave () {
    var i= 0;

    for (var x = 0; x <= divisionsX; x++) {
      for (var y = 0; y <= divisionsY; y++) {
        var vertex = plane.geometry.vertices[i++];
        vertex.z =
          (Math.sin(((x + 1) + time) * 0.2) * 2) +
          (Math.sin(((y + 1) + time) * 0.2) * 5);
      }
    }

    plane.geometry.verticesNeedUpdate = true;
    time += 0.1;
  }

  updateWave();

  var idleTween = TweenLite.to({}, 5, { paused: true, ease: window.Linear.easeNone,
    onUpdate: updateWave,
    onComplete: loop
  });

  this.el = plane;

  this.in = function (way) {
    plane.position.y = way === 'up' ? 20 : -20;
    TweenLite.to(plane.position, 1.5, { y: -10 });
  };

  this.out = function (way) {
    var y = way === 'up' ? -20 : 20;
    TweenLite.to(plane.position, 1, { y: y });
  };

  this.start = function () {
    idleTween.resume();
  };

  this.stop = function () {
    idleTween.pause();
  };
}

Wave.defaultOptions = {
  amplitude: 10,
  divisionSize: 2,
  divisionsX: 50,
  divisionsY: 50,
  speed: 10
};

/**
 * Get wave's plane
 *
 * @method getPlane
 * @return {THREE.Mesh}
 */
Wave.prototype.getPlane = function () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-wave.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);

  var material = new THREE.MeshLambertMaterial({
    map: texture,
    color: '#ffffff',
    side: THREE.DoubleSide
  });

  var geometry = new THREE.PlaneGeometry(
    this.parameters.divisionsX * this.parameters.divisionSize,
    this.parameters.divisionsY * this.parameters.divisionSize,
    this.parameters.divisionsX,
    this.parameters.divisionsY
  );

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -20;
  mesh.rotation.x = -Math.PI / 2;

  return mesh;
};

module.exports = Wave;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/loopUtil":62}],43:[function(require,module,exports){
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

'use strict';

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
 
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
},{}],44:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

'use strict';

(function () {
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP && oThis
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
})();
},{}],45:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

'use strict';

(function () {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {"use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {// shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if ( k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }
})();
},{}],46:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Ball = require('../objects3D/BallObject3D');
var Grid = require('../objects3D/GridObject3D');

var ballSection = new Section('ball');

var ball = new Ball();
ball.el.rotation.z = 2;
ballSection.add(ball.el);

var grid = new Grid({
  step: 5,
  stepsX: 11,
  stepsY: 11,
  loop: true
});
grid.el.rotation.set(1.5, 1, 2);
grid.el.position.x = -20;
ballSection.add(grid.el);

var text = new TextPanel(
  'F  O  R  M  A \n E  X  P  R  E  S  S  A  O',
  {
    align: 'left',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(15, 0, 15);
text.el.rotation.y = -0.4;
ballSection.add(text.el);

ball.el.visible = false;
grid.el.visible = false;

ballSection.onIn(function () {
  ball.in();
  grid.in();
  text.in();
});

ballSection.onOut(function (way) {
  text.out(way);
  grid.out(way);

  if (way === 'up') {
    ball.out();
  }
});

ballSection.onStart(function () {
  ball.start();
  grid.start();

  ball.el.visible = true;
  grid.el.visible = true;
});

ballSection.onStop(function () {
  ball.stop();
  grid.stop();

  ball.el.visible = false;
  grid.el.visible = false;
});

module.exports = ballSection;

},{"../classes/SectionClass":3,"../objects3D/BallObject3D":25,"../objects3D/GridObject3D":33,"../objects3D/TextPanelObject3D":41}],47:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var Beam = require('../objects3D/BeamObject3D');

var beamsSection = new Section('beams');

var leftBeam = new Beam({ color: '#808080', delay: 0.2 });
leftBeam.el.position.set(15, 25, -10);
beamsSection.add(leftBeam.el);

var middleBeam = new Beam({ color: '#ffffff', width: 4, cubeSize: 1, delay: 0.1 });
middleBeam.el.position.y = 15;
beamsSection.add(middleBeam.el);

var rightBeam = new Beam({ color: '#4c4c4c', delay: 0.4 });
rightBeam.el.position.set(-20, 30, -20);
beamsSection.add(rightBeam.el);

leftBeam.el.visible = false;
middleBeam.el.visible = false;
rightBeam.el.visible = false;

beamsSection.onIn(function () {
  leftBeam.in();
  middleBeam.in();
  rightBeam.in();
});

beamsSection.onOut(function (way) {
  leftBeam.out(way);
  middleBeam.out(way);
  rightBeam.out(way);
});

beamsSection.onStart(function () {
  leftBeam.start();
  middleBeam.start();
  rightBeam.start();

  leftBeam.el.visible = true;
  middleBeam.el.visible = true;
  rightBeam.el.visible = true;
});

beamsSection.onStop(function () {
  leftBeam.stop();
  middleBeam.stop();
  rightBeam.stop();

  leftBeam.el.visible = false;
  middleBeam.el.visible = false;
  rightBeam.el.visible = false;
});

module.exports = beamsSection;
},{"../classes/SectionClass":3,"../objects3D/BeamObject3D":26}],48:[function(require,module,exports){
(function (global){
'use strict';

var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var Section = require('../classes/SectionClass');

var City = require('../objects3D/CityObject3D');

var citySection = new Section('city');

var city = new City();
city.addGroup({
  name: 'shanghai',
  objs: {
    ground: './app/public/3D/shanghai-grounds.js',
    buildings: './app/public/3D/shanghai-buildings.js',
    towers: './app/public/3D/shanghai-towers.js'
  },
  outline: {
    ground: {
      offset: 0.2,
      solid: true
    }
  }
});

// city.el.rotation.y = Math.PI / 6;
city.el.rotation.y = 0;
city.el.rotation.z = Math.PI / 16;
city.el.position.set(5, -10, 0);
citySection.add(city.el);
city.showGroup('shanghai');

TweenLite.to(city.el.rotation, 30, { y: 2 * Math.PI, ease: window.Linear.easeNone,
  onComplete: function () {
    this.restart();
  }
});

citySection.onIn(function (way) {

});

citySection.onOut(function (way) {

});

citySection.onStart(function (way) {

});

citySection.onStop(function (way) {

});

module.exports = citySection;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/SectionClass":3,"../objects3D/CityObject3D":27}],49:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Drop = require('../objects3D/DropObject3D');

var dropSection = new Section('drop');

var drop = new Drop({ amplitude: 4 });
drop.el.rotation.x = -1.2;
drop.el.position.y = -10;
dropSection.add(drop.el);

var text = new TextPanel(
  'C  O  R    E \n R  U  P  T  U  R  A',
  {
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(-10, 8, 0);
text.el.rotation.y = 0;
dropSection.add(text.el);

drop.el.visible = false;

dropSection.onIn(function () {
  drop.in();
  text.in();
});

dropSection.onOut(function (way) {
  drop.out(way);
  text.out(way);
});

dropSection.onStart(function () {
  drop.start();

  drop.el.visible = true;
});

dropSection.onStop(function () {
  drop.stop();

  drop.el.visible = false;
});

module.exports = dropSection;

},{"../classes/SectionClass":3,"../objects3D/DropObject3D":28,"../objects3D/TextPanelObject3D":41}],50:[function(require,module,exports){
'use strict';
  
var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var LookAtField = require('../objects3D/LookAtFieldObject3D');

var endSection = new Section('end');

var text = new TextPanel(
  'C  O  N  C  L  U  S  A  O \n D  O    T  E  M  A',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
endSection.add(text.el);

var field = new LookAtField({
  count: 50
});
endSection.add(field.el);

endSection.onIn(function () {
  text.in();
  field.in();
});

endSection.onOut(function (way) {
  text.out(way);
  field.out(way);
});

module.exports = endSection;

},{"../classes/SectionClass":3,"../objects3D/LookAtFieldObject3D":36,"../objects3D/TextPanelObject3D":41}],51:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Face = require('../objects3D/FaceHpObject3D');
var Strips = require('../objects3D/StripsObject3D');

var faceSection = new Section('face');

var text = new TextPanel(
  'R  E  L  A  C  A  O \n D  O  S    T  E  M  A  S',
  {
    align: 'left',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(23, 0, 0);
text.el.rotation.y = -0.4;
faceSection.add(text.el);

var face = new Face();
face.el.position.y = -5;
face.el.rotation.x = -0.1;
face.el.rotation.z = 0.25;
faceSection.add(face.el);

var strips = new Strips({
  count: 10,
  colors: ['#444444', '#333333', '#222222'],
  rangeY: [-60, 60]
});
faceSection.add(strips.el);

face.el.visible = false;
strips.el.visible = false;

faceSection.onIn(function () {
  face.in();
  strips.in();
  text.in();
});

faceSection.onOut(function (way) {
  face.out(way);
  strips.out();
  text.out();
});

faceSection.onStart(function () {
  face.start();

  face.el.visible = true;
  strips.el.visible = true;
});

faceSection.onStop(function () {
  face.stop();

  face.el.visible = false;
  strips.el.visible = false;
});

module.exports = faceSection;

},{"../classes/SectionClass":3,"../objects3D/FaceHpObject3D":29,"../objects3D/StripsObject3D":40,"../objects3D/TextPanelObject3D":41}],52:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var Section = require('../classes/SectionClass');

var FlowField = require('../objects3D/FlowFieldObject3D');
var TextPanel = require('../objects3D/TextPanelObject3D');

var flowSection = new Section('flow');

var points = [
  new THREE.Vector3(0, 50, 20),
  new THREE.Vector3(20, 0, -10),
  new THREE.Vector3(-20, -100, 0)
];

var field = new FlowField(points, {
  subsAmplitude: 50,
  subsNumber: 10
});
flowSection.add(field.el);

var text = new TextPanel(
  'S  E  M  A  N  A \n D  E    2  2',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.z = -10;
text.el.rotation.y = 0.4;
flowSection.add(text.el);

field.el.visible = false;

var fieldIn = false;

flowSection.fieldIn = function () {
  if (fieldIn) {
    return false;
  }

  fieldIn = true;

  field.in();
};

flowSection.onIn(function () {
  text.in();
});

flowSection.onOut(function (way) {
  text.out(way);
});

flowSection.onStart(function () {
  field.start();

  field.el.visible = true;
});

flowSection.onStop(function () {
  field.stop();

  field.el.visible = false;
});

module.exports = flowSection;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../classes/SectionClass":3,"../objects3D/FlowFieldObject3D":30,"../objects3D/TextPanelObject3D":41}],53:[function(require,module,exports){
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

},{"../classes/SectionClass":3,"../objects3D/GalaxyObject3D":31,"../objects3D/TextPanelObject3D":41}],54:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var GravityGrid = require('../objects3D/GravityGridObject3D');

var gravitySection = new Section('gravity');

var grid = new GravityGrid({
  linesColor: '#666666'
});
grid.el.position.z = 0;
grid.el.rotation.x = -1;
gravitySection.add(grid.el);

grid.el.visible = false;

gravitySection.onIn(function () {
  grid.in();
});

gravitySection.onOut(function () {
  grid.out();
});

gravitySection.onStart(function () {
  grid.start();
});

gravitySection.onStop(function () {
  grid.stop();
});

gravitySection.show = function () {
  grid.el.visible = true;
};

gravitySection.hide = function () {
  grid.el.visible = false;
};

module.exports = gravitySection;
},{"../classes/SectionClass":3,"../objects3D/GravityGridObject3D":32}],55:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var HeightMap = require('../objects3D/HeightMapObject3D');

var heightSection = new Section('height');

var heightMap = new HeightMap({
  horizontal: true,
  vertical: false,
  plane: false,
  points: false,
  maps: [
    { name: 'A', url: './app/public/img/heightMap-A.jpg' },
    { name: 'B', url: './app/public/img/heightMap-B.jpg' },
    { name: 'O', url: './app/public/img/heightMap-O.jpg' }
  ]
});
heightMap.el.position.z = -10;
heightMap.el.rotation.y = -0.6;
heightSection.add(heightMap.el);

var text = new TextPanel(
  'P  R  I  N  C  I  P  A  I  S \n N  O  M  E  S',
  {
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40,
  }
);
text.el.position.set(-20, 0, 0);
text.el.rotation.y = 0;
heightSection.add(text.el);

heightMap.el.visible = false;

heightSection.onIn(function () {
  text.in();
});

heightSection.onOut(function (way) {
  text.out(way);
});

heightSection.onStart(function () {
  if (!heightMap.ready) {
    return false;
  }

  heightMap.start();
});

heightSection.onStop(function () {
  if (!heightMap.ready) {
    return false;
  }

  heightMap.stop();
});

heightSection.show = function () {
  heightMap.el.visible = true;
};

heightSection.hide = function () {
  heightMap.el.visible = false;
};

module.exports = heightSection;

},{"../classes/SectionClass":3,"../objects3D/HeightMapObject3D":34,"../objects3D/TextPanelObject3D":41}],56:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var Title = require('../objects3D/HelloTitleObject3D');
var Smoke = require('../objects3D/SmokeObject3D');

var helloSection = new Section('hello');

var title = new Title();
helloSection.add(title.el);

var smoke = new Smoke({  
  frontColor: '#4c4c4c',
  backColor: '#ffffff',
  layers: 3,
  data: [
    { positionX : 10.7, positionY: 3.9, positionZ: 17.8, rotationZ: 2.7, scale: 3.9 },
    { positionX : -2.8, positionY: 2.6, positionZ: -11, rotationZ: 0.7, scale: 7.7 },
    { positionX : 13, positionY: 19.5, positionZ: -1.3, rotationZ: 2, scale: 2.7 }
  ]
});

helloSection.add(smoke.el);

smoke.el.visible = false;

helloSection.onIn(function () {
  title.in();
});

helloSection.onOut(function () {
  title.out();
});

helloSection.onStart(function () {
  title.start();
});

helloSection.onStop(function () {
  title.stop();
});

var smokePlaying = false;

helloSection.smokeStart = function () {
  if (smokePlaying) {
    return false;
  }

  smokePlaying = true;

  smoke.start();

  smoke.el.visible = true;
};

helloSection.smokeStop = function () {
  if (!smokePlaying) {
    return false;
  }

  smokePlaying = false;

  smoke.stop();

  smoke.el.visible = false;
};

module.exports = helloSection;
},{"../classes/SectionClass":3,"../objects3D/HelloTitleObject3D":35,"../objects3D/SmokeObject3D":39}],57:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var Smoke = require('../objects3D/SmokeObject3D');
var Neon = require('../objects3D/NeonObject3D');

var neonsSection = new Section('neons');

var smoke = new Smoke({
  planesNumber: 3,
  frontColor: '#4c4c4c',
  backColor: '#ffffff',
  data: [
    { positionX : -2.5, positionY: -18.8, positionZ: -6, rotationZ: 2.7, scale: 8.5 },
    { positionX : -11.1, positionY: 10.3, positionZ: -10.4, rotationZ: 1.4, scale: 5.8 },
    { positionX : -15.1, positionY: -5.9, positionZ: -19.2, rotationZ: 1.6, scale: 7.4 }
  ]
});
neonsSection.add(smoke.el);

var neonA = new Neon();

var neonB = new Neon();
neonB.el.position.set(0, 0, 0);
neonB.el.rotation.z = 2;

var neonC = new Neon();
neonC.el.position.set(0, 13, 0);
neonC.el.rotation.z = 2;

var neonD = new Neon();
neonD.el.position.set(0, -13, 0);
neonD.el.rotation.z = 2;

neonsSection.add(neonA.el);
neonsSection.add(neonB.el);
neonsSection.add(neonC.el);
neonsSection.add(neonD.el);

neonA.el.visible = false;
neonB.el.visible = false;
neonC.el.visible = false;
neonD.el.visible = false;
smoke.el.visible = false;

neonsSection.onStart(function () {
  neonA.start();
  neonB.start();
  neonC.start();
  neonD.start();

  neonA.el.visible = true;
  neonB.el.visible = true;
  neonC.el.visible = true;
  neonD.el.visible = true;
});

neonsSection.onStop(function () {
  neonA.stop();
  neonB.stop();
  neonC.stop();
  neonD.stop();

  neonA.el.visible = false;
  neonB.el.visible = false;
  neonC.el.visible = false;
  neonD.el.visible = false;
});

var smokePlaying = false;

neonsSection.smokeStart = function () {
  if (smokePlaying) {
    return false;
  }

  smokePlaying = true;

  smoke.start();

  smoke.el.visible = true;
};

neonsSection.smokeStop = function () {
  if (!smokePlaying) {
    return false;
  }

  smokePlaying = false;

  smoke.stop();

  smoke.el.visible = false;
};

module.exports = neonsSection;
},{"../classes/SectionClass":3,"../objects3D/NeonObject3D":37,"../objects3D/SmokeObject3D":39}],58:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Rocks = require('../objects3D/RocksObject3D');

var rocksSection = new Section('rocks');

var rocks = new Rocks();
rocksSection.add(rocks.el);

var text = new TextPanel(
  'B  R  A  S  I  L \n 1  9  2  2',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(0, 0, 0);
text.el.rotation.y = 0;
rocksSection.add(text.el);
text.out('down');

rocks.el.visible = false;

rocksSection.onIn(function () {
  text.in();
  rocks.in();
});

rocksSection.onOut(function (way) {
  text.out('down');
  rocks.out(way);
});

rocksSection.onStart(function () {
  rocks.start();
});

rocksSection.onStop(function () {
  rocks.stop();
});

rocksSection.show = function () {
  rocks.el.visible = true;
};

rocksSection.hide = function () {
  rocks.el.visible = false;
};

module.exports = rocksSection;

},{"../classes/SectionClass":3,"../objects3D/RocksObject3D":38,"../objects3D/TextPanelObject3D":41}],59:[function(require,module,exports){
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

},{"../classes/SectionClass":3,"../objects3D/WaveObject3D":42}],60:[function(require,module,exports){
'use strict';

/**
 * Debounce a function
 * https://github.com/jashkenas/underscore
 *
 * @method debounce
 * @param {Function} [callback]
 * @param {Number} [delay]
 * @param {Boolean} [immediate]
 * @return {Function}
 */
function debounce (callback, delay, immediate) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    var callLater = function () {
      timeout = null;
      if (!immediate) {
        callback.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callLater, delay);
    if (callNow) {
      callback.apply(context, args);
    }
  };
}

module.exports = debounce; 
},{}],61:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Dilate a geometry along the normals
 *
 * @method dilate
 * @param {THREE.Object3D} [geometry] Geometry to dilate
 * @param {Number} [offset] Desired offset
 */
function dilate (geometry, offset) {
  geometry.computeVertexNormals();

  // vertices normals
  var vertexNormals = new Array(geometry.vertices.length);

  for (var i = 0, j = geometry.faces.length; i < j; i++) {
    var face = geometry.faces[i];
    
    if (face instanceof THREE.Face4) {
      vertexNormals[face.a] = face.vertexNormals[0];
      vertexNormals[face.b] = face.vertexNormals[1];
      vertexNormals[face.c] = face.vertexNormals[2];
      vertexNormals[face.d] = face.vertexNormals[3]; 
    } else if (face instanceof THREE.Face3) {
      vertexNormals[face.a] = face.vertexNormals[0];
      vertexNormals[face.b] = face.vertexNormals[1];
      vertexNormals[face.c] = face.vertexNormals[2];
    }
  }

  // offset vertices
  for (var k = 0, l = geometry.vertices.length; k < l; k++) {
    var vertex = geometry.vertices[k];
    var normal = vertexNormals[k];

    vertex.x += normal.x * offset;
    vertex.y += normal.y * offset;
    vertex.z += normal.z * offset;
  }
}

module.exports = dilate;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],62:[function(require,module,exports){
'use strict';

/**
 * Set loop on a TweenLite tween
 * must be passed on onComplete
 *
 * @method loop
 */
function loop () {
  /*jshint validthis: true */
  
  this.restart();
}

module.exports = loop;
},{}],63:[function(require,module,exports){
'use strict';

/**
 * Map a value from one range to another
 *
 * @method map
 * @param {Number} [value] Value to map
 * @param {Array} [oldRange] Range to map from
 * @param {Array} [newRange] Range to map to
 * @return {Number} Mapped value
 */
function map (value, oldRange, newRange) {
  var newValue = (value - oldRange[0]) * (newRange[1] - newRange[0]) / (oldRange[1] - oldRange[0]) + newRange[0];
  return Math.min(Math.max(newValue, newRange[0]) , newRange[1]);
}

module.exports = map;
},{}],64:[function(require,module,exports){
// http://mrl.nyu.edu/~perlin/noise/
var ImprovedNoise = function () {
  var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
       23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
       174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
       133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
       89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
       202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
       248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
       178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
       14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
       93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

  for ( var i = 0; i < 256 ; i++ ) {

      p[ 256 + i ] = p[ i ];

  }

  function fade( t ) {

      return t * t * t * ( t * ( t * 6 - 15 ) + 10 );

  }

  function lerp( t, a, b ) {

      return a + t * ( b - a );

  }

  function grad( hash, x, y, z ) {

      var h = hash & 15;
      var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
      return ( ( h & 1 ) == 0 ? u : -u ) + ( ( h & 2 ) == 0 ? v : -v );

  }

  return {

      noise: function ( x, y, z ) {

          var floorX = Math.floor( x ), floorY = Math.floor( y ), floorZ = Math.floor( z );

          var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

          x -= floorX;
          y -= floorY;
          z -= floorZ;

          var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

          var u = fade( x ), v = fade( y ), w = fade( z );

          var A = p[ X ] + Y, AA = p[ A ] + Z, AB = p[ A + 1 ] + Z, B = p[ X + 1 ] + Y, BA = p[ B ] + Z, BB = p[ B + 1 ] + Z;

          return lerp( w, lerp( v, lerp( u, grad( p[ AA ], x, y, z ),
                 grad( p[ BA ], xMinus1, y, z ) ),
                 lerp( u, grad( p[ AB ], x, yMinus1, z ),
                 grad( p[ BB ], xMinus1, yMinus1, z ) ) ),
                 lerp( v, lerp( u, grad( p[ AA + 1 ], x, y, zMinus1 ),
                 grad( p[ BA + 1 ], xMinus1, y, z - 1 ) ),
                 lerp( u, grad( p[ AB + 1 ], x, yMinus1, zMinus1 ),
                 grad( p[ BB + 1 ], xMinus1, yMinus1, zMinus1 ) ) ) );

      }
  }
}

var currentRandom = Math.random;

// Pseudo-random generator
function Marsaglia(i1, i2) {
  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z=i1 || 362436069, w= i2 || 521288629;
  var nextInt = function() {
    z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
    w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
    return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
  };
 
  this.nextDouble = function() {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };
  this.nextInt = nextInt;
}
Marsaglia.createRandomized = function() {
  var now = new Date();
  return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};      

// Noise functions and helpers
function PerlinNoise(seed) {
  var rnd = seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized();
  var i, j;
  // http://www.noisemachine.com/talk1/17b.html
  // http://mrl.nyu.edu/~perlin/noise/
  // generate permutation
  var p = new Array(512);
  for(i=0;i<256;++i) { p[i] = i; }
  for(i=0;i<256;++i) { var t = p[j = rnd.nextInt() & 0xFF]; p[j] = p[i]; p[i] = t; }
  // copy to avoid taking mod in p[0];
  for(i=0;i<256;++i) { p[i + 256] = p[i]; }
 
  function grad3d(i,x,y,z) {        
    var h = i & 15; // convert into 12 gradient directions
    var u = h<8 ? x : y,                
        v = h<4 ? y : h===12||h===14 ? x : z;
    return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
  }

  function grad2d(i,x,y) {
    var v = (i & 1) === 0 ? x : y;
    return (i&2) === 0 ? -v : v;
  }
 
  function grad1d(i,x) {
    return (i&1) === 0 ? -x : x;
  }
 
  function lerp(t,a,b) { return a + t * (b - a); }
   
  this.noise3d = function(x, y, z) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
    var p0 = p[X]+Y, p00 = p[p0] + Z, p01 = p[p0 + 1] + Z, p1  = p[X + 1] + Y, p10 = p[p1] + Z, p11 = p[p1 + 1] + Z;
    return lerp(fz,
      lerp(fy, lerp(fx, grad3d(p[p00], x, y, z), grad3d(p[p10], x-1, y, z)),
               lerp(fx, grad3d(p[p01], x, y-1, z), grad3d(p[p11], x-1, y-1,z))),
      lerp(fy, lerp(fx, grad3d(p[p00 + 1], x, y, z-1), grad3d(p[p10 + 1], x-1, y, z-1)),
               lerp(fx, grad3d(p[p01 + 1], x, y-1, z-1), grad3d(p[p11 + 1], x-1, y-1,z-1))));
  };
 
  this.noise2d = function(x, y) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255;
    x -= Math.floor(x); y -= Math.floor(y);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
    var p0 = p[X]+Y, p1  = p[X + 1] + Y;
    return lerp(fy,
      lerp(fx, grad2d(p[p0], x, y), grad2d(p[p1], x-1, y)),
      lerp(fx, grad2d(p[p0 + 1], x, y-1), grad2d(p[p1 + 1], x-1, y-1)));
  };

  this.noise1d = function(x) {
    var X = Math.floor(x)&255;
    x -= Math.floor(x);
    var fx = (3-2*x)*x*x;
    return lerp(fx, grad1d(p[X], x), grad1d(p[X+1], x-1));
  };
}

//  these are lifted from Processing.js
// processing defaults
var noiseProfile = { generator: undefined, octaves: 4, fallout: 0.5, seed: undefined};

function noise(x, y, z) {
  if(noiseProfile.generator === undefined) {
    // caching
    noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
  }
  var generator = noiseProfile.generator;
  var effect = 1, k = 1, sum = 0;
  for(var i=0; i<noiseProfile.octaves; ++i) {
    effect *= noiseProfile.fallout;        
    switch (arguments.length) {
    case 1:
      sum += effect * (1 + generator.noise1d(k*x))/2; break;
    case 2:
      sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
    case 3:
      sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break;
    }
    k *= 2;
  }
  return sum;
}

module.exports = noise;
},{}],65:[function(require,module,exports){
'use strict';

/**
 * Return a random value in a specified range
 *
 * @method random
 * @param {Number} [low] Lowest value possible
 * @param {Number} [high] Highest value possible
 * @param {Boolean} [round=false] Floor the value?
 * @return {Number} Random value
 */
function random (low, high, round) {
  round = round || false;
  
  var randomValue = Math.random() * (high - low) + low;

  if (round) {
    return Math.floor(randomValue);
  }
  
  return randomValue;
}

module.exports = random;
},{}],66:[function(require,module,exports){
'use strict';

/**
 * Set yoyo on a TweenLite tween
 * must be passed on onComplete and onReverseComplete
 *
 * @method yoyo
 */
function yoyo () {
  /*jshint validthis: true */
  
  if (this.reversed()) {
    this.restart();
  } else {
    this.reverse();
  }
}

module.exports = yoyo;
},{}]},{},[7]);
