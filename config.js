import _ from 'lodash';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const ROOT = __dirname;
const ENV = argv.env || 'dev';

const SRC = `${ROOT}/src/renderer/`;
const DEST = `${ROOT}/app/renderer/`;
const DEST_APP = `${ROOT}/app/`;

const paths = {
  src: `${SRC}`,
  dist: `${DEST}`,
  distApp: `${DEST_APP}`,
  view: {
    src: `${SRC}views/pages/**/!(_)*.ejs`,
    dir: `${SRC}views/`,
    watch: `${SRC}views/**/*.ejs`,
    dist: `${DEST}`,
  },
  style: {
    src: `${SRC}styles/**/!(_)*.scss`,
    dir: `${SRC}styles/`,
    watch: `${SRC}styles/**/*.scss`,
    dist: `${DEST}assets/css/`,
  },
  script: {
    src: `${SRC}scripts/**/!(_)*.js`,
    srcMain: `${ROOT}/src/main/main.js`,
    dir: `${SRC}scripts/`,
    watch: `${SRC}scripts/**/*.(js|glsl|vs|fs|vert|frag)`,
    watchMain: `${ROOT}/src/main/**/*.(js|glsl|vs|fs|vert|frag)`,
    dist: `${DEST}assets/js/`,
    distMain: `${DEST_APP}/`,
    // headタグで読み込みscripts（※更新時は再度ビルドが必要）
    libsHead: [],
    // 通常のbodyタグ末尾で読み込みscripts（※更新時は再度ビルドが必要）
    libs: [
      `${ROOT}/node_modules/jquery/dist/jquery.min.js`,
      `${ROOT}/node_modules/lodash/lodash.min.js`,
      `${ROOT}/node_modules/gsap/src/minified/TweenMax.min.js`,
      `${ROOT}/src/renderer/scripts/libs/_preload.js`,
    ],
  },
  image: {
    src: `${SRC}images/**/*`,
    dir: `${SRC}images/`,
    watch: `${SRC}images/**/*`,
    dist: `${DEST}assets/images/`,
  },
  static: {
    // font, htaccessなど
    src: [`${SRC}static/**/*`, `!${SRC}static/**/.gitkeep`],
    dir: `${SRC}static/`,
    watch: `${SRC}static/**/*`,
    dist: `${DEST}`,
  },
};

const constants = {
  default: {
    url: '/',
    apiUrl: '/',
    contentsPath: `/`,
    assetsPath: `/assets/`,
    gaID: '',
    ogpAppID: '',
    mqBreakpoint: [
      { type: 'SP', min: undefined, max: 767 },
      { type: 'TAB', min: 768, max: 1023 },
      { type: 'PC', min: 1024, max: undefined },
    ],
  },
  dev: {
    // url: 'http://localhost:3000/',
    // apiUrl: '/api/',
    // contentsPath: `/`,
    // assetsPath: `/assets/`,
    // gaID: '',
    // ogpAppID: '',
  },
  stag: {
    // url: 'http://staging.example.com/',
    // apiUrl: '/api/',
    // contentsPath: `/`,
    // assetsPath: `/assets/`,
    // gaID: '',
    // ogpAppID: '',
  },
  prod: {
    // url: 'http://example.com/',
    // apiUrl: '/api/',
    // contentsPath: `/`,
    // assetsPath: `/assets/`,
    // gaID: '',
    // ogpAppID: '',
  },
};

const settings = {
  default: {
    view: {
      changed: false,
      minify: false,
    },
    style: {
      changed: false,
      minify: false,
      sourcemap: true,
    },
    script: {
      changed: false,
      Uglify: false,
      sourcemap: true,
    },
    image: {
      minify: false,
    },
    minifier: {
      removeComments: true,
      collapseWhitespace: true,
    },
    ejs: {
      options: {},
      settings: {
        ext: '.html',
      },
    },
    cssMqpacker: {},
    sass: {
      options: {
        outputStyle: 'expanded',
      },
    },
    clean: {
      patterns: [`${DEST_APP}**/*`, `!${DEST_APP}package.json`],
      options: {},
    },
    cleanDirectory: {
      path: `${DEST}`,
    },
  },
  dev: {},
  stag: {
    view: {
      minify: true,
    },
    style: {
      minify: true,
      sourcemap: false,
    },
    script: {
      Uglify: true,
      sourcemap: false,
    },
    image: {
      minify: false,
    },
  },
  prod: {
    view: {
      minify: true,
    },
    style: {
      minify: true,
      sourcemap: false,
    },
    script: {
      Uglify: true,
      sourcemap: false,
    },
    image: {
      minify: false,
    },
  },
};

const config = {
  env: ENV,
  paths,
  constants: _.merge({}, constants.default, constants[ENV]),
  settings: _.merge({}, settings.default, settings[ENV]),
  isWatch: false,
};

export default config;
