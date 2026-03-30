'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = require('jquery');
var TweenLite = require('tweenlite');
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
